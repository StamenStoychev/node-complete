const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoute = require("./routes/shop");
const pageNotFoundController = require("./controllers/404");
// const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
// za da vzemame elementi ot body
app.use(bodyParser.urlencoded({ extended: false }));
//navigira kum public za da rabotim sus css
app.use(express.static(path.join(__dirname, "public")));

// adding the user info to the request
// app.use((req, res, next) => {
  // User.findById("5f6751c1f449d322f9453a1e")
  //   .then((user) => {
  //     req.user = new User(user.name, user.email, user._id, user.cart);
  //     next();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
// }) ;

app.use("/admin", adminRoutes.routes);

app.use(shopRoute);

app.use(pageNotFoundController.get404);

// adding Mongoose connection to DB
mongoose
  .connect(
    "mongodb+srv://stamen:1234@cluster0.tesog.mongodb.net/node-complete?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
