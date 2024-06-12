// src/context/AuthContext.js
import React, { createContext, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginSuccess, logoutSuccess } from '../store';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('http://localhost:3000/auth/me')
        .then(response => {
          dispatch(loginSuccess(response.data));
        })
        .catch(() => {
          localStorage.removeItem('token');
          dispatch(logoutSuccess());
        });
    }
  }, [dispatch]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

export { AuthProvider, AuthContext };
