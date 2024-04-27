const express = require('express');
const router = express.Router();

const mainController = require("../controllers/mainController");


/* GET home page. */
router.get('/', mainController.main_home);

/* GET profile page. */
router.get('/profile', mainController.main_profile);

/* GET sign in page. */
router.get('/sign-in', mainController.main_sign_in_get);

// SIGN UP ROUTES

// GET sign up form.
router.get("/sign-up", mainController.main_sign_up_get);

// POST sign up form.
router.post("/sign-up", mainController.main_sign_up_post);


module.exports = router;
