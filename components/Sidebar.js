import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaCode, FaInfoCircle } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              <div className="nav-item-content">
                <FaHome className="sidebar-icon" />
                <span>Home</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/homeapi" className={({ isActive }) => isActive ? 'active' : ''}>
              <div className="nav-item-content">
                <FaCode className="sidebar-icon" />
                <span>API Generator</span>
              </div>
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/xplot" className={({ isActive }) => isActive ? 'active' : ''}>
              <div className="nav-item-content">
                <FaCode className="sidebar-icon" />
                <span>XPlot</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/xreport" className={({ isActive }) => isActive ? 'active' : ''}>
              <div className="nav-item-content">
                <FaCode className="sidebar-icon" />
                <span>Xreport</span>
              </div>
            </NavLink>
          </li> */}
          <li>
            <NavLink to="/xdag" className={({ isActive }) => isActive ? 'active' : ''}>
              <div className="nav-item-content">
                <FaCode className="sidebar-icon" />
                <span>Xdag</span>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
              <div className="nav-item-content">
                <FaInfoCircle className="sidebar-icon" />
                <span>About</span>
              </div>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 