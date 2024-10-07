import React, { useState } from 'react';
import './App.css';
import SystemStats from './components/SystemStats';

const App = () => {
    const [refreshInterval, setRefreshInterval] = useState(5000); // Default to 5 seconds
    const [inputValue, setInputValue] = useState(5); // To store the numeric input
    const [timeUnit, setTimeUnit] = useState('seconds'); // To store the selected time unit
    const [error, setError] = useState(''); // To store error messages

    const handleIntervalChange = (e) => {
        const value = Number(e.target.value);
        setInputValue(value);

        // Validate based on the time unit
        if (timeUnit === 'seconds' && value > 3600) {
            setError('Please enter a value less than or equal to 3600 seconds.');
        } else if (timeUnit === 'minutes' && value > 60) {
            setError('Please enter a value less than or equal to 60 minutes.');
        } else if (timeUnit === 'hours' && value > 1) {
            setError('Please enter a value less than or equal to 1 hour.');
        } else {
            setError('');
            updateRefreshInterval(value, timeUnit);
        }
    };

    const handleTimeUnitChange = (e) => {
        const newTimeUnit = e.target.value;
        setTimeUnit(newTimeUnit);
        updateRefreshInterval(inputValue, newTimeUnit);
    };

    const updateRefreshInterval = (value, unit) => {
        let milliseconds;
        if (unit === 'seconds') {
            milliseconds = value * 1000; // Convert seconds to milliseconds
        } else if (unit === 'minutes') {
            milliseconds = value * 60000; // Convert minutes to milliseconds
        } else if (unit === 'hours') {
            milliseconds = value * 3600000; // Convert hours to milliseconds
        }
        setRefreshInterval(milliseconds);
    };

    return (
        <div className="app">
            {/* <h1>System Stats Dashboard</h1>
            <div className="refresh-controls">
                <label htmlFor="interval">Refresh Interval: </label>
                <input
                    id="interval"
                    type="number"
                    value={inputValue}
                    onChange={handleIntervalChange}
                    min="1"
                />
                <select value={timeUnit} onChange={handleTimeUnitChange}>
                    <option value="seconds">Seconds</option>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                </select>
            </div>
            {error && <p className="error">{error}</p>}
            <SystemStats refreshInterval={refreshInterval} /> */}
            <SystemStats/>
        </div>
    );
};

export default App;