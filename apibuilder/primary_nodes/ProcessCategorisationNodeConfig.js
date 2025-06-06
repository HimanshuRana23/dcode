import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function ProcessCategorisationNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    categoryName: '',
    categoryType: '',
    conditions: '',
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
      title="Process Categorisation Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Category Name</label>
          <input
            type="text"
            value={config.categoryName}
            onChange={(e) => setConfig({ ...config, categoryName: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
            placeholder="Enter category name"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Category Type</label>
          <select
            value={config.categoryType}
            onChange={(e) => setConfig({ ...config, categoryType: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="">Select Category Type</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="type">Type</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Conditions</label>
          <textarea
            value={config.conditions}
            onChange={(e) => setConfig({ ...config, conditions: e.target.value })}
            style={{
              width: '100%',
              height: '150px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              resize: 'vertical'
            }}
            placeholder="Enter categorization conditions (JSON format)"
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
            placeholder="Enter category description"
          />
        </div>
      </div>
    </RightSideBarConfig>
  );
}

export default ProcessCategorisationNodeConfig; 