import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeApi.css';

const HomeApi = () => {
  const navigate = useNavigate();
  return (
    <div className="home">
      <h1>Welcome to DCode</h1>
      <p>This application helps you generate and manage API URLs efficiently.</p>
      <div className="features">
        <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/api-generator')}>
          <h3>Single Table API</h3>
          <p>Create and customize your API endpoints with ease.</p>
        </div>
        <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/api-generator2')}>
          <h3>Double Table API</h3>
          <p>Organize and manage your URLs in one place.</p>
        </div>
        <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/api-generatordrilldown')}>
          <h3>DrillDown Form</h3>
          <p>Organize and manage your URLs in one place.</p>
        </div>
        <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/validation-api-generator')}>
          <h3>Validation API</h3>
          <p>Organize and manage your URLs in one place.</p>
        </div>
        <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/list-apis')}>
          <h3>API Editor</h3>
          <p>Organize and manage your URLs in one place.</p>
        </div>
        <div className="feature-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/api-flow-builder')}>
          <h3>API Flow Builder</h3>
          <p>Organize and manage your URLs in one place.</p>
        </div>
      </div>
    </div>
  );
};

export default HomeApi; 