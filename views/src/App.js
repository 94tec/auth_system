import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';
import store from './store';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import Message from './components/Message';

const App = () => {

  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Message />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ResetPassword />} />
              <Route path="/reset-password" element={<ChangePassword />} />
              <Route path="/" element={<LoginPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
};

export default App;
