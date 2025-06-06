import React, { useState } from 'react';

function NodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState(node.data.config || '');

  const handleSave = () => {
    onSave(node.id, config);
    onClose();
  };

  return (
    <div style={{
      width: '250px',
      height: '100%',
      backgroundColor: 'white',
      borderLeft: '1px solid #eee',
      padding: '20px',
      boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Node Configuration</h3>
        <textarea
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          style={{
            width: '100%',
            height: '150px',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            resize: 'none',
          }}
          placeholder="Enter node configuration..."
        />
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '8px 16px',
            backgroundColor: '#1a192b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Save
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default NodeConfig; 