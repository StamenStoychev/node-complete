const Product = require("../models/product");
exports.adminProducts = (req, res, next) => {
  Product.find()
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
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const body = req.body;
  console.log(req.user);
  const product = new Product({
    title: body.title,
    price: body.price,
    description: body.description,
    imageUrl: body.imageUrl,
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
  Product.findById(prodId)
    .then((product) => {
      product.title = newTitle;
      product.price = newPrice;
      product.newDesc = newDesc;
      product.imageUrl = newImageUrl;
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteAdminItem = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
