import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home">
      <h1>Welcome to DCode</h1>
      <p>This application helps you generate and manage API URLs efficiently.</p>
      <div className="features">
        <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/homeapi')}>
          <h3>API Generator</h3>
          <p>Create and customize your API endpoints with ease.</p>
        </div>
        <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/xplot')}>
          <h3>XPlot</h3>
          <p>Organize and manage your URLs in one place.</p>
        </div>
        {/* <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/xreport')}>
          <h3>Xreport</h3>
          <p>Organize and manage your URLs in one place.</p>
        </div> */}
        <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/xdag')}>
          <h3>Xdag</h3>
          <p>Organize and manage your URLs in one place.</p>
        </div>
        <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/flows')}>
          <h3>Flow Editor</h3>
          <p>Organize and manage your URLs  in one place.</p>
        </div>
        <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/factoryintelligence')}>
          <h3>Factory Intelligence</h3>
          <p>Organize and manage your URLs  in one place.</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 