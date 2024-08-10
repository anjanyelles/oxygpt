import React from 'react';
// import './App.css';
import './DummyScreen.css';
import { FaMicrophone, FaUpload, FaPaperPlane, FaTrash } from 'react-icons/fa';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <h1>OXY <span>GPT</span></h1>
        </div>
        <div className="profile-section">
          <span>Profile</span>
          <button className="logout-btn">Logout</button>
        </div>
      </header>
      
      <div className="main-content">
        <div className="chat-history">
          <h2>Chat History</h2>
          <button className="delete-btn"><FaTrash /></button>
        </div>
        
        <div className="chat-interface">
          <div className="chat-suggestions">
            <button>Study abroad agent names list hyderabad?</button>
            <button>Top UK university agents names only in India?</button>
            <button>Hyderabad study abroad Agents name only working for Oxford</button>
            <button>What are the benefits of going solar?</button>
          </div>

          <div className="chat-input">
            <FaMicrophone className="mic-icon" />
            <input type="text" placeholder="Search your abroad agent..." />
            <div className="chat-actions">
              <button><FaUpload /></button>
              <button><FaPaperPlane /></button>
              <button><FaTrash /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
