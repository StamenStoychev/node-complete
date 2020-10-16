const express = require("express");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const router = express.Router();
const { check } = require("express-validator/check");

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post(
  "/add-product",
  [check("title").trim().isEmpty().withMessage("Please enter a title!")],
  isAuth,
  adminController.postAddProduct
);

router.get("/products", isAuth, adminController.adminProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.post(
  "/delete-product/:productId",
  isAuth,
  adminController.deleteAdminItem
);

exports.routes = router;
