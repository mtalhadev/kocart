var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var User = require('../models/user');
var Review = require('../models/review');
var Product = require('../models/product');
var Question = require('../models/question');
var Cart = require('../models/cart');
var Category = require('../models/category');
var bcrypt = require('bcryptjs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Testing Froms -----------------------------------------------------------------------

router.get('/form', function(req, res, next) {
  res.render('form', {title: "The Form"});
});

router.get('/carts', function(req, res, next) {
  res.render('form', {title: "The Form"});
});

router.get('/add-product', function(req, res, next) {
  res.render('add-product', {title: "The Form"});
});

router.get('/view-product', function(req, res, next) {
  res.render('view-product', {title: "The Form"});
});

router.get('/add-product-admin', function(req, res, next) {
  res.render('add-product-admin', {title: "The Form"});
});

router.get('/add-category-admin', function(req, res, next) {
  res.render('add-category-admin', {title: "The Form"});
});

router.get('/view-category-admin', function(req, res, next) {
  res.render('view-category-admin', {title: "The Form"});
});

router.get('/viewCart', function(req, res, next) {
  res.render('viewCart', {title: "The Form"});
});

router.get('/view-orders', function(req, res, next){
  // Order.insertMany({status:"not checked",total_price:6000, address:"house 1", user_id:"123321", products:[{id:"5e3fc275c4847248e09a9a58", title:"MEDIHEAL BT21 KOYA FACE POINT MASK", quantity:2, sale_price:3000}]});
  res.render('view-orders', {title: "The Form"});
});

router.get('/reviewProduct', function(req, res, next){
  // Order.insertMany({status:"not checked",total_price:6000, address:"house 1", user_id:"123321", products:[{id:"5e3fc275c4847248e09a9a58", title:"MEDIHEAL BT21 KOYA FACE POINT MASK", quantity:2, sale_price:3000}]});
  res.render('reviewProduct', {title: "The Form"});
});

//End Testing Froms -------------------------------------------------------------------

router.post('/signup', function(req, res, next){
  console.log("Fname: "+req.body.fname);
  var fname = req.body.fname,
      lname = req.body.lname,
      email = req.body.email,
      country = req.body.country,
      pass;
      bcrypt.hash(req.body.password, 10, function(err, hash) {
          if(err) {
            console.log(err);
            throw err;};
          pass = hash;
      });
  User.find({email:email}).exec(function(err, result){
    if(err) throw err;
    if(result.length > 0){
        res.json("User Exists");
    }
    else{
        User.insertMany([{fname:fname, lname:lname, email:email, password:pass, country:country}]);
        res.json("User Registered");
    }
  });
});

router.post('/checkuser', function(req, res, next){
  User.find(
    {
      email:req.body.email
    }).exec(function(err, result){
    if(err) {throw err};
    if(result.length > 0) {
      res.json(result).end();
    } else {
      User.insertMany(
        {
          fname : req.body.fname,
          lname : req.body.lname,
          email : req.body.email,
          password : req.body.password,
          country : req.body.country,
          wallet : 0,
        });
      User.find({email:req.body.email}).exec(function(err, user) {
        res.json(user).end();
      });
    }
  });
});

router.post('/login', function(req, res, next){
  var email = req.body.email,
      password = req.body.password;
  User.find({email:email}).exec(function(err, user){
      if(err) throw err;
      if(user.length > 0){
          bcrypt.compare(password, user[0].password, function(err, result) {
              if(err) throw err;
              if(result == true){
                  res.json(user);
              }
              else{
                  res.json("Invalid Password");
              }
          });
      }
      else{
          res.json("Invalid User_id");
      }
  });
});

router.post('/getUserByEmail', function(req, res, next) {
  User.find({email : req.body.email}).exec(function(err, result){
    if(err) throw err;
    res.status(200).json(result).end();
  });
});

router.post('/updateWallet', function(req, res, next) {
  User.findOneAndUpdate(
    {
      _id : req.body._id,
    },
    {
      wallet : req.body.wallet,
    },
    (err, user) => {
      if (err) {
        throw err;
      } else {
        User.find({_id : req.body._id}).exec(function(err, result){
          if(err) throw err;
          res.status(200).json(result).end();
        });
      }
    }
  );
});



router.get('/reviews', function(req, res, next){
  Review.find({}).exec(function(err, result){
    if(err) throw err;
    res.json(result);
  });
});

router.post('/review', function(req, res, next){
  var fname = req.body.fname,
      lname = req.body.lname,
      product_id = req.body.product,
      rating = req.body.rating;
  Review.insertMany([{fname:fname, lname:lname, product_id:product_id, rating:rating}]);
  res.json("Review Submitted!!!");
});

router.get('/products', function(req, res, next){
  Product.find({}).exec(function(err, result){
    if(err) throw err;
    res.json(result);
  })
});

router.get('/orders', function(req, res, next){
  Order.find({}).exec(function(err, result){
    if(err) throw err;
    res.json(result);
  });
});



router.get('/product/:serial', function(req, res, next){
  Product.find({serial:req.params.serial}).exec(function(err, result){
    if(err) throw err;
    res.json(result);
  })
});

router.get('/product/filter_serial', function(req, res, next){
  var id = req.body.id;
  Product.find({serial:id}).exec(function(err, result){
    if(err) throw err;
    res.json(result);
  })
});

router.get('/product/filter_price', function(req, res, next){
  var lprice = req.body.lp,
      hprice = req.body.hp;
  Product.find({ $and:[ {sale_price:{$gte:lprice}}, {sale_price:{$lte:hprice}} ] }).exec(function(err, result){
    if(err) throw err;
    res.json(result);
  })
});

router.post('/product', function(req, res, next){
  var serial = req.body.serial,
      title = req.body.title,
      stock_price = req.body.stock_price,
      sale_price = req.body.sale_price,
      quantity = req.body.quantity,
      description = req.body.description,
      colors = req.body.colors,
      sizes = req.body.sizes,
      categories = req.body.category,
      image = req.body.image,
      vendor = req.body.vendor;
  Product.findOne({serial:serial}).exec(function(err, result){
    if(err) throw err;
    if(result !== null){
        res.json("Product Exists");
    }
    else{
        Product.insertMany([{serial:serial, title:title, stock_price:stock_price, sale_price:sale_price, quantity:quantity, description:description, colors:colors, sizes:sizes, categories:categories, image:image, vendor:vendor}]);
        res.json("Product Entered");
    }
  });
});

router.get('/product_reviews/:serial', function(req, res, next){
  Review.find({product_id:req.params.serial}).exec(function(err, result){
    if(err) throw err;
    res.json(result);
  })
});

router.get('/products/:category', function(req, res, next){
  Review.find({product_id:req.params.category}).exec(function(err, result){
    if(err) throw err;
    res.json(result);
  })
});

router.get('/product/delete/:serial', function(req, res, next) {
  Product.deleteOne(
    {
      serial : req.params.serial,
    },
    (err, result) => {
      if (err) {
          throw err;
      } else {
          res.status(200).json({ msg: "Successfully deleted." });
          res.end();
      }
  }
  );
});

router.post('/product/update', function(req, res, next) {
  Product.findOneAndUpdate(
    {
      serial : req.body.serial,
    },
    {
      title : req.body.title,
      stock_price : req.body.stock_price,
      sale_price : req.body.sale_price,
      quantity : req.body.quantity,
      description : req.body.description,
      colors : req.body.colors,
      sizes : req.body.sizes,
      categories : req.body.category,
      image: req.body.image,
    },
    (err, product) => {
      if (err) {
        throw err;
    } else {
        res.status(200).json(product);
        res.end();
    }
    }
  );
});

router.get('/questions', function(req, res, next){
  Question.find({}).exec(function(err, result){
    if(err) throw err;
    res.json(result);
  })
});

router.post('/question', function(req, res, next){
  var text = req.body.text,
      time = new Date(),
      date_time = time.getDate + "/" + time.getMonth()+1 + "/" + time.getFullYear();
  Question.insertMany([{text:text, date_time:date_time}]);
  res.json("Query Submitted");
});

router.post('/addtocart', function(req, res, next){
  var product = req.body.name,
      qty = req.body.quantity,
      email = req.body.email;
  Cart.find({email:email})
});



//  Vendor routes. --------------------------------------------------------------------------------


/**
 * Add Product
 * https://localhost:3000/vendor/addProduct
 * Method: POST
 * Post: serial, title, stock_price, sale_price, quantity, description, colors, sizes, categories, image, vendor
 */
router.post('/vendor/addProduct', function(req, res, next) {
  var serial = req.body.serial,
      title = req.body.title,
      stock_price = req.body.stock_price,
      sale_price = req.body.sale_price,
      quantity = req.body.quantity,
      description = req.body.description,
      colors = req.body.colors,
      sizes = req.body.sizes,
      categories = req.body.category,
      image = req.body.image,
      vendor = req.body.vendor;

      Product.findOne({serial:serial, vendor:vendor}).exec(function(err, result){
        if(err){ 
          res.json(err);
          throw err;
        } else if(result !== null){
          res.json(result);
            res.json("Product Exists");
        }
        else{
            Product.insertMany([{serial:serial, title:title, stock_price:stock_price, sale_price:sale_price, quantity:quantity, description:description, colors:colors, sizes:sizes, categories:categories, image:image, vendor:vendor}]);
            res.json("Product Entered");
        }
      });
});

router.post('/vendor/updateProduct', function(req, res, next) {
  Product.findOneAndUpdate(
    {
      serial : req.body.serial,
      vendor : req.body.vendor,
    },
    {
      title : req.body.title,
      stock_price : req.body.stock_price,
      sale_price : req.body.sale_price,
      quantity : req.body.quantity,
      description : req.body.description,
      colors : req.body.colors,
      sizes : req.body.sizes,
      categories : req.body.category,
      image: req.body.image,
    },
    (err, product) => {
      if (err) {
        throw err;
    } else {
        res.status(200).json(product);
        res.end();
    }
    }
  );
});

router.post('/vendorEditProductHelper', function(req, res, next) {
  Product.find({serial:req.body.serial, vendor : req.body.vendor}).exec(function(err, result){
    if(err) {throw err;}
    else {
      // res.json(result);
    res.render("editProduct", {result:result});
    }
  })
});

router.post('/vendorDeleteProduct', function(req, res, next) {
  Product.deleteOne(
    {
      serial : req.body.serial,
      vendor : req.body.vendor
    },
    (err, result) => {
      if (err) {
          throw err;
      } else {
          res.status(200).json({ msg: "Successfully deleted." });
          res.end();
      }
  }
  );
});

router.post('/vendorGetProducts', function(req, res, next){
  Product.find({vendor : req.body.vendor}).exec(function(err, result){
    if(err) throw err;
    res.json(result);
  })
});


router.get('/categories', function(req, res, next) {
  Category.find({}).exec(function(err, result) {
    if(err) {
      console.log(err);
      throw err};
    res.json(result);
  });
});

router.get('/categories/:category', function(req, res, next) {
  Category.insertMany({category:req.params.category});
});


//  Admin CRUD Products routes. --------------------------------------------------------------------------------

router.post('/admin/addProduct', function(req, res, next) {
  var serial = req.body.serial,
      title = req.body.title,
      stock_price = req.body.stock_price,
      sale_price = req.body.sale_price,
      quantity = req.body.quantity,
      description = req.body.description,
      colors = req.body.colors,
      sizes = req.body.sizes,
      categories = req.body.category,
      image = req.body.image,
      vendor = req.body.vendor;

      Product.findOne({serial:serial, vendor:vendor}).exec(function(err, result){
        if(err){ 
          res.json(err);
          throw err;
        } else if(result !== null){
          res.json(result);
            res.json("Product Exists");
        }
        else{
            Product.insertMany([{serial:serial, title:title, stock_price:stock_price, sale_price:sale_price, quantity:quantity, description:description, colors:colors, sizes:sizes, categories:categories, image:image, vendor:vendor}]);
            res.json("Product Entered");
        }
      });
});

router.post('/admin/updateProduct', function(req, res, next) {
  Product.findOneAndUpdate(
    {
      serial : req.body.serial,
      vendor : req.body.vendor,
    },
    {
      title : req.body.title,
      stock_price : req.body.stock_price,
      sale_price : req.body.sale_price,
      quantity : req.body.quantity,
      description : req.body.description,
      colors : req.body.colors,
      sizes : req.body.sizes,
      categories : req.body.category,
      image: req.body.image,
    },
    (err, product) => {
      if (err) {
        throw err;
    } else {
        res.status(200).json(product);
        res.end();
    }
    }
  );
});

router.post('/adminEditProductHelper', function(req, res, next) {
  Product.find({serial:req.body.serial, vendor : req.body.vendor}).exec(function(err, result){
    if(err) {throw err;}
    else {
      // res.json(result);
    res.render("editProduct", {result:result});
    }
  })
});

router.post('/adminDeleteProduct', function(req, res, next) {
  Product.deleteOne(
    {
      serial : req.body.serial,
      vendor : req.body.vendor
    },
    (err, result) => {
      if (err) {
          throw err;
      } else {
          res.status(200).json({ msg: "Successfully deleted." });
          res.end();
      }
  }
  );
});

router.post('/adminGetProducts', function(req, res, next){
  Product.find({}).exec(function(err, result){
    if(err) throw err;
    res.json(result);
  })
});

//  Admin CRUD Categories routes. --------------------------------------------------------------------------------

router.post('/admin/addCategory', function(req, res, next) {
  var category = req.body.category;

      Category.findOne({category:category}).exec(function(err, result){
        if(err){ 
          res.json(err);
          throw err;
        } else if(result !== null){
          res.json(result);
            res.json("Category Exists");
        }
        else{
            Category.insertMany([{category:category}]);
            res.json("Category Entered");
        }
      });
});

router.post('/admin/updateCategory', function(req, res, next) {
  Category.findOneAndUpdate(
    {
      _id : req.body._id,
    },
    {
      category : req.body.category,
    },
    (err, category) => {
      if (err) {
        throw err;
    } else {
        res.status(200).json(category);
        res.end();
    }
    }
  );
});

router.post('/adminEditCategoryHelper', function(req, res, next) {
  Category.find({_id:req.body._id}).exec(function(err, result){
    if(err) {throw err;}
    else {
      // res.json(result);
    res.render("editCategory", {result:result});
    }
  })
});

router.post('/adminDeleteCategory', function(req, res, next) {
  Category.deleteOne(
    {
      category : req.body.category
    },
    (err, result) => {
      if (err) {
          throw err;
      } else {
          res.status(200).json({ msg: "Successfully deleted." });
          res.end();
      }
    }
  );
});

router.post('/adminGetCategories', function(req, res, next){
  Product.find({}).exec(function(err, result){
    if(err) throw err;
    res.json(result);
  })
});


//  Admin Change order status. --------------------------------------------------------------------------------

router.get('/adminGetOrders', function(req, res, next){
  Order.find({}).exec(function(err, result){
    if(err) throw err;
    res.json(result);
  })
});

router.post('/admin/updateOrder', function(req, res, next) {
  Order.findOneAndUpdate(
    {
      _id : req.body.orderId,
    },
    {
      status : req.body.status,
    },
    (err, order) => {
      if (err) {
        throw err;
    } else {
        res.status(200).json(order);
        res.end();
    }
    }
  );
});

router.post('/adminApproveOrder', function(req, res, next) {
  Order.findOneAndUpdate(
    {
      _id : req.body._id,
    },
    {
      status :"Approved",
    },
    (err, order) => {
      if (err) {
        throw err;
    } else {
        res.status(200).json(order);
        res.end();
    }
    }
  );
});

router.post('/adminDeleteOrder', function(req, res, next) {
  Order.findOneAndUpdate(
    {
      _id : req.body._id,
    },
    {
      status :"Disapproved",
    },
    (err, order) => {
      if (err) {
        throw err;
    } else {
        res.status(200).json(order);
        res.end();
    }
    }
  );
});


// CRUD Carts----------------------------------------------------------------------------------------


router.post('/addUpdateCart', function(req, res, next) {Cart.findOneAndUpdate(
    {
      user_id : req.body.user_id,
    },
    {
      products : req.body.products,
    },
    (err, cart) => {
      if(err) {
        throw err;
      }
      if(cart !== null) {
        res.status(200).json(cart);
        res.send();
      } else {
        Cart.insertMany(
          {
            user_id : req.body.user_id,
            products : req.body.products,
          },
          (err, result) => {
            if(err) throw err;
            res.status(200).json(result);
          }
        );
      }
    }
  );
});

router.post('/getMyCart', function(req, res, next) {
  Cart.find({user_id : req.body.user_id}).exec(function(err, result) {
    if(err) throw err;
    if(result !== null) {
      res.json(result);
    } else {
      res.status(404).json({msg:"No record found!"}).send();
    }
  });
});
router.get('/getmycart1', function(req, res, next) {
  Cart.find({user_id : "1223321"}).exec(function(err, result) {
    if(err) throw err;
    if(result !== null) {
      res.status(200).json(result);
      res.end();
    } else {
      res.status(404).json({msg:"No record found!"}).send();
    }
  });
});

router.post('/removeCart', function(req, res, next) {
  Cart.deleteOne(
    {
      user_id : req.body.user_id,
    },
    function(err, result) {
      if(err) throw err;
      res.status(200).json({msg:"Successfully delete."}).send();
    }
  );
});


// Orders Placement -----------------------------------------------------------------------------------

router.post('/placeOrder', function(req,res,next){
  Cart.find({user_id : req.body.user_id}).exec(function(err, result) {
    if(err) throw err;
    if(result !== null) {
      Order.insertMany({
        products : result[0].products,
        user_id : result[0].user_id,
        name : req.body.name,
        email : req.body.email,
        contact : req.body.contact,
        address1 : req.body.address1,
        address2: req.body.address2,
        country : req.body.country,
        postal_code:req.body.postal_code,
        city:req.body.city,
        total_price : req.body.total_price,
        status : "Pending",
        card_number: req.body.card_number,
        card_name: req.body.card_name,
        card_exp_date: req.body.card_exp_date,
        card_VCC: req.body.card_VCC,
      });

      Cart.deleteOne({user_id : req.body.user_id}, function(err, result){
        if(err) throw err;
      });
      res.status(200).json({msg:"Successfully Placed."}).send();
    } else {
      res.status(404).json({msg:"Error"}).send();
    }
  });
});

router.post('/getOrders', function(req,res,next){
  Order.find({user_id : req.body.user_id}).exec(function(err,result){
    if(err) throw err;
    res.status(200).json(result).send();
  });
});

router.get('/getOrders1', function(req,res,next){
  Order.find({user_id : 1223321}).exec(function(err,result){
    if(err) throw err;
    res.status(200).json(result).end();
  });
});

router.post('/addReview', function(req,res,next){
  Review.insertMany({
    fname : req.body.fname,
    lname : req.body.lname || req.body.fname,
    product_id : req.body.product_id,
    rating : req.body.rating,
  }, function(err, result){
    if(err) throw err;
    res.render('reviewProduct');
  });
});

router.post('/removeReview', function(req,res,next){
  Review.deleteOne({_id : req.body.id},
    function(err, result) {
      if(err) throw err;
      res.status(200).json({msg:"Successfully delete."}).send();
    });
});

router.get('/getReview/:product_id', function(req, res, next) {
  Review.find({product_id : req.params.product_id}).exec(function(err, result){
    if(err) throw err;
    if(result !== null) {
      res.status(200).json(result).end();
    }
  });
});

module.exports = router;