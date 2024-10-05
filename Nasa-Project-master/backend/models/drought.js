const mongoose = require('mongoose');

const droughtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    drought_season: {
        months: {
            type: [String],
            required: true
        },
        description: {
            type: String,
            required: true
        }
    }
});

const Drought = mongoose.model('droughts', droughtSchema);

module.exports = Drought;