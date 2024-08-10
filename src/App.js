import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatComponent from './ChatComponent';
import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
// import DummyChatScreen from './DummyChatScreen';

import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust duration as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="App">
        {loading ? (
          <SplashScreen />
        ) : (
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/chat" element={<ChatComponent />} />
            {/* <Route path="/chat" element={<DummyChatScreen/>} /> */}
            <Route path="/" element={<LoginScreen />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
