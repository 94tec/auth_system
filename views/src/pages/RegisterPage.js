import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import '../App.css';

const RegisterPage = () => {
  const [isLogin, setIsLogin] = useState(false); // Set isLogin to false for registration form

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

export default RegisterPage;
