// src/components/ResetPasswordForm.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMessageWithTimeout  } from '../store';
import logo from '../static/carZola.png';
import axios from 'axios';
import '../App.css';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/auth/forgot-password', { email });
      dispatch(setMessageWithTimeout({ content: `Password reset link sent successful! Please check your email:${email}`, type: 'success' }));
      console.log('Password reset link sent! Please check your email.');
    } catch (err) {
      console.error(err);
      dispatch(setMessageWithTimeout({ content: err, type: 'error' }));
    }
  };

  return (
    <form className="input-group" onSubmit={handleSubmit}>
      <img src={logo} alt="Logo" className="form-logo" />
      <h1 className="form-heading-forgot-password">Forgot Password</h1>
      <span className="instructions">Enter the email you used to create the account and we will email you instructions to reset your password.</span>
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
  );
};

export default ResetPasswordForm;
