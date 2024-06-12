// src/pages/LoginPage.js
import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import '../App.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

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

export default LoginPage;
