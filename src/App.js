import React, { useState } from 'react';
import './App.css';
import SystemStats from './components/SystemStats';

const App = () => {
    return (
        <div className="app">
            <SystemStats/>
        </div>
    );
};

export default App;