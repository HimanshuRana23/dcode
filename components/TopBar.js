import React from 'react';
import './TopBar.css';

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="topbar-right">
        <h4 className="app-title">DCode</h4>
      </div>
      <div className="topbar-right">
        <div className="user-info">
          <span className="user-name">Welcome, User</span>
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar; 