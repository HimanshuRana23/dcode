import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function URLNodeConfig({ node, onSave, onClose }) {
  const [url, setUrl] = useState('');
  const [remark, setRemark] = useState('');

  useEffect(() => {
    if (node.data.config) {
      try {
        const config = typeof node.data.config === 'string' ? JSON.parse(node.data.config) : node.data.config;
        setUrl(config.url || '');
        setRemark(config.remark || '');
      } catch (e) {
        console.error('Error parsing node config:', e);
      }
    }
  }, [node]);

  const handleSave = () => {
    const config = {
      url,
      remark,
      name: 'URL' // Static name for the node
    };
    onSave(node.id, JSON.stringify(config));
  };

  return (
    <RightSideBarConfig
      title="URL Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1a192b' }}>
            URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ddd', 
              fontSize: '15px'
            }}
            placeholder="Enter URL (e.g., https://example.com)"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1a192b' }}>
            Remark
          </label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              borderRadius: '4px', 
              border: '1px solid #ddd', 
              fontSize: '15px',
              minHeight: '100px',
              resize: 'vertical'
            }}
            placeholder="Enter any remarks or notes about this URL"
          />
        </div>
      </div>
    </RightSideBarConfig>
  );
}

export default URLNodeConfig; 