const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title is required']
    },
    description: {
        type: String,
        required: [true, 'description is required']
    },
    image: {
        type: String,
        required: [true, 'image is required']
    },
    date: {
        type: Date,
        default: Date.now
    }

})

const blogModel = mongoose.model("Blog", BlogSchema)
module.exports = blogModel;