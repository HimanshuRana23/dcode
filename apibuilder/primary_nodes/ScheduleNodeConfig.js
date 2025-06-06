import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function ScheduleNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    scheduleType: 'oneTime',
    startDate: '',
    endDate: '',
    frequency: 'daily',
    time: '',
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
      title="Schedule Node Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Schedule Type</label>
          <select
            value={config.scheduleType}
            onChange={(e) => setConfig({ ...config, scheduleType: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="oneTime">One Time</option>
            <option value="recurring">Recurring</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Start Date</label>
          <input
            type="datetime-local"
            value={config.startDate}
            onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        {config.scheduleType === 'recurring' && (
          <>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>End Date</label>
              <input
                type="datetime-local"
                value={config.endDate}
                onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px' }}>Frequency</label>
              <select
                value={config.frequency}
                onChange={(e) => setConfig({ ...config, frequency: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </>
        )}
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Time</label>
          <input
            type="time"
            value={config.time}
            onChange={(e) => setConfig({ ...config, time: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
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
            placeholder="Enter schedule description"
          />
        </div>
      </div>
    </RightSideBarConfig>
  );
}

export default ScheduleNodeConfig; 