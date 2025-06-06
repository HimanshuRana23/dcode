import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function IOTAlarmsNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    alarmType: '',
    threshold: '',
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
      title="IOT Alarms Node Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Alarm Type</label>
          <input
            type="text"
            value={config.alarmType}
            onChange={(e) => setConfig({ ...config, alarmType: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter alarm type"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Threshold</label>
          <input
            type="text"
            value={config.threshold}
            onChange={(e) => setConfig({ ...config, threshold: e.target.value })}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            placeholder="Enter threshold value"
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

export default IOTAlarmsNodeConfig; 