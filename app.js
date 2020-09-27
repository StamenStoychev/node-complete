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
app.use((req, res, next) => {
  User.findById("5f7063a8a09fdf0554a54917")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes.routes);

app.use(shopRoute);

app.use(pageNotFoundController.get404);

// adding Mongoose connection to DB
mongoose
  .connect(
    "mongodb+srv://stamen:1234@cluster0.tesog.mongodb.net/node-complete?retryWrites=true&w=majority"
  )
  .then(() => {
    User.findOne()
      .then((user) => {
        if (!user) {
          const user = new User({
            name: "Stamen",
            email: "Stamen@test.com",
            cart: {
              items: [],
            },
          });
          user.save();
        }
      })
      .catch((err) => {
        console.log(err);
      });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
