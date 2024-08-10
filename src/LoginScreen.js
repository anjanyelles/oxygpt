import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginScreen.css';

const LoginScreen = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        emailOrPhone: '',
        otp: '',
    });
    const [error, setError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [message, setMessage] = useState('');
    const [otpSession, setOtpSession] = useState(null);
    const [otpInteracted, setOtpInteracted] = useState(false);
    const [userId, setUserId] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'emailOrPhone') {
            const phoneNumberPattern = /^[0-9]*$/;
            if (!phoneNumberPattern.test(value)) {
                setError('Please enter a valid phone number');
            } else if (value.length > 10) {
                setError('');
                setCredentials({
                    ...credentials,
                    [name]: value.substring(0, 10)
                });
            } else {
                setError('');
                setCredentials({
                    ...credentials,
                    [name]: value
                });
            }
        } else if (name === 'otp') {
            setOtpInteracted(true); 
            const otpPattern = /^[0-9]*$/;
            if (!otpPattern.test(value)) {
                setOtpError('Please enter a valid OTP');
            } else if (value.length > 6) {
                setOtpError('');
                setCredentials({
                    ...credentials,
                    [name]: value.substring(0, 6)
                });
            } else {
                setOtpError('');
                setCredentials({
                    ...credentials,
                    [name]: value
                });
            }
        } else {
            setCredentials({
                ...credentials,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (credentials.emailOrPhone.length !== 10) {
            setError('Please enter a valid phone number');
            return;
        }

        try {
            const response = await fetch('http://182.18.139.138:9000/api/auth-service/auth/registerwithMobile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobileNumber: credentials.emailOrPhone,
              
                 }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.mobileOtpSession === null) {
                localStorage.setItem('userId',data.userId)
                setMessage('Login Successful!');
                setOtpSession(null);
              //  localStorage.setItem('userId',8125861874)
                navigate('/chat');
           
            } else {
                setOtpSession(data.mobileOtpSession);
                setMessage('OTP sent. Please verify.');
            }
            console.log('Submitted credentials:', credentials);
            console.log('Response:', data);
        } catch (error) {
            setError('Failed to register. Please try again.');
            console.error('Error:', error);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://182.18.139.138:9000/api/auth-service/auth/registerwithMobile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mobileNumber: credentials.emailOrPhone,
                    mobileOtpSession: otpSession,
                    mobileOtpValue: credentials.otp,

                }),
            });

            const data = await response.json();
            console.log('OTP Verification:', data);
        
            if (data.mobileVerified) {
                setMessage('OTP Verified Successfully!');
                setOtpError('');
                setOtpSession(null); 
                navigate('/chat');
              console.log(data)
            } else {
                setOtpError('Invalid OTP');
            }

        } catch (error) {
            setOtpError('Failed to verify OTP. Please try again.');
            console.error('Error:', error);
        }
    };

    const handleChangeNumber = () => {
    
        setCredentials({
            emailOrPhone: '',
            otp: '',
        });
        setOtpSession(null);
        setMessage('');
        setError('');
        setOtpError('');
    };

    return (
        <div className="login-container">
            <div className="text-container">
                <h1 className="italic-text">Planning For Abroad Studies !!</h1>
                <h2 className="italic-text">Let's, Join with us</h2>
            </div>
            <div className="form-container">
                <h2 className="login-header">Create Account</h2>
                <form onSubmit={otpSession ? handleOtpSubmit : handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="emailOrPhone" className='phoneNumber'>Phone Number</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="emailOrPhone"
                                name="emailOrPhone"
                                value={credentials.emailOrPhone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required
                                disabled={otpSession !== null}
                            />
                        </div>
                        {error && <span className="error-message">{error}</span>}
                    </div>
                    {otpSession && (
                        <div className="form-group">
                            <label htmlFor="otp">OTP</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    value={credentials.otp}
                                    onChange={handleChange}
                                    placeholder="Enter the OTP"
                                    required
                                />
                            </div>
                            {otpError && <span className="error-message">{otpError}</span>}
                        </div>
                    )}
                    {message && <span className="success-message">{message}</span>}
                    <button type="submit">Submit</button>
                    {otpSession && (
                        <button type="button" onClick={handleChangeNumber} className="change-number-button">
                            Change Number
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
