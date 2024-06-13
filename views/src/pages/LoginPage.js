import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import '../App.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="hero">
      <div className="form-box">
        <div className="button-box">
          <div id="btn" className={isLogin ? "left" : "right"}></div>
          <button 
            type="button" 
            className={`toggle-btn ${isLogin ? "active" : ""}`} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            type="button" 
            className={`toggle-btn ${!isLogin ? "active" : ""}`} 
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>
        <AuthForm isLogin={isLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
