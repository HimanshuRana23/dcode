import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function SubFormNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    subFormId: '',
    subFormName: '',
    parentFormId: '',
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
      title="Sub Form Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Sub Form ID</label>
          <input
            type="text"
            value={config.subFormId}
            onChange={(e) => setConfig({ ...config, subFormId: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="Enter sub form ID"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Sub Form Name</label>
          <input
            type="text"
            value={config.subFormName}
            onChange={(e) => setConfig({ ...config, subFormName: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="Enter sub form name"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Parent Form ID</label>
          <input
            type="text"
            value={config.parentFormId}
            onChange={(e) => setConfig({ ...config, parentFormId: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="Enter parent form ID"
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
            placeholder="Enter sub form description"
          />
        </div>
      </div>
    </RightSideBarConfig>
  );
}

export default SubFormNodeConfig; 