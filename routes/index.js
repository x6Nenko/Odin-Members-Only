const express = require('express');
const router = express.Router();
const passport = require("passport");

const mainController = require("../controllers/mainController");


/* GET home page. */
router.get('/', mainController.main_home);

/* GET profile page. */
router.get('/profile', mainController.main_profile);

/* POST profile page. */
router.post('/profile', mainController.main_profile_post);

// SIGN IN ROUTES

/* GET sign in page. */
router.get('/sign-in', mainController.main_sign_in_get);

/* POST sign in page. */
router.post('/sign-in', 
  passport.authenticate('local', { failureRedirect: '/sign-in', failureMessage: true }),
  function(req, res) {
    res.redirect('/profile');
  });

// SIGN UP ROUTES

// GET sign up form.
router.get("/sign-up", mainController.main_sign_up_get);

// POST sign up form.
router.post("/sign-up", mainController.main_sign_up_post);


module.exports = router;
