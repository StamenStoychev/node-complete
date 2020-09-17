const fs = require("fs");
const path = require("path");
const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);
const Product = require("../models/product");
// exports.adminProducts = (req, res, next) => {
//   //sequelizer user method
//   req.user
//     .getProducts()
//     .then((products) => {
//       res.render("admin/products", {
//         prods: products,
//         pageTitle: "Admin Products",
//         path: "/admin/products",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   // standart way
//   Product.findAll()
//     .then((products) => {
//       res.render("admin/products", {
//         prods: products,
//         pageTitle: "Admin Products",
//         path: "/admin/products",
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const body = req.body;
  //sequelizer user method
  req.user
    .createProduct({
      title: body.title,
      price: body.price,
      description: body.description,
      imageUrl: body.imageUrl,
      userId: req.user.id,
    })
    .then((result) => {
      console.log(result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect("/");
//   }
//   const prodId = req.params.productId;
//   //sequelizer user method
//   req.user
//     .getProducts({ where: { id: prodId } })
//     .then((products) => {
//       const product = products[0];
//       res.render("admin/edit-product", {
//         pageTitle: "Edit Product",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product: product,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   // standart way of searching item
//   // Product.findByPk(prodId)
//   //   .then((product) => {
//   //     res.render("admin/edit-product", {
//   //       pageTitle: "Edit Product",
//   //       path: "/admin/edit-product",
//   //       editing: editMode,
//   //       product: product,
//   //     });
//   //   })
//   //   .catch((err) => {
//   //     console.log(err);
//   //   });
// };
// exports.postEditProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   const newTitle = req.body.title;
//   const newImageUrl = req.body.imageUrl;
//   const newDesc = req.body.description;
//   const newPrice = req.body.price;
//   Product.findByPk(prodId)
//     .then((product) => {
//       product.title = newTitle;
//       product.price = newPrice;
//       product.description = newDesc;
//       product.imageUrl = newImageUrl;
//       return product.save();
//     })
//     .then(() => {
//       res.redirect("/admin/products");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// exports.deleteAdminItem = (req, res, next) => {
//   const prodId = req.params.productId;
//   Product.findByPk(prodId)
//     .then((product) => {
//       return product.destroy();
//     })
//     .then(() => {
//       res.redirect("/admin/products");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
