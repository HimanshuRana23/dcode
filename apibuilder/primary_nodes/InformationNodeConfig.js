import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function InformationNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    title: '',
    message: '',
    type: 'info'
  });

  useEffect(() => {
    if (node.data.config) {
      setConfig(node.data.config);
    }
  }, [node]);

  const handleSave = () => {
    onSave(node.id, config);
  };

  return (
    <RightSideBarConfig
      title="Information Node Configuration"
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
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="Enter information title"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Message</label>
          <textarea
            value={config.message}
            onChange={(e) => setConfig({ ...config, message: e.target.value })}
            style={{
              width: '100%',
              height: '100px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              resize: 'vertical'
            }}
            placeholder="Enter information message"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Type</label>
          <select
            value={config.type}
            onChange={(e) => setConfig({ ...config, type: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="info">Information</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="success">Success</option>
          </select>
        </div>
      </div>
    </RightSideBarConfig>
  );
}

export default InformationNodeConfig; 