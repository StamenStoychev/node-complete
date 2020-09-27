const mongoose = require("mongoose");

const Shema = mongoose.Schema;

const userShema = new Shema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: { type: Shema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
      },
    ],
  },
});

module.exports = mongoose.model("User", userShema);
// const mongodb = require("mongodb");

// const getDb = require("../util/database").getDb;
// class User {
//   constructor(name, email, id, cart) {
//     this.name = name;
//     this.email = email;
//     this.id = id;
//     this.cart = cart;
//   }
//   save() {
//     const db = getDb();
//     return db
//       .collection("users")
//       .insertOne(this)
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   addToCart(product) {
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];
//     //checking if we have the product in the cart
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     if (cartProductIndex >= 0) {
//       //we have object in the cart and we just increase the quantity by one
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       //adding the object to the cart cuz its new
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     };

//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this.id) },
//         { $set: { cart: updatedCart } }
//       );
//   }
//   getCart() {
//     const db = getDb();
//     //making array of productIds
//     const productIds = this.cart.items.map((i) => {
//       return new mongodb.ObjectId(i.productId);
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             quantity: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).quantity,
//           };
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userId) })
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => {});
//   }
//   deleteItemFromCart(productId) {
//     const updatedCartItems = [];
//     for (const item of this.cart.items) {
//       if (item.productId.toString() !== productId.toString()) {
//         updatedCartItems.push(item);
//       }
//     }
//     console.log(updatedCartItems);
//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this.id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }
//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         console.log(products);
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this.id),
//             username: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection("users")
//           .updateOne(
//             { _id: new mongodb.ObjectId(this.id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new mongodb.ObjectId(this.id) })
//       .toArray();
//   }
// }

// module.exports = User;
