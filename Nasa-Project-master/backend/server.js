const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./db.js');
const Floods = require('./models/floods');
const Crop = require('./models/crops.js')
const Drought = require('./models/drought');
const cors = require("cors");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const app = express();
const port = 7000;


app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
)
const API_KEY = "ucPst8WRzHIqnKBUJi6jsIgthfcXthKF8TfOJJYtS0Wv";
connectDB();

function getToken(errorCallback, loadCallback) {
    const req = new XMLHttpRequest();
    req.addEventListener("load", loadCallback);
    req.addEventListener("error", errorCallback);
    req.open("POST", "https://iam.cloud.ibm.com/identity/token");
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.setRequestHeader("Accept", "application/json");
    req.send("grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + API_KEY);
}


function apiPost(scoring_url, token, payload, loadCallback, errorCallback) {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", loadCallback);
    oReq.addEventListener("error", errorCallback);
    oReq.open("POST", scoring_url);
    oReq.setRequestHeader("Accept", "application/json");
    oReq.setRequestHeader("Authorization", "Bearer " + token);
    oReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    oReq.send(payload);
}

app.get('/cropsByFloodRisk/:riskLevel', async (req, res) => {
    const { riskLevel } = req.params;


    let level = riskLevel;



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
    const { state, category, year, month } = req.body;

    // Validate input
    if (!state || !category || !year || !month) {
        return res.status(400).json({ error: "All parameters (state, category, year, month) are required." });
    }

    // Get IBM Watson API token
    getToken((err) => {
        console.log(err);
        res.status(500).send("Error obtaining IBM Watson token.");
    }, function () {
        let tokenResponse;
        try {
            tokenResponse = JSON.parse(this.responseText);
        } catch (ex) {
            console.error("Error parsing token response:", ex);
            res.status(500).send("Error parsing token response.");
            return;
        }

        // Prepare payload for IBM Watson API
        const payload = JSON.stringify({
            input_data: [{
                fields: ["category", "state", "year", "month"],
                values: [[category, state, year, month]]
            }]
        });

        const scoring_url = "https://eu-de.ml.cloud.ibm.com/ml/v4/deployments/39de7ee6-7c23-4825-8e15-5ec67f3d465f/predictions?version=2021-05-01";

        // Call IBM Watson API to get prediction
        apiPost(scoring_url, tokenResponse.access_token, payload, function () {
            let parsedPostResponse;
            try {
                parsedPostResponse = JSON.parse(this.responseText);
            } catch (ex) {
                console.error("Error parsing prediction response:", ex);
                res.status(500).send("Error parsing prediction response.");
                return;
            }

            // Handle and return the prediction result
            if (parsedPostResponse && parsedPostResponse.predictions) {
                const predictions = parsedPostResponse.predictions[0].values[0];
                res.status(200).json({ prediction: predictions });
            } else {
                res.status(500).send("Unexpected response format from IBM Watson.");
            }
        }, function (error) {
            console.error("Error in IBM Watson API post call:", error);
            res.status(500).send("Error in IBM Watson API post call.");
        });
    });
});

app.post('/predictDrought', async (req, res) => {
    const { stateAbbreviation, year, month } = req.body;

    // Validate input
    if (!stateAbbreviation || !year || !month) {
        return res.status(400).json({ error: "All parameters (stateAbbreviation, year, month) are required." });
    }

    // Get IBM Watson API token
    getToken((err) => {
        console.log(err);
        res.status(500).send("Error obtaining IBM Watson token.");
    }, function () {
        let tokenResponse;
        try {
            tokenResponse = JSON.parse(this.responseText);
        } catch (ex) {
            console.error("Error parsing token response:", ex);
            res.status(500).send("Error parsing token response.");
            return;
        }

        // Prepare payload for IBM Watson API
        const payload = JSON.stringify({
            input_data: [{
                fields: ["stateAbbreviation", "year", "month"],
                values: [[stateAbbreviation, year, month]]
            }]
        });

        const scoring_url = "https://eu-de.ml.cloud.ibm.com/ml/v4/deployments/7843c079-43bf-4c81-8151-c53d92390d91/predictions?version=2021-05-01";

        // Call IBM Watson API to get prediction
        apiPost(scoring_url, tokenResponse.access_token, payload, function () {
            let parsedPostResponse;
            try {
                parsedPostResponse = JSON.parse(this.responseText);
            } catch (ex) {
                console.error("Error parsing prediction response:", ex);
                res.status(500).send("Error parsing prediction response.");
                return;
            }

            // Handle and return the prediction result
            if (parsedPostResponse && parsedPostResponse.predictions) {
                const predictions = parsedPostResponse.predictions[0].values[0];
                res.status(200).json({ prediction: predictions });
            } else {
                res.status(500).send("Unexpected response format from IBM Watson.");
            }
        }, function (error) {
            console.error("Error in IBM Watson API post call:", error);
            res.status(500).send("Error in IBM Watson API post call.");
        });
    });
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