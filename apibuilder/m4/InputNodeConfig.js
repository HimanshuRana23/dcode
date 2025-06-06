import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function InputNodeConfig({ node, onSave, onClose }) {
  const [name, setName] = useState('');
  const [scale, setScale] = useState('User Specific');

  useEffect(() => {
    if (node.data.config) {
      try {
        const config = JSON.parse(node.data.config);
        setName(config.name || '');
        setScale(config.scale || 'User Specific');
      } catch (e) {
        console.error('Error parsing node config:', e);
      }
    }
  }, [node]);

  const handleSave = () => {
    const config = {
      name,
      scale
    };
    onSave(node.id, JSON.stringify(config));
  };

  return (
    <RightSideBarConfig
      title="Input Node Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Name Field */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            color: '#1a192b'
          }}>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px'
            }}
            placeholder="Enter node name"
          />
        </div>

        {/* Scale Radio Buttons */}
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            color: '#1a192b'
          }}>
            Scale
          </label>
          <div style={{ display: 'flex', gap: '20px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                value="User Specific"
                checked={scale === 'User Specific'}
                onChange={(e) => setScale(e.target.value)}
                style={{ cursor: 'pointer' }}
              />
              User Specific
            </label>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                value="Global"
                checked={scale === 'Global'}
                onChange={(e) => setScale(e.target.value)}
                style={{ cursor: 'pointer' }}
              />
              Global
            </label>
          </div>
        </div>
      </div>
    </RightSideBarConfig>
  );
}

export default InputNodeConfig; 