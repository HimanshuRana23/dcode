import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about">
      <h1>About URL Generator</h1>
      <p>
        URL Generator is a powerful tool designed to help developers create and manage API endpoints efficiently.
        Our application provides a user-friendly interface for generating and customizing URLs for your APIs.
      </p>
      <div className="about-section">
        <h2>Features</h2>
        <ul>
          <li>Easy URL generation</li>
          <li>Customizable API endpoints</li>
          <li>User-friendly interface</li>
          <li>Efficient URL management</li>
        </ul>
      </div>
    </div>
  );
};

export default About; 