import React, { useState, useEffect } from 'react';
import styleHome from './Home.module.css';
import { io } from 'socket.io-client'; 

export default function Home() {
    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0); 
    const [soilMoisture, setSoilMoisture] = useState(0); 
    const [crops, setCrops] = useState([]);
    const [error, setError] = useState('');

    
    useEffect(() => {
        const socket = io('http://localhost:7001'); 

        socket.on('sensorData', (data) => {
            setTemperature(data.temperature);
            setHumidity(data.humidity);
            setSoilMoisture(data.soilMoisture);
        });

        return () => {
            socket.disconnect(); 
        };
    }, []);

    const fetchCropsByConditions = async () => {
        try {
            console.log(`Fetching crops with temperature: ${temperature}, humidity: ${humidity}, soilMoisture: ${soilMoisture}`);
            const response = await fetch(`http://localhost:7000/cropsByConditions?temperature=${temperature}&humidity=${humidity}&soilMoisture=${soilMoisture}`);
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Something went wrong while fetching crops');
            }

            const cropsData = await response.json();
            setCrops(cropsData);
            setError(''); 
        } catch (err) {
            setError(err.message);
            setCrops([]); 
        }
    };

    useEffect(() => {
        fetchCropsByConditions(); 
    }, [temperature, humidity, soilMoisture]);  

    return (
        <>
            <div className={styleHome.home}>
                <div className={styleHome.leftSide}>
                    <h1>Hello farmers</h1>
                    <h3>
                        Welcome to our website! We help farmers to find the best crops to plant by checking soil conditions with sensors. We also provide alerts for possible floods and desertification, so you can protect your harvest. We will help to make smarter farming choices!
                    </h3>
                </div>

                <div className={styleHome.rightSide}>
                    <img className={styleHome.globe} src="/globe.png" alt="Globe" />
                </div>
            </div>

            <div className={styleHome.data}>
                <div className={styleHome.allData}>
                    <h1>Sensors data</h1>
                    <table>
                        <tr>
                            <th>Data</th>
                            <th>Value</th>
                        </tr>
                        <tr>
                            <td>Temperature</td>
                            <td>{temperature} °C</td>
                        </tr>
                        <tr>
                            <td>Humidity</td>
                            <td>{humidity} %</td>
                        </tr>
                        <tr>
                            <td>Soil Moisture</td>
                            <td>{soilMoisture} %</td>
                        </tr>
                    </table>
                </div>

                <div className={styleHome.allPlant}>
                    <h1>Recommended plants</h1>
                    <table>
                        <tr>
                            <th>Plants</th>
                        </tr>
                        {error ? (
                            <tr>
                                <td>{error}</td>
                            </tr>
                        ) : (
                            crops.length > 0 ? (
                                crops.map((crop, index) => (
                                    <tr key={index}>
                                        <td>{crop.cropName}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td>No crops found for the specified conditions.</td>
                                </tr>
                            )
                        )}
                    </table>
                </div>
            </div>
        </>
    );
}