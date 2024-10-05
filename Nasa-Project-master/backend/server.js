const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./db.js');
const Floods = require('./models/floods');
const Crop = require('./models/crops.js')
const Drought = require('./models/drought');
const cors = require("cors");
const app = express();
const port = 7000;


app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
)

connectDB();
app.get('/cropsByFloodRisk/:riskLevel', async (req, res) => {
    const { riskLevel } = req.params;
    let level;
    const numericRiskLevel = parseInt(riskLevel);


    if (numericRiskLevel === 1) {
        level = 'Very Low';
    } else if (numericRiskLevel === 2) {
        level = 'Low';
    } else if (numericRiskLevel >= 3 && numericRiskLevel <= 4) {
        level = 'Moderate';
    } else if (numericRiskLevel >= 5 && numericRiskLevel <= 6) {
        level = 'High';
    } else {
        level = 'Very High';
    }

    try {
        const cropsWithRisk = await Crop.find({
            'regions.weather.floodRisk': level
        });

        res.status(200).json(cropsWithRisk);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});


app.post('/predictFlood', async (req, res) => {
    const { state, date } = req.body;

    if (!state || !date) {
        return res.status(400).json({ error: 'State and date are required' });
    }

    try {

        const monthIndex = new Date(date).getMonth();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[monthIndex];
        const floodData = await Floods.findOne({ state: state });
        if (!floodData) {
            return res.status(404).json({ error: 'No data available for this state' });
        }

        const floodInfo = floodData.floods.find(flood => flood.month === month);
        if (!floodInfo) {
            return res.status(404).json({ error: 'No data available for this month' });
        }


        res.status(200).json({ risk_level: floodInfo.risk_level });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

app.post('/predictDrought', async (req, res) => {
    const { state, date } = req.body;
    const month = new Date(date).getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    try {
        const drought = await Drought.findOne({ name: state });

        if (drought) {

            const isDroughtMonth = drought.drought_season.months.includes(monthNames[month]);
            if (isDroughtMonth) {
                res.json({ msg: ` ${drought.drought_season.description}  if you need accurate data check it with sensors to predict short term`, level: 'High' })
            } else {
                res.json({ msg: 'The area is considered safe from drought, and residents can feel secure.', level: 'Low' })
            }

        } else {
            res.json({ isDroughtMonth: false, message: `Drought data not found for ${state}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching drought data' });
    }
});


app.get('/cropsByConditions', async (req, res) => {
    const { temperature, humidity, soilMoisture } = req.query;

    
    if (!temperature || !humidity || !soilMoisture) {
        return res.status(400).json({ error: 'All parameters (temperature, sunlight, humidity, soilMoisture) are required.' });
    }

    try {

        const temp = parseInt(temperature);
        // const sun = parseInt(sunlight);
        const hum = parseInt(humidity);
        const soil = parseInt(soilMoisture);


        const crops = await Crop.find({
            'regions.weather.temperature.high': { $gte: temp },
            'regions.weather.temperature.low': { $lte: temp },
            // 'regions.weather.sunlight.high': { $gte: sun },
            // 'regions.weather.sunlight.low': { $lte: sun },
            'regions.weather.humidity.high': { $gte: hum },
            'regions.weather.humidity.low': { $lte: hum },
            'regions.weather.soilMoisture.high': { $gte: soil },
            'regions.weather.soilMoisture.low': { $lte: soil }

        });

        if (!crops.length) {
            return res.status(404).json({ error: 'No crops found matching the specified conditions.' });
        }

        res.status(200).json(crops);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});