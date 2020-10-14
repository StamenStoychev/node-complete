const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();
const { check, body } = require("express-validator/check");
const User = require("../models/user");

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    check("email", "Please enter a valid email!")
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            throw new Error("Invalid Username!");
          }
          return true;
        });
      }),
    check("password", "Incorrect password!").isLength({ min: 5 }),
  ],
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email!")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              "E-mail exist already, please pick another one!"
            );
          }
        });
      }),
    body("password")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .withMessage("The password should be atleast 5 character long!"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getUpdatedPassword);
router.post("/new-pass", authController.postUpdatedPassword);

module.exports = router;
