import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function ProcessTerminateNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    terminationType: 'success',
    message: '',
    statusCode: '200',
    description: ''
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
      title="Process Terminate Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Termination Type</label>
          <select
            value={config.terminationType}
            onChange={(e) => setConfig({ ...config, terminationType: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="success">Success</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="custom">Custom</option>
          </select>
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
            placeholder="Enter termination message"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Status Code</label>
          <input
            type="text"
            value={config.statusCode}
            onChange={(e) => setConfig({ ...config, statusCode: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="Enter status code"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Description</label>
          <textarea
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            style={{
              width: '100%',
              height: '100px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              resize: 'vertical'
            }}
            placeholder="Enter termination description"
          />
        </div>
      </div>
    </RightSideBarConfig>
  );
}

export default ProcessTerminateNodeConfig; 