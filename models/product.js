const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product', {
  id:{
    type: Sequelize.INTEGER,
    autoIncrement:true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING
  },
  price : {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  description: {
   type: Sequelize.STRING,
  } ,
  imageUrl:{
    type: Sequelize.STRING
  } 
});
module.exports = Product;


// const db = require('../util/database');
// const Cart = require('../models/cart');

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.title = title.trim();
//     this.imageUrl = imageUrl;
//     this.description = description.trim();
//     this.price = price;
//     this.id = id;
//   }
//   save() {
//    return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
//     [this.title, this.price, this.description, this.imageUrl]);
//   }
//   static deleteById(id){}
//   static fetchAll() {
//    return db.execute('SELECT * FROM products');
//   }
//   static findById(id){  
//     return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
//    }
// }