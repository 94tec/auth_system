// src/components/AuthForm.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '../store';
import '../App.css';

const AuthForm = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        const response = await axios.post('http://localhost:3000/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        dispatch(loginSuccess(response.data.user));
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        await axios.post('http://localhost:3000/auth/register', { name, email, password });
        alert('Registration successful! Please log in.');
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <form className="input-group" onSubmit={handleSubmit}>
      {!isLogin && (
        <input
          type="text"
          className="input-field"
          placeholder="User ID"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <input
        type="email"
        className="input-field"
        placeholder="Email ID"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="input-field"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {isLogin ? (
        <>
          <input type="checkbox" className="check-box" /><span>Remember Password</span>
          <button type="submit" className="submit-btn">Login</button>
        </>
      ) : (
        <>
          <input type="checkbox" className="check-box" /><span>I agree to the terms and conditions</span>
          <button type="submit" className="submit-btn">Sign Up</button>
        </>
      )}
    </form>
  );
};

export default AuthForm;
