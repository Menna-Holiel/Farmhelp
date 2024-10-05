// models/Crop.js
const mongoose = require('mongoose');

const pestAlertSchema = new mongoose.Schema({
    pestName: { type: String, required: true },
    riskLevel: { type: String, required: true },
    suggestedActions: { type: String, required: true }
});

const adviceSchema = new mongoose.Schema({
    plantingTime: { type: String, required: true },
    harvestTime: { type: String, required: true },
    suggestedActions: { type: [String], required: true }
});

const weatherSchema = new mongoose.Schema({
    temperature: {
        low: { type: Number, required: true },
        high: { type: Number, required: true }
    },
    humidity: {
        low: { type: Number, required: true },
        high: { type: Number, required: true }
    },
    sunlight: {
        low: { type: Number, required: true },
        high: { type: Number, required: true }
    },
    soilMoisture: {
        low: { type: Number, required: true },
        high: { type: Number, required: true },
    },
    droughtRisk: { type: String, required: true },
    floodRisk: { type: String, required: true }
});

const productionSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    metricTons: { type: Number, required: true },
    forecast: { type: String, required: true }
});

const regionSchema = new mongoose.Schema({
    country: { type: String, required: true },
    production: { type: productionSchema, required: true },
    weather: { type: weatherSchema, required: true },
    advice: { type: adviceSchema, required: true },
    waterUsage: {
        irrigationNeeded: { type: String, required: true },
        waterEfficiencyTips: { type: String, required: true }
    },
    pestAlerts: { type: [pestAlertSchema], required: true },
    marketPrices: {
        currentPricePerTon: { type: Number, required: true },
        priceTrends: { type: String, required: true }
    }
});

const soilQualitySchema = new mongoose.Schema({
    pH: { type: Number, required: true },
    nutrients: {
        nitrogen: { type: String, required: true },
        phosphorus: { type: String, required: true }
    }
});

const cropSchema = new mongoose.Schema({
    cropName: { type: String, required: true },
    regions: { type: [regionSchema], required: true },
    soilQuality: { type: soilQualitySchema, required: true }
});

const Crop = mongoose.model('crops', cropSchema);
module.exports = Crop;
