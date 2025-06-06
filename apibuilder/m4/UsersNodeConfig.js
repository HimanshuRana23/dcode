import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function UsersNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    userId: '',
    userName: '',
    description: ''
  });

  useEffect(() => {
    if (node.data.config) {
      const config = typeof node.data.config === 'string' ? JSON.parse(node.data.config) : node.data.config;
      setConfig(config);
    }
  }, [node]);

  const handleSave = () => {
    onSave(node.id, config);
  };

  return (
    <RightSideBarConfig
      title="Users Node Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>User ID</label>
          <input
            type="text"
            value={config.userId}
            onChange={(e) => setConfig({ ...config, userId: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter user ID"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>User Name</label>
          <input
            type="text"
            value={config.userName}
            onChange={(e) => setConfig({ ...config, userName: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter user name"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
          <textarea
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            style={{ width: '100%', height: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', resize: 'vertical' }}
            placeholder="Enter description"
          />
        </div>
      </div>
    </RightSideBarConfig>
  );
}

export default UsersNodeConfig; 