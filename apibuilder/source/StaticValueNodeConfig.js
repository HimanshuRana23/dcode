import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function InformationNodeConfig({ node, onSave, onClose }) {
  const [formName, setFormName] = useState('');

  useEffect(() => {
    if (node.data.config) {
      const config = typeof node.data.config === 'string' ? JSON.parse(node.data.config) : node.data.config;
      setFormName(config.formName || '');
    }
  }, [node]);

  const handleSave = () => {
    const config = { formName };
    onSave(node.id, config);
  };

  return (
    <RightSideBarConfig
      title="Information Node Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#1a192b' }}>
            Information Form Name
          </label>
          <input
            type="text"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '15px' }}
            placeholder="Enter information form name"
          />
        </div>
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
          <button
            type="button"
            style={{ background: '#2176ae', color: 'white', border: 'none', borderRadius: '4px', padding: '10px 28px', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}
            onClick={handleSave}
          >
            Add
          </button>
        </div>
      </div>
    </RightSideBarConfig>
  );
}

export default InformationNodeConfig; 