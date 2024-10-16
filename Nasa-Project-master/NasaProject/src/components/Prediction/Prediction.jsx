import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import stylePredict from './Prediction.module.css';
import riskLevelsData from './riskLevels.json';

export default function Prediction() {
    const [state, setState] = useState('');
    const [riskLevel, setRiskLevel] = useState(null);
    const [crops, setCrops] = useState([]);
    const [error, setError] = useState('');
    const [date, setDate] = useState('');
    const [drought_msg, setDrought_msg] = useState(null); // Initialize with default structure

    // Function to get the current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check if state and date are provided
        if (!state || !date) {
            setError('Please select a state and a date.');
            return;
        }

        // Convert date to year and month
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;


        try {
            // Call flood prediction API
            const floodResponse = await fetch('http://localhost:7000/predictFlood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ state, category: "Flood", year, month }),
            });

            if (!floodResponse.ok) {
                const data = await floodResponse.json();
                throw new Error(data.error || 'Something went wrong with flood prediction.');
            }

            const floodData = await floodResponse.json();
            console.log(floodData);
            setRiskLevel(floodData.prediction[0]);  // Use the flood prediction result

            // Fetch crops based on flood risk
            await fetchCropsByRisk(floodData.prediction);

            // Call drought prediction API with the new payload structure
            const payload = JSON.stringify({
                stateAbbreviation: state,
                year,
                month
                // input_data: [{
                //     fields: ["stateAbbreviation", "year", "month"],
                //     values: [[state, year, month]]
                // }]
            });

            const droughtResponse = await fetch('http://localhost:7000/predictDrought', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: payload,
            });

            if (!droughtResponse.ok) {
                const data = await droughtResponse.json();
                console.log(data.error)
                throw new Error(data.error || 'Error in drought prediction.');
            }

            const droughtData = await droughtResponse.json();
            console.log(droughtData)
            setDrought_msg(droughtData); // Set drought message based on the API response
        } catch (err) {

            setError(err.message);
        }
    };

    const fetchCropsByRisk = async (riskLevel) => {
        try {
            const response = await fetch(`http://localhost:7000/cropsByFloodRisk/${riskLevel}`);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error while fetching crops.');
            }

            const cropsData = await response.json();
            setCrops(cropsData);
        } catch (err) {
            setError(err.message);
        }
    };






    let riskPercentage;
    let progressBarColor;

    if (riskLevel !== null) {
        if (riskLevel === 'Low') {
            riskPercentage = 30;
            progressBarColor = '#90ee90'; // Light green
        } else if (riskLevel === 'Medium') {
            riskPercentage = 60;
            progressBarColor = '#ffc107'; // Yellow
        } else if (riskLevel === 'High') {
            riskPercentage = 90;
            progressBarColor = '#dc3545';
        } else {
            riskPercentage = 0;
            progressBarColor = '#6c757d';
        }
    }

    let droughtPercentage;
    let droughtColor;
    if (drought_msg !== null) {
        switch (drought_msg.prediction[0]) {
            case 'None':
                droughtPercentage = 0;
                droughtColor = '#28a745'; // Green
                break;
            case 'Abnormally Dry':
                droughtPercentage = 10;
                droughtColor = '#28a745'; // Light green
                break;
            case 'Moderate Drought':
                droughtPercentage = 40;
                droughtColor = '#ffc107'; // Yellow
                break;
            case 'Severe Drought':
                droughtPercentage = 60;
                droughtColor = '#fd7e14'; // Orange
                break;
            case 'Extreme Drought':
                droughtPercentage = 70;
                droughtColor = '#dc3545'; // Red
                break;
            case 'Exceptional Drought':
                droughtPercentage = 90;
                droughtColor = '#b00020'; // Dark red
                break;
            default:
                droughtPercentage = 0; // Default to None if unknown
                droughtColor = '#28a745'; // Green
        }
    }

    useEffect(() => {
        setDate(getCurrentDate());
    }, []);

    return (
        <>
            <div className={stylePredict.predictPage}>
                <div className={stylePredict.form}>
                    <form onSubmit={handleSubmit}>
                        <div className={stylePredict.getData}>
                            <div>
                                <label className={stylePredict.label} htmlFor="states">Choose your State</label>
                                <select name="states" value={state} onChange={(e) => setState(e.target.value)}>
                                    <option value="">Select a state</option>
                                    <option value="Alabama">Alabama</option>
                                    <option value="Alaska">Alaska</option>
                                    <option value="Arizona">Arizona</option>
                                    <option value="Arkansas">Arkansas</option>
                                    <option value="California">California</option>
                                    <option value="Colorado">Colorado</option>
                                    <option value="Connecticut">Connecticut</option>
                                    <option value="Delaware">Delaware</option>
                                    <option value="Florida">Florida</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="Hawaii">Hawaii</option>
                                    <option value="Idaho">Idaho</option>
                                    <option value="Illinois">Illinois</option>
                                    <option value="Indiana">Indiana</option>
                                    <option value="Iowa">Iowa</option>
                                    <option value="Kansas">Kansas</option>
                                    <option value="Kentucky">Kentucky</option>
                                    <option value="Louisiana">Louisiana</option>
                                    <option value="Maine">Maine</option>
                                    <option value="Maryland">Maryland</option>
                                    <option value="Massachusetts">Massachusetts</option>
                                    <option value="Michigan">Michigan</option>
                                    <option value="Minnesota">Minnesota</option>
                                    <option value="Mississippi">Mississippi</option>
                                    <option value="Missouri">Missouri</option>
                                    <option value="Montana">Montana</option>
                                    <option value="Nebraska">Nebraska</option>
                                    <option value="Nevada">Nevada</option>
                                    <option value="New Hampshire">New Hampshire</option>
                                    <option value="New Jersey">New Jersey</option>
                                    <option value="New Mexico">New Mexico</option>
                                    <option value="New York">New York</option>
                                    <option value="North Carolina">North Carolina</option>
                                    <option value="North Dakota">North Dakota</option>
                                    <option value="Ohio">Ohio</option>
                                    <option value="Oklahoma">Oklahoma</option>
                                    <option value="Oregon">Oregon</option>
                                    <option value="Pennsylvania">Pennsylvania</option>
                                    <option value="Rhode Island">Rhode Island</option>
                                    <option value="South Carolina">South Carolina</option>
                                    <option value="South Dakota">South Dakota</option>
                                    <option value="Tennessee">Tennessee</option>
                                    <option value="Texas">Texas</option>
                                    <option value="Utah">Utah</option>
                                    <option value="Vermont">Vermont</option>
                                    <option value="Virginia">Virginia</option>
                                    <option value="Washington">Washington</option>
                                    <option value="West Virginia">West Virginia</option>
                                    <option value="Wisconsin">Wisconsin</option>
                                    <option value="Wyoming">Wyoming</option>
                                </select>
                            </div>
                            <br />
                            <div>
                                <label className={stylePredict.label} htmlFor="date">Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={getCurrentDate()}
                                />
                            </div>
                        </div>
                        <br />
                        <button type="submit">Predict</button>
                    </form>
                    {error && <p className={stylePredict.error}>{error}</p>}
                </div>

                <div className={stylePredict.predictImage}>
                    <img className={stylePredict.predictGlobe} src="/globe.png" alt="Globe" />
                    <img className={stylePredict.predictGlobe1} src="/cloud.png" alt="Globe" />
                    <img className={stylePredict.predictGlobe2} src="/cloud.png" alt="Globe" />
                </div>
            </div>

            <div className={stylePredict.data}>
                <div className={stylePredict.allData}>
                    <h1>Prediction</h1>
                    <table>
                        <tr>
                            <th className={stylePredict.riskData}>Risk</th>
                            <th>Level</th>
                        </tr>
                        <tr>
                            <td className={stylePredict.riskData}>Flood Risk</td>
                            <td>
                                <h4>{riskLevel}</h4>

                                {riskLevel !== null && (
                                    <div className="progress my-3" style={{ backgroundColor: 'white' }}>
                                        <div
                                            className="progress-bar progress"
                                            role="progressbar"
                                            style={{ width: `${riskPercentage}%`, backgroundColor: progressBarColor, height: '20px' }}
                                            aria-valuenow={riskPercentage}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {riskPercentage.toFixed(2)}%
                                        </div>
                                    </div>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <td className={stylePredict.riskData}>Drought Risk</td>
                            {drought_msg !== null && (
                                <td>
                                    <h4>{drought_msg.prediction[0]}</h4>

                                    {drought_msg.prediction[0] && (
                                        <div className="progress my-3" style={{ backgroundColor: 'white' }}>
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${droughtPercentage}%`, backgroundColor: droughtColor, height: '20px' }}
                                                aria-valuenow={droughtPercentage}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                {droughtPercentage.toFixed(2)}%
                                            </div>
                                        </div>
                                    )}
                                </td>
                            )}
                        </tr>
                    </table>
                </div>

                <div className={stylePredict.allPlant}>
                    <h1>Recommended Crops</h1>
                    <table>
                        <tr>
                            <th>Plants</th>
                        </tr>
                        {crops.length > 0 ? (
                            crops.map((crop, index) => (
                                <tr key={index}>
                                    <td>{crop.cropName}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td>No crops found for this risk level.</td>
                            </tr>
                        )}

                    </table>
                </div>
            </div>
        </>
    );
}