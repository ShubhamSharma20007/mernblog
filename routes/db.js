const mongoose = require('mongoose');

const db = mongoose.connect("mongodb://127.0.0.1:27017/mernblog")
    .then(() => console.log("database connected !"))
    .catch(() => console.log("internal issues"))

module.exports = db