const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const shopRoute = require("./routes/shop");
const pageNotFoundController = require("./controllers/404");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
//navigira kum public za da rabotim sus css
app.use(express.static(path.join(__dirname, "public")));
// adding the user info to the request
app.use((req, res, next) => {
  User.findByPk(1)
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

//Association from Prods to User
// when we delete the user, all the products related to him will be deleted
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  //force - to overwrite the tables
  // .sync({ force: true })
  .sync()
  .then((res) => {
    //logging the current user
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Stamen", email: "test@test.com" });
    }
    return user;
  })
  .then((user) => {
    // after we create a user, now create a cart
    user.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
