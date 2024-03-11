let mongoose = require('mongoose');

let urlSchema = new mongoose.Schema({
    original_url: String,
    short_url: Number,
})

module.exports = mongoose.model('Url', urlSchema);