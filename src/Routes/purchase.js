const express = require("express")

// express has a built in router method to control routes that we are going to use in this file
const router = express.Router()

//imports the controller.js file in the controller folder
const controller = require("../controllers/PurchaseController")

router.get("/purchase", controller.renderPurchasePage)

router.post("/purchase",controller.renderPurchase)

// exporting the router
module.exports = router;