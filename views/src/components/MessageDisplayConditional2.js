import React from 'react';
import { useLocation } from 'react-router-dom';
import ResetLinkMessage from './ResetLinkMessage'; // Replace with correct import path

const MessageDisplayConditional2 = () => {
  const location = useLocation();
  const showMessage = location.pathname === '/forgot-password'; // Show message only on the forgot-password page

  return showMessage ? <ResetLinkMessage /> : null;
};

export default MessageDisplayConditional2;
