// src/components/ResetPasswordForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMessage} from '../store';
import logo from '../static/carZola.png';
import Loading from '../pages/Loading';
import '../static/AuthForm.css'; // New CSS file for transitions
import '../App.css';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    try {
      await axios.post('http://localhost:5000/auth/forgot-password', { email });
      dispatch(setMessage({
        content: `Password reset link sent to email address: ${email}`,
        type: 'success'
      }));
      console.log('Password reset link sent! Please check your email.');
    } catch (err) {
      console.error(err);
      dispatch(setMessage({
        content: err.response.data.error,
        type: 'error'
      })); // Assuming error message from backend is in err.response.data.error
    }
    setIsLoading(false); // Stop loading
  };

  return (
    <div className={`auth-form-container ${isLoading ? 'fade-out' : 'fade-in'}`}>
        {isLoading && <Loading />}
        <form className="input-group" onSubmit={handleSubmit}>
          <img src={logo} alt="Logo" className="form-logo" />
          <h1 className="form-heading-forgot-password">Forgot Password</h1>
          <span className="instructions">Enter the email you used to create the account and we will email you instructions to reset your password.</span>
          <div className='linkPass'>
          </div>
          <div className="input-wrapper">
            <label htmlFor="email" className="input-label">Email ID</label>
            <i className="fas fa-envelope icon"></i>
            <input
              type="email"
              className="input-field"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Send Reset Link</button>
          <div className="bottom-link"><span>Remember Password? </span><Link to="/login" className='login-btn-link'>Login</Link></div>
        </form>
    </div>
  );
};

export default ResetPasswordForm;
