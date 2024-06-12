// src/pages/RegisterPage.js
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import '../App.css';

const RegisterPage = () => {
  const [isLogin, setIsLogin] = useState(false); // Set isLogin to false for registration form

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="hero">
      <div className="form-box">
        <div className="button-box">
          <div id="btn" className={isLogin ? "btn-login" : "btn-register"}></div>
          <button type="button" className="toggle-btn" onClick={toggleForm}>Login</button>
          <button type="button" className="toggle-btn" onClick={toggleForm}>Register</button>
        </div>
        <AuthForm isLogin={isLogin} />
      </div>
    </div>
  );
};

export default RegisterPage;
