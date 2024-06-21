import React from 'react';
import '../static/Loading.css'; 

const Loading = () => {
    return (
      <div className="loading-container">
        <div className="container">
          <div className="ring"></div>
          <div className="ring"></div>
          <div className="ring"></div>
        </div>
      </div>
    );
  };

export default Loading;
