// src/components/ChangePasswordForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setMessageWithTimeout  } from '../store';
import '../App.css';
import logo from '../static/carZola.png';
import '../App.css';

const ChangePasswordForm = () => {
  const [newPassword, setNewPassword] = useState('');
  const [comfirmNewPassword, setComfirmNewPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== comfirmNewPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://localhost:5000/auth/reset-password', { newPassword });
      dispatch(setMessageWithTimeout({ content: 'Password changed successfully! Please log in!', type: 'success' }));
    } catch (err) {
      console.error(err);
      dispatch(setMessageWithTimeout({ content: err, type: 'error' }));
    }
  };

  return (
    <form className="input-group" onSubmit={handleSubmit}>
      <img src={logo} alt="Logo" className="form-logo" />
      <h1 className="form-heading-forgot-password">Create New Password</h1>
      <span className="instructions">Remember, your new password must be different from any of your previous passwords.</span>
      <div className="input-wrapper">
      <label htmlFor="password" className="input-label">Password</label>
        <i className="fas fa-lock icon"></i>
        <input
          type="password"
          className="input-field"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div className="input-wrapper">
      <label htmlFor="password" className="input-label">Comfirm Password</label>
        <i className="fas fa-lock icon"></i>
        <input
          type="password"
          className="input-field"
          placeholder="Confirm New Password"
          value={comfirmNewPassword}
          onChange={(e) => setComfirmNewPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="submit-btn">Change Password</button>
    </form>
  );
};

export default ChangePasswordForm;
