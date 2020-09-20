const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoute = require("./routes/shop");
const pageNotFoundController = require("./controllers/404");
const mongoConnect = require("./util/database").mongoConnect;
const User = require('./models/user');

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
// za da vzemame elementi ot body
app.use(bodyParser.urlencoded({ extended: false }));
//navigira kum public za da rabotim sus css
app.use(express.static(path.join(__dirname, "public")));

// adding the user info to the request
app.use((req, res, next) => {
  User.findById('5f6751c1f449d322f9453a1e')
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

mongoConnect(() => {
  // new User('Stamen', 'stamen@gmail.com')
  app.listen(3000);
});
