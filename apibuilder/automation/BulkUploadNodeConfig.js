import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function BulkUploadNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    fileType: '',
    template: '',
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
      title="Bulk Upload Node Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>File Type</label>
          <input
            type="text"
            value={config.fileType}
            onChange={(e) => setConfig({ ...config, fileType: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter file type (e.g. xlsx, csv)"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Template</label>
          <input
            type="text"
            value={config.template}
            onChange={(e) => setConfig({ ...config, template: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter template name or URL"
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

export default BulkUploadNodeConfig; 