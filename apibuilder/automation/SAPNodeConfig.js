import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function SAPNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    sapSystem: '',
    functionName: '',
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
      title="SAP Node Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>SAP System</label>
          <input
            type="text"
            value={config.sapSystem}
            onChange={(e) => setConfig({ ...config, sapSystem: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter SAP system name"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Function Name</label>
          <input
            type="text"
            value={config.functionName}
            onChange={(e) => setConfig({ ...config, functionName: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter SAP function name"
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

export default SAPNodeConfig; 