import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function MethodNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    methodId: '',
    methodName: '',
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
      title="Method Node Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Method ID</label>
          <input
            type="text"
            value={config.methodId}
            onChange={(e) => setConfig({ ...config, methodId: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter method ID"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Method Name</label>
          <input
            type="text"
            value={config.methodName}
            onChange={(e) => setConfig({ ...config, methodName: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter method name"
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

export default MethodNodeConfig; 