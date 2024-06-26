const express = require('express');
const router = express.Router();
const passport = require("passport");

const mainController = require("../controllers/mainController");


/* GET home page. */
router.get('/', mainController.main_home);

/* POST home page. */
router.post('/', mainController.main_home_post);

// PROFILE ROUTES

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

/* GET log-out. */
router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


// SIGN UP ROUTES

// GET sign up form.
router.get("/sign-up", mainController.main_sign_up_get);

// POST sign up form.
router.post("/sign-up", mainController.main_sign_up_post);

// NEW MESSAGE ROUTES

// GET new message form.
router.get("/new-message", mainController.main_new_message_get);

// POST new message form.
router.post("/new-message", mainController.main_new_message_post);


module.exports = router;
