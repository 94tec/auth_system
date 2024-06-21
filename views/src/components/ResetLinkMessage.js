// src/components/MessageDisplay.js
import React from 'react';
import { connect } from 'react-redux';
import '../static/Message.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCheckCircle } from '@fortawesome/free-solid-svg-icons';


const ResentLinkMessage = ({ messages }) => {
  // Ensure messages is defined and is an array
  if (!Array.isArray(messages)) {
    return null;
  }

  return (
    <div className='messageContainer'>
      {messages.map((message) => (
        <div key={message.id} className={`sentMessage ${message.type}`}>
          <FontAwesomeIcon icon={faEnvelope} className='fa-envelope' />
            {message.content}
            <FontAwesomeIcon icon={faCheckCircle} className='fa-check-circle'/>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  messages: state.message.messages,
});

export default connect(mapStateToProps)(ResentLinkMessage);
