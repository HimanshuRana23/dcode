import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function MachineNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    machineId: '',
    machineName: '',
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
      title="Machine Node Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Machine ID</label>
          <input
            type="text"
            value={config.machineId}
            onChange={(e) => setConfig({ ...config, machineId: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter machine ID"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Machine Name</label>
          <input
            type="text"
            value={config.machineName}
            onChange={(e) => setConfig({ ...config, machineName: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter machine name"
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

export default MachineNodeConfig; 