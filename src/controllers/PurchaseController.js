// require Crypto model
const Crypto = require('../model/Crypto')

// require purchase model
const Purchase = require('../model/PurchaseModel')

// constant to store our api key
const CRYPTO_API_KEY = "6cbe67e231cc62448e4edd3d0b47a159"

//import axios to handle api calls
const axios = require("axios")

//this will get the purchase page.
exports.renderPurchasePage = (req, res) => {
    //in response renders the about view
    res.render("purchase", { layout: 'default', template: 'home-template' })
}

//use this to get all of the existing cryptocurrency purchases so the user can choose which ones they want to sell.
exports.accountHistory = (req, res) => {
    const user = req.user.email;
    //objects will store the response from the query and totalCoins will store the coin count from the mongo db in each object.
    var objects = {};
    var totalCoins = {};
    //query the purchases based on the current user logged in.
    Purchase.find({ usernameID: user }).then(history => {
        //console.log(history)
        // Reverse history so most recent comes first
        history = history.reverse();
        res.render('account', {
            name: req.user.name,
            history
        });
    })
};

//this will handle the post request.
exports.renderPurchase = (req, res) => {
    const purchaseID = req.body.purchaseID
    const purchase = new Crypto(purchaseID)

    //set up API call to get info we want based on value entered
    const url = `https://api.nomics.com/v1/currencies/ticker?key=${CRYPTO_API_KEY}&ids=${purchaseID}&interval=1d,30d`

    purchase.validateUserInput()

    // use axios to get info from api and do what we want with it in the then
    axios.get(url).then((response) => {
        // can use destructuring to get neater names for required info
        // make a variable with the name of the data point that you want
        // in this case we want the response.data[0].name value
        // so our object's key is name and the value - the new preferred name - 
        // is what we want to call it in our code ex cryptoName
        const { name: cryptoName } = response.data[0]
        const { logo_url: logo } = response.data[0]
        const { price: price } = response.data[0]
        res.render("purchase", {
            layout: 'default',
            template: 'home-template',
            //pass object with additional info to render on index view
            // using our new preferred names
            name: `${cryptoName}`,
            purchaseID: purchase.data,
            logo: `${logo}`,
            price: parseFloat(`${price}`).toFixed(3)
        })
    }).catch((error) => {
        console.log(error)
    })
}

//renders the account page with transaction history
exports.renderAccount = (req, res) => {
    const user = req.user.email
    Purchase.find({ usernameID: user }).then(history => {
        history = history.reverse();
        res.render('account', {
            name: req.user.name,
            history
        });
    })
}

exports.getPurchase = (req, res) => {
    //use destructuring to pull required info from purchase page
    const crypto = req.body.name;
    const id = req.body.purchaseID;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const name = req.user.name;
    const email = req.user.email;
    let errors = [];

    if (quantity <= 0 || '') {
        errors.push({ msg: "Please enter a quantity greater than 0" })
    }

    if (errors.length > 0) {
        res.render("purchase", {
            errors,
            name: crypto,
            purchaseID: id,
            price,
            quantity,
            email
        });
    } else {
        //make new purchase schema based on purchase info
        var newPurchase = Purchase({
            crypto_currency: id,
            usernameID: email,
            coin_count: quantity,
            us_dollar: price
        });

        newPurchase.save()
            .then(purchase => {
                req.flash('success_msg', 'Transaction successful!');
                res.redirect('account');
            })
    }
};

exports.sellCrypto = (req, res) => {
    // Get ID and sellQuantity from account page
    const crypto_currency = req.body.crypto_currency;
    const sellQuantity = req.body.sellQuantity
    const unique_id = req.body.unique_id
    const purchase_price = req.body.us_dollar
    const purchase_date = req.body.purchase_date

    //set up API call to get info we want based on value entered
    const url = `https://api.nomics.com/v1/currencies/ticker?key=${CRYPTO_API_KEY}&ids=${crypto_currency}&interval=1d,30d`

    // get current price of crypto by querying the API
    axios.get(url).then((response) => {
        // get currentPrice of crypto from the API
        const currentPrice = response.data[0].price
        const result = (sellQuantity * purchase_price) - (sellQuantity * currentPrice)
        // TEST: Commented out condition for testing
        if (result /*> 0*/) {
            // if the sale makes money we will update the "gain" property of that purchase
            // lean removes extra mongoose stuff - makes it cleaner for us - also can't get the _id without it
            Purchase.find({ _id: `${unique_id}` }).then(purchase => {
                //console.log("inside find by id")
                //console.log(purchase);
                purchase{ : }
                purchase[0].gain = result;
                purchase[0].coin_count -= sellQuantity
                //console.log(purchase[0].gain);
                console.log(purchase[0]);
                Purchase.save();
                res.redirect("account")
            })
        }

        }).catch((error) => {
            console.log(error)
        })
}
