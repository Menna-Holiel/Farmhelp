// models/Flood.js
const mongoose = require('mongoose');

const floodSchema = new mongoose.Schema({
    month: { type: String, required: true },
    number_of_floods: { type: String, required: true },
    risk_level: { type: Number, required: true }
});

const floodsSchema = new mongoose.Schema({
    state: { type: String, required: true },
    floods: { type: [floodSchema], required: true }
});

const Floods = mongoose.model('floods', floodsSchema);
module.exports = Floods;