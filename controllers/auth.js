const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const SendGridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  SendGridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.lenght > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    error: message,
  });
};

exports.postLogin = (req, res, next) => {
  // User.findById("5f7063a8a09fdf0554a54917")
  //   .then((user) => {
  //     req.session.user = user;
  //     req.session.isLoggedIn = true;
  //     res.redirect("/");
  //   })
  //   .catch((err) => console.log(err));
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        //adding a bit of user feedback
        req.flash("error", "Invalid username or password");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          console.log(doMatch);
          if (doMatch) {
            req.session.user = user;
            req.session.isLoggedIn = true;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
      req.session.user = user;
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message[0]) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    error: message,
  });
};

exports.postSignup = (req, res, next) => {
  //for now we wont enter valid names-later we will configure this
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash("error", "E-mail exist already, please pick another one!");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((haschedPassword) => {
          const user = new User({
            email: email,
            password: haschedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "sstoychev98@gmail.com",
            subject: "Signup success",
            html: "<h1> You signup into the dummy app </h1>",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
