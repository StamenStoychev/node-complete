const express = require("express");
const isAuth = require('../middleware/is-auth')
const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.cartProducts);

router.post("/cart/:productId", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.deleteFromCart);

router.get("/checkout", isAuth, shopController.checkOut);

router.get("/", shopController.getIndex);

router.post("/create-order", isAuth, shopController.postOrder);

router.get("/orders", isAuth, shopController.getOrders);

module.exports = router;
