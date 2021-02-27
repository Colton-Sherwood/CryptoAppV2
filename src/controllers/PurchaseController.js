// require Crypto model
const Crypto = require('../model/Crypto')

// constant to store our api key
const CRYPTO_API_KEY = "6cbe67e231cc62448e4edd3d0b47a159"

//import axios to handle api calls
const axios = require ("axios")

//this will get the purchase page.
exports.renderPurchasePage= (req, res) => {
    //in response renders the about view
    res.render("purchase", {layout: 'default', template: 'home-template'})
}


//this will handle the post request.
exports.renderPurchase=(req, res)=>{
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
                   name:`${cryptoName}`,
                   purchaseID : purchase.data,
                   logo:`${logo}`,
                   price: parseFloat(`${price}`).toFixed(3)
               })
           }).catch((error) => {
               console.log(error)
           })
}

