// src/components/Message.js
import React from 'react';
import { connect } from 'react-redux';
import '../static/Message.css'; // Ensure you have this CSS file for styling

const Message = ({ messages }) => {
  // Ensure messages is defined and is an array
  if (!Array.isArray(messages)) {
    return null;
  }

  return (
    <div className="message-container">
      {messages.map((message) => (
        <div key={message.id} className={`message ${message.type}`}>
          {message.content}
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  messages: state.message.messages,
});

export default connect(mapStateToProps)(Message);
