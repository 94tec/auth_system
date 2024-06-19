// src/components/MailOptions.js
import React from 'react';
const dotenv = require('dotenv');
dotenv.config();
import logo from '../static/carZola.png';
import '../static/MailOptions.css';

const MailOptions = ({ email, token }) => {
  const mailOptions = {
    from: process.env.REACT_APP_EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    text: `Please click the following link to reset your password: ${process.env.REACT_APP_BASE_URL}/reset-password/${token}`
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo" className="form-logo" />
      <h1>Mail Options</h1>
      <div className="mail-options">
        <div>
          <span className="label">From:</span>
          <span className="value">{mailOptions.from}</span>
        </div>
        <div>
          <span className="label">To:</span>
          <span className="value">{mailOptions.to}</span>
        </div>
        <div>
          <span className="label">Subject:</span>
          <span className="value">{mailOptions.subject}</span>
        </div>
        <div>
          <span className="label">Text:</span>
          <div className="value">
            Please click the following link to reset your password: <br />
            <a href={`${process.env.REACT_APP_BASE_URL}/reset-password/${token}`}>
              {`${process.env.REACT_APP_BASE_URL}/reset-password/${token}`}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailOptions;
