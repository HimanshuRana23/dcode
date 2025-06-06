import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function MaterialNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    materialId: '',
    materialName: '',
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
      title="Material Node Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Material ID</label>
          <input
            type="text"
            value={config.materialId}
            onChange={(e) => setConfig({ ...config, materialId: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter material ID"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Material Name</label>
          <input
            type="text"
            value={config.materialName}
            onChange={(e) => setConfig({ ...config, materialName: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter material name"
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

export default MaterialNodeConfig; 