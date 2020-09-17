const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://stamen:1234@cluster0.tesog.mongodb.net/node-complete?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No DB found!";
};

module.exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
