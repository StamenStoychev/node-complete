const mongodb = require("mongodb");

const getDb = require("../util/database").getDb;
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongodb.ObjectId(userId) })
      .then((user) => {
          return user;
      })
      .catch((err) => {});
  }
}

module.exports = User;
