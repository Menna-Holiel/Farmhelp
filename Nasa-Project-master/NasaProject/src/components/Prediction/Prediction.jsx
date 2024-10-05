import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import stylePredict from './Prediction.module.css';
import riskLevelsData from './riskLevels.json';

export default function Prediction() {
    const [state, setState] = useState('');
    //const [date, setDate] = useState('');
    const [riskLevel, setRiskLevel] = useState(null);
    const [crops, setCrops] = useState([]);
    const [error, setError] = useState('');
    const [date, setDate] = useState('');
    const [drought_msg, setDrought_msg] = useState('');
    // Function to get the current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        drought_check();
        if (!state || !date) {
            setError('Please select a state and a date.');
            return;
        }

        try {
            const response = await fetch('http://localhost:7000/predictFlood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ state, date }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Something went wrong');
            }

            const data = await response.json();
            setRiskLevel(data.risk_level);

            await fetchCropsByRisk(data.risk_level);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchCropsByRisk = async (riskLevel) => {
        try {
            const response = await fetch(`http://localhost:7000/cropsByFloodRisk/${riskLevel}`);

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Something went wrong while fetching crops');
            }

            const cropsData = await response.json();
            setCrops(cropsData);
        } catch (err) {
            setError(err.message);
        }
    };

    const drought_check = async () => {
        try {
            const response = await fetch('http://localhost:7000/predictDrought', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ state, date }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Something went wrong');
            }

            const data = await response.json();

            setDrought_msg(data);

        } catch (err) {
            setError(err.message);
        }
    }

    const getRiskLevelInfo = (level) => {
        if (level !== null && riskLevelsData.riskLevels[level]) {
            return riskLevelsData.riskLevels[level];
        }
        return { title: 'N/A', description: '' };
    };

    const getRiskColor = (level) => {
        switch (level) {
            case 1: return '#28a745'; // Green
            case 2: return '#28a745'; // Light Green
            case 3: return '#ffc107'; // Light Yellow
            case 4: return '#ffc107'; // Yellow
            case 5: return '#ffc107'; // Yellow
            case 6: return '#fd7e14'; // Orange
            case 7: return '#fd7e14'; // Orange
            case 8: return '#dc3545'; // Red
            case 9: return '#dc3545'; // Red
            case 10: return '#343a40'; // Dark Red
            default: return '#ffffff'; // White
        }
    };

    const riskInfo = getRiskLevelInfo(riskLevel);
    const riskPercentage = riskLevel ? (riskLevel / 10) * 100 : 0;
    const progressBarColor = getRiskColor(riskLevel);
    const droughtPercentage = drought_msg.level == 'High' ? 70 : 10;
    const droughtColor = drought_msg.level == 'High' ? '#fd7e14' : '#28a745';

    useEffect(() => {
        // Set the initial date to the minimum date (today)
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
                                    min={getCurrentDate()} // Restrict the date to today and future dates
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
                                <h4>{riskInfo.title}</h4>
                                <p>{riskInfo.description}</p>
                                {riskLevel !== null && (
                                    <div className="progress my-3">
                                        <div
                                            className="progress-bar"
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
                            <td>
                                <h4>{drought_msg.level}</h4>
                                <p>{drought_msg.msg}</p>

                                {riskLevel !== null && (
                                    <div className="progress my-3">
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