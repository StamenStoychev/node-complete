const express = require("express");
const productController = require('../controllers/shop');
const adminController = require('../controllers/admin');
const router = express.Router();


const products = [];

router.get("/add-product", adminController.getAddProduct);

router.post("/add-product", adminController.postAddProduct);

router.get('/products', adminController.adminProducts);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product/:productId', adminController.deleteAdminItem);

exports.routes = router;
