const mongoose = require('mongoose');

const structure = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required']
    },
    email: {
        type: String,
        required: [true, 'email is required']
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    date: {
        type: Date,
        default: Date.now
    }

})

const userModel = mongoose.model("Users", structure)
module.exports = userModel;