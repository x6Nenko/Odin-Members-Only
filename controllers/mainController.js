const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');

const User = require("../models/User");
const Post = require("../models/Post");

// Display home page
exports.main_home = asyncHandler(async (req, res, next) => {
  res.render("index", {
    title: "Members Only",
  });
});

// Display profile page
exports.main_profile = asyncHandler(async (req, res, next) => {
  res.render("profile", {
    title: "Members Only",
  });
});

// Display sign up form on GET
exports.main_sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign-up-form", {
    title: "Sign Up",
    user: undefined,
    errors: undefined,
  });
});

// Handle sign up form on POST
exports.main_sign_up_post = [
  // Validate and sanitize fields.
  body("firstName", "First name must not be empty.")
    .trim()
    .isLength({ min: 3, max: 40 })
    .escape(),
  body("lastName", "Last name must not be empty.")
    .trim()
    .isLength({ min: 3, max: 40 })
    .escape(),
  body("username", "Username must not be empty.")
    .trim()
    .isLength({ min: 3, max: 40 })
    .custom(async value => {
      const usernameExists = await User.findOne({ username: value }).exec();
      if (usernameExists) {
        throw new Error('Username already in use');
      }
    })
    .escape(),
  body("password", "Password must be more than 3 symbols.")
    .trim()
    .isLength({ min: 3, max: 1000 }),
  body('passwordConfirmation', "Passwords do not match.")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    }),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create user
    const user = new User({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
      membership_status: false,
      admin: false,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("sign-up-form", {
        title: "Sign Up",
        user: user,
        errors: errors.array(),
      })
    } else {
      // Data from form is valid. Hash pass and save user.
      try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
    
        await user.save();
        // console.log("success");
        // console.log(user);
        res.redirect("/");
      } catch (err) {
        // Handle any errors
        return next(err);
      }
    }
  }),
];