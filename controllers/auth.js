const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const SendGridTransport = require("nodemailer-sendgrid-transport");
const mongodb = require("mongodb");

// const transporter = nodemailer.createTransport(
//   SendGridTransport({
//     auth: {
//       api_key:
//         "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",
//     },
//   })
// );

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "86a847dc7fd40c",
    pass: "a704588e4e2cf1",
  },
});

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

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message[0]) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    pageTitle: "Reset",
    path: "",
    error: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found!");
          return res.redirect("/reset");
        }
        //adding the reset token to the user object
        user.resetToken = token;
        user.resetTokenDate = Date.now() + 36000000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "sstoychev98@gmail.com",
          subject: "Password Reset",
          html: `
            <p>You requested a new password</p>
            <p>Click this <a href="//localhost:3000/reset/${token}">link</a> to set new password</p>
          `,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getUpdatedPassword = (req, res, next) => {
  const token = req.params.token;

  User.findOne({ resetToken: token })
    .then((user) => {
      let message = req.flash("error");
      if (message[0]) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-pass", {
        pageTitle: "Update Password",
        path: "",
        userId: user._id,
        error: message,
        token: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postUpdatedPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const token = req.body.token;
  let user;

  User.findById(userId)
    .then((user) => {
      if (user.resetToken === token) {
        user = user;
        bcrypt.hash(newPassword, 12).then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.resetTokenDate = undefined;
          return user.save();
        });
      }
    })

    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};
