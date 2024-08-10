import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaTrash, FaUpload, FaMicrophone, FaStop ,FaVolumeMute,FaVolumeUp} from 'react-icons/fa';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './ChatComponent.css';
import GIF2 from './images/GPT2.gif';
import ReactMarkdown from  'react-markdown'
import userAvatar from './images/Z3.png';
import botAvatar from './images/Z1.png';
import CustomModal from './CustomModal';

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [showDummyQuestions, setShowDummyQuestions] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});
  const [isRecording, setIsRecording] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const { transcript, resetTranscript } = useSpeechRecognition();
  const navigate = useNavigate();
  const dummyQuestions = [
    "Study abroad agent names list hyderabad?",
    "Top uk university agents names only in india?",
    "Hyderabad study abroad Agents name only working for oxford",
    "What are the benefits of going solar?"
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://182.18.139.138:9001/api/student-service/user/getHistoryAgentsData?userId=00795e40-02e4-4bbd-871f-c35c779a106d');
        setHistory(response.data.slice(-10)); 
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    const handleBackButton = () => {
      setModalMessage('Are you sure you want to leave this page?');
      setConfirmAction(() => () => navigate('/login'));
      setShowModal(true);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate]);

  const handleSend = async () => {
    if (audioFile) {
      const formData = new FormData();
      formData.append('file', audioFile);
      try {
        const response = await axios.post('http://182.18.139.138:9001/api/student-service/user/audioToTextConversion', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        const botMessage = { text: response.data, sender: 'bot' };
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, botMessage];
          setTimeout(() => {
            const messagesContainer = document.querySelector('.messages');
            if (messagesContainer) {
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
          }, 100);
          return updatedMessages;
        });
        // Clear the input field and audio file
        setInput('');
        setAudioFile(null);
      } catch (error) {
        console.error('Error converting audio to text:', error);
        const errorMessage = { text: 'Error: Unable to convert audio to text.', sender: 'bot' };
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, errorMessage];
          setTimeout(() => {
            const messagesContainer = document.querySelector('.messages');
            if (messagesContainer) {
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
          }, 100);
          return updatedMessages;
        });
        // Clear the input field and audio file
        setInput('');
        setAudioFile(null);
      }
    } else if (input.trim() !== '') {
      setShowDummyQuestions(false);
      const newMessage = { text: input, sender: 'user' };
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, newMessage];
        setTimeout(() => {
          const messagesContainer = document.querySelector('.messages');
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }, 100);
        return updatedMessages;
      });
      setHistory(prevHistory => {
        const updatedHistory = [...prevHistory, newMessage];
        return updatedHistory.slice(-10); // Only keep the last 10 messages
      });
      const userInput = input;
      setInput('');
      try {
        const response = await axios({
          method: 'POST',
          url: `http://182.18.139.138:9001/api/student-service/user/enterChat?prompt=${userInput}&userId=00795e40-02e4-4bbd-871f-c35c779a106d`
        });
        const botMessage = { text: response.data, sender: 'bot' };
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, botMessage];
          setTimeout(() => {
            const messagesContainer = document.querySelector('.messages');
            if (messagesContainer) {
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
          }, 100);
          return updatedMessages;
        });
        // Only add user messages to history
        // setHistory(prevHistory => {
        //   const updatedHistory = [...prevHistory, botMessage];
        //   return updatedHistory.slice(-10);
        // });
      } catch (error) {
        console.error('Error fetching response:', error);
        const errorMessage = { text: 'Error: Unable to fetch response.', sender: 'bot' };
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, errorMessage];
          setTimeout(() => {
            const messagesContainer = document.querySelector('.messages');
            if (messagesContainer) {
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
          }, 100);
          return updatedMessages;
        });
        // Only add user messages to history
        // setHistory(prevHistory => {
        //   const updatedHistory = [...prevHistory, errorMessage];
        //   return updatedHistory.slice(-10);
        // });
      }
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
    if (event.target.value.trim() !== '') {
      setShowDummyQuestions(false);
    }
  };

  const handleAudioChange = (event) => {
    setAudioFile(event.target.files[0]);
    setShowDummyQuestions(false);
    // Display the audio file as a message
    const newMessage = {
      text: URL.createObjectURL(event.target.files[0]),
      sender: 'user',
      type: 'audio'
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const handleClearInput = () => {
    setInput('');
    setMessages([]);
    setShowDummyQuestions(true);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleDummyQuestionClick = (question) => {
    setInput(question);
    setShowDummyQuestions(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Message copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleLogout = () => {
    setModalMessage('Are you sure you want to logout?');
    setConfirmAction(() => () => navigate('/login'));
    setShowModal(true);
  };

  const handleConfirm = () => {
    confirmAction();
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <div>Your browser does not support speech recognition.</div>;
  }

  const handleMicClick = () => {
    setShowDummyQuestions(false);
    if (isRecording) {
      SpeechRecognition.stopListening();
      sendTextToAPI(transcript);
      resetTranscript();
      setInput('');
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
    setIsRecording(!isRecording);
    setInput(transcript); // Set the transcript to the input field while recording
  };

  const sendTextToAPI = async (text) => {
    const userId = '00795e40-02e4-4bbd-871f-c35c779a106d';
    const apiUrl = `http://182.18.139.138:9001/api/student-service/user/enterChat?prompt=${encodeURIComponent(text)}&userId=${userId}`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const botMessage = { text: data, sender: 'bot' };
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, botMessage];
          setTimeout(() => {
            const messagesContainer = document.querySelector('.messages');
            if (messagesContainer) {
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
          }, 100);
          return updatedMessages;
        });
        // Only add user messages to history
        // setHistory(prevHistory => {
        //   const updatedHistory = [...prevHistory, botMessage];
        //   return updatedHistory.slice(-10);
        // });
        setApiResponse(data); // Store the API response in state
      } else {
        console.error('API request failed:', response.statusText);
        const errorMessage = { text: 'Error: Unable to fetch response.', sender: 'bot' };
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, errorMessage];
          setTimeout(() => {
            const messagesContainer = document.querySelector('.messages');
            if (messagesContainer) {
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
          }, 100);
          return updatedMessages;
        });
        // Only add user messages to history
        // setHistory(prevHistory => {
        //   const updatedHistory = [...prevHistory, errorMessage];
        //   return updatedHistory.slice(-10);
        // });
      }
    } catch (error) {
      console.error('API request error:', error);
      const errorMessage = { text: 'Error: Unable to fetch response.', sender: 'bot' };
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, errorMessage];
        setTimeout(() => {
          const messagesContainer = document.querySelector('.messages');
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }, 100);
        return updatedMessages;
      });
      // Only add user messages to history
      // setHistory(prevHistory => {
      //   const updatedHistory = [...prevHistory, errorMessage];
      //   return updatedHistory.slice(-10);
      // });
    }
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech not supported.");
    }
  };

  const handlePlayPause = (text) => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      speakText(text);
    }
  };

  return (
    <div className="ChatComponent">
      <header className="chat-header">
        <img src={GIF2} alt="OXYGPT" className="GIF1" />
        <div style={{display:'flex',alignItems:'center',}}>
          <div className="profile">Profile</div>
          <button className="logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <div className="chat-container">
        <aside className="history-panel">
          <h3>Chat History</h3>
          <ul>
            {history.map((message, index) => (
              <li key={index} className={`${message.sender}-message`}>
                {message.text}
              </li>
            ))}
          </ul>
          <button onClick={handleClearHistory} className="clear-history-button"><FaTrash/></button>
        </aside>
        <div className="chat-area">
          <div className="messages">
            {showDummyQuestions && (
              <div className="dummy-questions">
                {dummyQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="dummy-question"
                    onClick={() => handleDummyQuestionClick(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
            {messages.map((message, index) => (
              <div key={index} className={`message-container ${message.sender}`}>
                {message.sender === 'user' && (
                  <img src={userAvatar} alt="User Avatar" className="avatar user-avatar" />
                )}
                {message.sender === 'bot' && (
                  <img src={botAvatar} alt="Bot Avatar" className="avatar bot-avatar" />
                )}
                <div className={`message ${message.sender}`}>
                  <div className="message-text">
                    
                    {message.type === 'audio' ? (
                      <audio controls src={message.text} />
                    ) : (
                        <>
                          <ReactMarkdown>{message.text}</ReactMarkdown>

                          {message.sender === 'user' && (
                            <i class="fa-solid fa-pen-to-square"></i>
                          )}
                        </>
                    )}
                  </div>
                  {message.sender === 'bot' && (
                  <div className='flex'>
                      <button
                      className="copy-button"
                      onClick={() => copyToClipboard(message.text)}
                    >
                      Copy
                    </button>
                    <button className='volume-button' onClick={() => handlePlayPause(message.text)}>
                        {isPlaying ? <FaStop /> : <FaVolumeUp />}
                      </button>
                  </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="input-container">
            <button id='mic_recording' 
            onClick={handleMicClick}
            >
              {isRecording ? <FaStop /> : <FaMicrophone />}
            </button>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Search your abroad agent..."
            />
            <label htmlFor="audio-upload" className="audio-upload-label">
              <FaUpload className="upload-icon" />
              <input
                type="file"
                id="audio-upload"
                accept="audio/*,.mp3,.wav,.ogg,.acc"
                onChange={handleAudioChange}
                style={{ display: 'none' }}
              />
            </label>
            <button className='B1' onClick={handleSend}><FaPaperPlane /></button>
            <button className='B1' onClick={handleClearInput}><FaTrash/></button>
          </div>
          <p>{isRecording ? 'Recording...' : ''}</p>
          {/* <p><strong>Transcript:</strong> {transcript}</p> */}
          {apiResponse && (
            <div>
              <h3>API Response:</h3>
             
                <ReactMarkdown>{JSON.stringify(apiResponse, null, 2)}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
      <CustomModal
        show={showModal}
        message={modalMessage}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default ChatComponent;







