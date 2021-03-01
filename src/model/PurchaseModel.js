const mongoose = require('mongoose');

//FP START
const PurchaseSchema = new mongoose.Schema({ 
    // Define the properties for the new purchase schema //fp
    crypto_currency: {
        type: String,
        required: true
    },
    usernameID: {
        type: String,
        required: true
    },
    coin_count: {
        type: Number,
        required: true
    },
    us_dollar: {
        type: Number,
        required: true
    },
    purchase_date: {
        type: Date,
        default: Date.now
    }
});
//FP END

// Create a model called purchase based on the mongoose.model purchase schema fp
const Purchase = mongoose.model('Purchase', PurchaseSchema); //fp

module.exports = Purchase;