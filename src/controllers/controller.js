//import axios to handle api calls
const axios = require ("axios")

// constant to store our api key
const CRYPTO_API_KEY = "6cbe67e231cc62448e4edd3d0b47a159"

// require Crypto model
const Crypto = require('../model/Crypto')

//require purchase model
const Purchase = require('../model/PurchaseModel');


// declare objects globally so I can access everywhere.
var allIDs = {}

// get a list of all crypto Id's for search bar
axios.get(`https://api.nomics.com/v1/currencies/ticker?key=${CRYPTO_API_KEY}&interval=1d,30d`)
  .then((response) => {
    allIDs = response.data
  });
//create named exports to handle views

exports.renderHomePage = (req, res) => {
    // get 9 popular cryptocurrencies to display
    const cryptoIds = "BTC,ETH,DOGE,LTC,XRP,ADA,DOT,NEO,CEL"

    //setup API Call
    const url = `https://api.nomics.com/v1/currencies/ticker?key=${CRYPTO_API_KEY}&ids=${cryptoIds}&interval=1d,30d`

    axios.get(url).then((response) => {
        // want to display the 9 cryptos as cards on the page. & make the search bar a drop down that filters based on what you type
        objects = response.data

        //in response renders the index view
        res.render("index", {
            layout: 'default', 
            template: 'home-template',
            cryptos: objects,
            ids: allIDs
        })
    })
}

// new function for index post
// express stores all data sent in the req object
// ex req.body.crypto will get the information from the corresponding
// element in html with name="crypto"
exports.getCrypto = (req, res) => {
    //get crypto name from index by its name value
    // set id to upper case because all values are stored as upper case
    const cryptoId = req.body.crypto.toUpperCase()

    //set up API call to get info we want based on value entered
    const url = `https://api.nomics.com/v1/currencies/ticker?key=${CRYPTO_API_KEY}&ids=${cryptoId}&interval=1d,30d`

    // Use crypto model to ensure input isn't blank
    const crypto = new Crypto(req.body.crypto)

    crypto.validateUserInput()

    if(crypto.errors.length){
        res.render("index", {
            layout: 'default',
            template: 'home-template',
            error: crypto.errors.toString()
        })
    } else {
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
            res.render("Index", {
                layout: 'default',
                template: 'home-template',
                //pass object with additional info to render on index view
                // using our new preferred names
                logo:`${logo}`,
                cryptoInfo: `${cryptoName}'s current price is \$${price} `,
                cryptoName: `${cryptoName}`,
                cryptoPrice: `${price}`,
                cryptos: objects,
                ids: allIDs
            })
        }).catch((error) => {
            console.log(error)
        })

    }
    
}

exports.renderAboutPage = (req, res) => {
    //in response renders the about view
    res.render("about", {layout: 'default', template: 'home-template'})
}

exports.renderAccount =  (req, res) =>
res.render('account', {
    layout: 'default',
name: req.user.name,
});

exports.getPurchase = (req, res) =>  {
    //use destructuring to pull required info from purchase page
    const crypto = req.body.name;
    const id = req.body.purchaseID;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const name = req.user.name;
    const email = req.user.email;
    let errors = [];

    if(quantity <= 0 || ''){
        errors.push({msg: "Please enter a quantity greater than 0"})
    }

    if(errors.length > 0) {
        res.render("purchase", {
            errors,
            crypto,
            id,
            price,
            quantity,
            name,
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