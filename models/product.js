const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, descr, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = descr;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static getDetails(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodId) })
      .then((result) => {
        console.log("Deleted!");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
module.exports = Product;

// const Sequelize = require('sequelize');

// const sequelize = require('../util/database');

// const Product = sequelize.define('product', {
//   id:{
//     type: Sequelize.INTEGER,
//     autoIncrement:true,
//     allowNull: false,
//     primaryKey: true
//   },
//   title: {
//     type: Sequelize.STRING
//   },
//   price : {
//     type: Sequelize.DOUBLE,
//     allowNull: false
//   },
//   description: {
//    type: Sequelize.STRING,
//   } ,
//   imageUrl:{
//     type: Sequelize.STRING
//   }
// });
// module.exports = Product;

// // const db = require('../util/database');
// // const Cart = require('../models/cart');

// // module.exports = class Product {
// //   constructor(id, title, imageUrl, description, price) {
// //     this.title = title.trim();
// //     this.imageUrl = imageUrl;
// //     this.description = description.trim();
// //     this.price = price;
// //     this.id = id;
// //   }
// //   save() {
// //    return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
// //     [this.title, this.price, this.description, this.imageUrl]);
// //   }
// //   static deleteById(id){}
// //   static fetchAll() {
// //    return db.execute('SELECT * FROM products');
// //   }
// //   static findById(id){
// //     return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
// //    }
// // }
