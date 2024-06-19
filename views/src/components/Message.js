// src/components/Message.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearMessage } from '../store';
import '../static/Message.css'; 

const Message = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.message);

  if (!message.content) {
    return null;
  }

  const handleClose = () => {
    dispatch(clearMessage());
  };

  return (
    <div className={`message ${message.type}`}>
      <span>{message.content}</span>
      <button onClick={handleClose} className="close-btn">&times;</button>
    </div>
  );
};

export default Message;
