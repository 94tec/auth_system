// src/components/AuthForm.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '../store';
import '../App.css';

const AuthForm = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const response = await axios.post('http://localhost:5000/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        dispatch(loginSuccess(response.data.user));
        console.log(response.data.user);
      } catch (err) {
        console.error(err);
      }
    } else {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      try {
        await axios.post('http://localhost:5000/auth/register', { name, email, password });
        alert('Registration successful! Please log in.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <form className="input-group" onSubmit={handleSubmit}>
      <h1 className="form-heading">{isLogin ? 'Enter Credentials to Login' : 'Register an Account'}</h1>
      {!isLogin && (
        <div className="input-wrapper">
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
