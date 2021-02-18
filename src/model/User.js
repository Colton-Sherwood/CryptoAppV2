const mongoose = require('mongoose');

// Create a UserSchema using mongoose.Schema
const UserSchema = new mongoose.Schema({
    // Define the properties for the new UserSchema
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Create a model called user based on the mongoose.model User Schema
const User = mongoose.model('User', UserSchema);

// Export our new model so that we can use it in other files.
module.exports = User;