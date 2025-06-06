import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function WarningMessageNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    message: '',
    severity: 'warning',
    showInUI: true,
    logToConsole: true,
    dismissible: true,
    autoDismiss: false,
    dismissTimeout: 5000
  });

  useEffect(() => {
    if (node.data.config) {
      try {
        const savedConfig = typeof node.data.config === 'string' 
          ? JSON.parse(node.data.config) 
          : node.data.config;
        setConfig(savedConfig);
      } catch (e) {
        console.error('Error parsing node config:', e);
      }
    }
  }, [node]);

  const handleSave = () => {
    onSave(node.id, JSON.stringify(config));
  };

  return (
    <RightSideBarConfig title="Warning Message Configuration" onSave={handleSave} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Warning Message</label>
          <textarea
            value={config.message}
            onChange={(e) => setConfig({ ...config, message: e.target.value })}
            style={{
              width: '100%',
              height: '100px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              resize: 'vertical'
            }}
            placeholder="Enter warning message"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Severity</label>
          <select
            value={config.severity}
            onChange={(e) => setConfig({ ...config, severity: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="warning">Warning</option>
            <option value="info">Info</option>
            <option value="notice">Notice</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={config.showInUI}
              onChange={(e) => setConfig({ ...config, showInUI: e.target.checked })}
            />
            Show in UI
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={config.logToConsole}
              onChange={(e) => setConfig({ ...config, logToConsole: e.target.checked })}
            />
            Log to Console
          </label>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={config.dismissible}
              onChange={(e) => setConfig({ ...config, dismissible: e.target.checked })}
            />
            Dismissible
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={config.autoDismiss}
              onChange={(e) => setConfig({ ...config, autoDismiss: e.target.checked })}
            />
            Auto Dismiss
          </label>
        </div>
        {config.autoDismiss && (
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Dismiss Timeout (ms)</label>
            <input
              type="number"
              value={config.dismissTimeout}
              onChange={(e) => setConfig({ ...config, dismissTimeout: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
              min="1000"
              step="1000"
            />
          </div>
        )}
      </div>
    </RightSideBarConfig>
  );
}

export default WarningMessageNodeConfig; 