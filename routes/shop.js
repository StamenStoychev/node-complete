const express = require("express");
const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

// router.get("/cart", shopController.cartProducts);

// router.post("/cart/:productId", shopController.addToCart);

// router.post("/cart-delete-item", shopController.deleteFromCart);

// router.get("/checkout", shopController.checkOut);

router.get("/", shopController.getIndex);

// router.get("/orders", shopController.getOrders);

// router.post("/create-order", shopController.postOrder);

module.exports = router;
