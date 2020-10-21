const { compareSync } = require("bcryptjs");
const Product = require("../models/product");
const { validationResult } = require("express-validator/check");

exports.adminProducts = (req, res, next) => {
  const errors = validationResult(req);
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  Product.find({ userId: req.user._id })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasErrors: false,
    error: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const body = req.body;
  const errors = validationResult(req);

  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasErrors: true,
      error: errors.array()[0].msg,
      product: {
        title: body.title,
        price: body.price,
        description: body.description,
        imageUrl: body.imageUrl,
      },
    });
  }
  const product = new Product({
    title: body.title,
    price: body.price,
    description: body.description,
    imageUrl: body.imageUrl,
    userId: req.session.user._id,
  });
  product
    // save is a method provided by mongoose
    .save()
    .then((result) => {
      console.log("Created product");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  const errors = validationResult(req);
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  //sequelizer user method
  Product.findById(prodId)
    .then((product) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasErrors: false,
        error: false,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postEditProduct = (req, res, next) => {
  const body = req.body;
  const prodId = req.body.productId;
  const newTitle = req.body.title;
  const newImageUrl = req.body.imageUrl;
  const newDesc = req.body.description;
  const newPrice = req.body.price;
  const errors = validationResult(req);
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasErrors: true,
      error: errors.errors[0].msg,
      product: {
        title: body.title,
        price: body.price,
        description: body.description,
        imageUrl: body.imageUrl,
      },
    });
  }
  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = newTitle;
      product.price = newPrice;
      product.newDesc = newDesc;
      product.imageUrl = newImageUrl;
      return product.save().then(() => {
        res.redirect("/admin/products");
      });
    })

    .catch((err) => {
      console.log(err);
    });
};

exports.deleteAdminItem = (req, res, next) => {
  const prodId = req.params.productId;
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
