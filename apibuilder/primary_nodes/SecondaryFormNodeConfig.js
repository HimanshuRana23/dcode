import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function SecondaryFormNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    formId: '',
    formName: '',
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
      title="Secondary Form Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Form ID</label>
          <input
            type="text"
            value={config.formId}
            onChange={(e) => setConfig({ ...config, formId: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="Enter form ID"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Form Name</label>
          <input
            type="text"
            value={config.formName}
            onChange={(e) => setConfig({ ...config, formName: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="Enter form name"
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
            placeholder="Enter form description"
          />
        </div>
      </div>
    </RightSideBarConfig>
  );
}

export default SecondaryFormNodeConfig; 