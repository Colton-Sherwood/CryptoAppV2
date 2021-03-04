const express = require("express")

// express has a built in router method to control routes that we are going to use in this file
const router = express.Router()

// requre out authenticator config
const { ensureAuthenticated } = require('../config/auth');

//imports the controller.js file in the controller folder
const controller = require("../controllers/controller")

// route handler for home page "/"
// access the render home page method of the controller when trying to render the index page
router.get("/", controller.renderHomePage)

//create post request for base url
// call back function is controller.getWeather from the controller.
router.post("/", controller.getCrypto)

router.get("/about", controller.renderAboutPage)

// exporting the router
module.exports = router;