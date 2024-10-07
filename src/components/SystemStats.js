import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SystemStats.css'; // Make sure to import the CSS

const SystemStats = () => {
  const [stats, setStats] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(5000); // Default to 5 seconds
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customInterval, setCustomInterval] = useState('');
  const [customUnit, setCustomUnit] = useState('seconds');
  const [validationError, setValidationError] = useState('');

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/stats');
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const intervalId = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  const handleRefreshChange = (e) => {
    const value = Number(e.target.value);
    setRefreshInterval(value);
    setCustomInterval('');
    setValidationError(''); // Clear any previous validation errors
  };

  const handleCustomIntervalChange = (e) => {
    setCustomInterval(e.target.value);
  };

  const handleCustomUnitChange = (e) => {
    setCustomUnit(e.target.value);
  };

  const applyCustomInterval = () => {
    const value = Number(customInterval);

    if (isNaN(value) || value <= 0) {
      setValidationError('Please enter a valid positive number.');
      return;
    }

    let milliseconds;
    switch (customUnit) {
      case 'seconds':
        if (value > 3600) {
          setValidationError('Please enter a value less than or equal to 3600 seconds.');
          return;
        }
        milliseconds = value * 1000;
        break;
      case 'minutes':
        if (value > 60) {
          setValidationError('Please enter a value less than or equal to 60 minutes.');
          return;
        }
        milliseconds = value * 60 * 1000;
        break;
      case 'hours':
        if (value > 1) {
          setValidationError('Please enter a value less than or equal to 1 hour.');
          return;
        }
        milliseconds = value * 60 * 60 * 1000;
        break;
      default:
        milliseconds = value * 1000;
    }
    setRefreshInterval(milliseconds);
    setValidationError(''); // Clear any previous validation errors
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return null;

  return (
    <div className="system-stats">
      <div className="header">
        <h1>System Stats Dashboard</h1>
        <div className="refresh-controls">
          <label htmlFor="refresh">Refresh every: </label>
          <select id="refresh" onChange={handleRefreshChange} value={refreshInterval}>
            <option value="5000">5 seconds</option>
            <option value="10000">10 seconds</option>
            <option value="30000">30 seconds</option>
            <option value="60000">1 minute</option>
            <option value="300000">5 minutes</option>
            <option value="3600000">1 hour</option>
          </select>
          <input
            type="number"
            value={customInterval}
            onChange={handleCustomIntervalChange}
            placeholder="Custom interval"
          />
          <select value={customUnit} onChange={handleCustomUnitChange}>
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
          </select>
          <button onClick={applyCustomInterval}>Apply</button>
        </div>
        {validationError && <div className="error">{validationError}</div>}
      </div>
      <div className="stat-card">
        <StatCard title="CPU Usage" value={stats.cpuUsagePercentage} />
        <StatCard
          title="RAM Usage"
          value={stats.ramUsagePercentage}
          subValue={`${stats.ramUsedGB} / ${stats.ramTotalGB}`}
        />
        <StatCard
          title="Swap Usage"
          value={stats.swapUsagePercentage}
          subValue={`${stats.swapUsedGB} / ${stats.swapTotalGB}`}
        />
      </div>
      <div className="core-usage-section">
        <h2>Core CPU Usage</h2>
        <div className="core-usage-container">
          {stats.coreCpuUsagePercentage.map((usage, index) => (
            <CoreUsage key={index} coreNumber={index + 1} usage={usage} />
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subValue }) => (
  <div className="stat-item">
    <h3>{title}</h3>
    <div className="stat-value">{value}</div>
    {subValue && <div className="sub-value">{subValue}</div>}
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: value }} />
    </div>
  </div>
);

const CoreUsage = ({ coreNumber, usage }) => (
  <div className="core-item">
    <div className="core-number">Core {coreNumber}</div>
    <div className="core-usage">{usage}</div>
    <div className="core-progress-bar-container">
      <div className="core-progress-bar" style={{ width: usage }} />
    </div>
  </div>
);

export default SystemStats;
