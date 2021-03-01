const express = require("express")

// requre out authenticator config
const { ensureAuthenticated } = require('../config/auth');

// express has a built in router method to control routes that we are going to use in this file
const router = express.Router()

//imports the controller.js file in the controller folder
const controller = require("../controllers/PurchaseController")

router.get("/purchase", controller.renderPurchasePage)

router.post("/purchase", ensureAuthenticated, controller.renderPurchase)

router.get("/account", ensureAuthenticated, controller.renderAccount)

router.post("/account", ensureAuthenticated, controller.getPurchase)

router.post("/accountHistory", ensureAuthenticated, controller.accountHistory)

router.post("/sellCrypto", ensureAuthenticated, controller.sellCrypto)

// exporting the router
module.exports = router;