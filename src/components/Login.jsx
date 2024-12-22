import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {

  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {

    if (!email) {
      setError('Please enter your email.');
      return;
    }
        try {
         const response = await axios.post(`${window.location.protocol}//${window.location.hostname}:7004/api/login/is-user-available`, {
         email,
         });
         if(!response.data.isUserAvailable){
           throw new Error("User is not available.");
         }
         const user = {
           availableToken: response.data.availableToken,
           isUserAvailable: response.data.isUserAvailable,
           otpToken: response.data.otpToken,
           email: email,
          };
          setUser(user);
          setStep(2); // Proceed to OTP verification step
          console.log("Login successful:", response.data);
         
        } catch (err) {
          console.error("Login error:", err);
          setError(err.response?.data?.message || "Login failed");
        }

  };

  const handleVerifyOtp = async () => {
    setError('');
    try {
      const response = await axios.post(`${window.location.protocol}//${window.location.hostname}:7004/api/login`, {
       availableToken: user.availableToken,
       otpToken: user.otpToken,
       email: user.email,  
       otpCode: otp
     });
     localStorage.setItem("authToken", response.data.jwt);
      navigate('/report'); // Navigate to the dashboard on success
     
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{step === 1 ? 'Login' : 'Enter OTP'}</h2>
        {error && <p className="error-message">{error}</p>}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendOtp();
            }}
          >
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">
              Send OTP
            </button>
          </form>
        )}
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyOtp();
            }}
          >
            <div className="form-group">
              <label htmlFor="otp">OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;