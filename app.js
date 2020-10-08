const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");
const pageNotFoundController = require("./controllers/404");
// const mongoConnect = require("./util/database").mongoConnect;
const session = require("express-session");
const mongoose = require("mongoose");
const csrf = require("csurf");
const flash = require('connect-flash');

//initializing the session with the mongodb
const MongoDbStore = require("connect-mongodb-session")(session);
const User = require("./models/user");
const MONGODB_URI =
  "mongodb+srv://stamen:1234@cluster0.tesog.mongodb.net/node-complete?";
const app = express();
const store = new MongoDbStore({ uri: MONGODB_URI, collection: "sessions" });

app.set("view engine", "ejs");
app.set("views", "views");

//defining csrf
const csrfProtection = csrf();

// za da vzemame elementi ot body
app.use(bodyParser.urlencoded({ extended: false }));
//navigira kum public za da rabotim sus css
app.use(express.static(path.join(__dirname, "public")));
// initialize the session
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//enable csrf
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

//adding csrfToken and isLoggendIn to a locals - easy to maintain in all views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes.routes);

app.use(shopRoute);

app.use(authRoute);

app.use(pageNotFoundController.get404);
// adding the user info to the request

// adding Mongoose connection to DB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
