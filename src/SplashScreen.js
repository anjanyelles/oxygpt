// src/SplashScreen.js

import React from 'react';
import './SplashScreen.css'; // Import the CSS file for styling
import GPT1 from './images/GPT1.gif'; // Adjust the path if necessary

function SplashScreen() {
  return (
    <div className="SplashScreen">
      <img src={GPT1} alt="OXYGPT" className="logo" />
    </div>
  );
}

export default SplashScreen;
