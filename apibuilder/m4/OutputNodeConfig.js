import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function OutputNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState('');

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
      title="Output Node Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <textarea
        value={config}
        onChange={(e) => setConfig(e.target.value)}
        style={{
          width: '100%',
          height: '200px',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontSize: '14px',
          resize: 'vertical'
        }}
        placeholder="Enter node configuration"
      />
    </RightSideBarConfig>
  );
}

export default OutputNodeConfig; 