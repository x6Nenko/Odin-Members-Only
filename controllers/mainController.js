const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const passport = require("passport");


const User = require("../models/User");
const Post = require("../models/Post");

// Display home page
exports.main_home = asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find().populate("author").sort({ createdAt: -1 }).exec();
  res.render("index", {
    title: "Members Only",
    user: req.user,
    posts: allPosts,
  });
});

exports.main_home_post = asyncHandler(async (req, res, next) => {
  await Post.findByIdAndDelete(req.body.messageId);
  res.redirect("/");
});

// Display profile page
exports.main_profile = asyncHandler(async (req, res, next) => {
  res.render("profile", {
    title: "Members Only - Profile",
    user: req.user,
    errors: undefined,
  });
});

// Handle profile form POST
exports.main_profile_post = asyncHandler(async (req, res, next) => {
  if (req.body.formType === "updateMembership") {
    if (req.body.secretcode === `${req.user.first_name}${req.user.last_name}5000`) {
      await User.findByIdAndUpdate(req.user._id, { membership_status: true });
      res.redirect("/profile");
    } else {
      res.render("profile", {
        title: "Members Only - Profile",
        user: req.user,
        errors: ["Wrong secret code."],
      });
    }
  };

  if (req.body.formType === "updateAdmin") {
    if (req.body.secretadmincode === `${req.user.first_name}${req.user.last_name}7000`) {
      await User.findByIdAndUpdate(req.user._id, { membership_status: true, admin: true });
      res.redirect("/profile");
    } else {
      res.render("profile", {
        title: "Members Only - Profile",
        user: req.user,
        errors: ["Wrong secret code."],
      });
    }
  };
});

// Display sign up form on GET
exports.main_sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign-up-form", {
    title: "Sign Up",
    user: req.user,
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
        res.redirect("/sign-in");
      } catch (err) {
        // Handle any errors
        return next(err);
      }
    }
  }),
];

// Display sign in form on GET
exports.main_sign_in_get = asyncHandler(async (req, res, next) => {
  let errors;
  req.session.messages ? errors = req.session.messages : undefined;

  res.render("sign-in-form", {
    title: "Sign In",
    user: req.user,
    errors: errors,
  });
});

// New message form on GET
exports.main_new_message_get = asyncHandler(async (req, res, next) => {
  res.render("new-message-form", {
    title: "Send new message",
    user: req.user,
    new_message: undefined,
    errors: undefined,
  });
});

// New message form on POST
exports.main_new_message_post = [
  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 3, max: 40 })
    .escape(),
  body("text", "Text must not be empty.")
    .trim()
    .isLength({ min: 3, max: 1000 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create post
    const newMessage = new Post({
      title: req.body.title,
      text: req.body.text, 
      author: req.user._id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("new-message-form", {
        title: "Send new message",
        new_message: newMessage,
        user: req.user,
        errors: errors.array(),
      })
    } else {
      await newMessage.save();
      res.redirect("/");
    }
  }),
];