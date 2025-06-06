import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function NotificationNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    title: '',
    message: '',
    type: 'info'
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
      title="Notification Node Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Title</label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter notification title"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Message</label>
          <textarea
            value={config.message}
            onChange={(e) => setConfig({ ...config, message: e.target.value })}
            style={{ width: '100%', height: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', resize: 'vertical' }}
            placeholder="Enter notification message"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Type</label>
          <select
            value={config.type}
            onChange={(e) => setConfig({ ...config, type: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="success">Success</option>
          </select>
        </div>
      </div>
    </RightSideBarConfig>
  );
}

export default NotificationNodeConfig; 