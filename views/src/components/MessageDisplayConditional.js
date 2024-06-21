import React from 'react';
import { useLocation } from 'react-router-dom';
import Message from './Message'; // Replace with correct import path

const MessageDisplayConditional = () => {
    const location = useLocation();
    const showMessage = ['/login', '/register'].includes(location.pathname); // Add paths where you want to show messages
  
    return showMessage ? <Message /> : null;
  };

export default MessageDisplayConditional;
