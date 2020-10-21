const express = require("express");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const router = express.Router();
const { check, body } = require("express-validator/check");

router.get("/add-product", isAuth, adminController.getAddProduct);

router.post(
  "/add-product",
  [
    body("title").trim().isLength({ min: 3 }),
    // body("imageUrl").isURL().trim(),
    body("price").isFloat(),
    body("description").trim().isLength({ min: 5 }),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/products", isAuth, adminController.adminProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body("title").trim().isLength({ min: 3 }),
    // body("imageUrl").isURL().trim(),
    body("price").isFloat(),
    body("description").trim().isLength({ min: 5 }),
  ],
  isAuth,
  adminController.postEditProduct
);

router.post(
  "/delete-product/:productId",
  isAuth,
  adminController.deleteAdminItem
);

exports.routes = router;
