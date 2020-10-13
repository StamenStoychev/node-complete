const { compareSync } = require("bcryptjs");
const Product = require("../models/product");
exports.adminProducts = (req, res, next) => {
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
  });
};

exports.postAddProduct = (req, res, next) => {
  const body = req.body;
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
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
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const newTitle = req.body.title;
  const newImageUrl = req.body.imageUrl;
  const newDesc = req.body.description;
  const newPrice = req.body.price;
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
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
