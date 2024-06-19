// src/components/AuthForm.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import logo from '../static/carZola.png';
import { loginSuccess, setMessageWithTimeout  } from '../store';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import '../App.css';

const AuthForm = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const response = await axios.post('http://localhost:5000/auth/login', { email, password });
        const user = response.data.user;
        localStorage.setItem('token', response.data.token);
        dispatch(loginSuccess(response.data.user));
        dispatch(setMessageWithTimeout({ content: 'User Logged in Successfully!', type: 'success' }));
        console.log('User Logged in Successfully', user);
       
      } catch (err) {
        dispatch(setMessageWithTimeout({ content: 'Login Failed. Please try again.', type: 'error' }));
      }
    } else {
      if (password !== confirmPassword) {
        dispatch(setMessageWithTimeout({ content: 'Passwords do not match', type: 'error' }));
        return;
      }
      try {
        await axios.post('http://localhost:5000/auth/register', { name, email, password, confirmPassword });
        dispatch(setMessageWithTimeout({ content: 'Registration successful! Please log in.', type: 'success' }));
        console.log('Registration successful! Please activate your account' , email);
        // Clear form fields
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        // Navigate to login page
        navigate('/login');
      } catch (err) {
        dispatch(setMessageWithTimeout({ content: err, type: 'error' }));
      }
    }
  };

  return (
    <form className="input-group" onSubmit={handleSubmit}>
      <img src={logo} alt="Logo" className="form-logo" />
      <h1 className="form-heading">{isLogin ? 'Enter Credentials to Login' : 'Register an Account'}</h1>
      {!isLogin && (
        <div className="input-wrapper">
          <label htmlFor="email" className="input-label">Full name</label>
          <i className="fas fa-user icon"></i>
          <input
            type="text"
            className="input-field"
            placeholder="Enter Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}
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
      <div className="input-wrapper">
        <label htmlFor="email" className="input-label">Password</label>
        <i className="fas fa-lock icon"></i>
        <input
          type="password"
          className="input-field"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {!isLogin && (
        <div className="input-wrapper">
          <label htmlFor="email" className="input-label">Confirm Password</label>
          <i className="fas fa-lock icon"></i>
          <input
            type="password"
            className="input-field"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
      )}
      {isLogin ? (
        <div className='loginRememberPasswordCheck'>
          <div className='rememberPasswordGroup'>
            <input type="checkbox" className="check-box" />
            <span>Remember Password</span>
          </div>
          <button type="submit" className="submit-btn">Login</button>
          <div><Link to="/forgot-password" className='linkPassword'>Forgot Password?</Link></div>
        </div>
      ) : (
        <div className='termsCheck'>
          <div className='termsCheckGroup'>
            <input type="checkbox" className="check-box" /><span>I agree to the terms and conditions</span>
          </div>
          <button type="submit" className="submit-btn">Sign Up</button>
        </div>
      )}
    </form>
  );
};

export default AuthForm;
