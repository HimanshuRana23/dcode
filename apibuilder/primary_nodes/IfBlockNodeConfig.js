import React, { useState, useEffect } from 'react';
import RightSideBarConfig from '../RightSideBarConfig';

function IfBlockNodeConfig({ node, onSave, onClose }) {
  const [config, setConfig] = useState({
    condition: '',
    operator: 'AND',
    conditions: [],
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

  const addCondition = () => {
    setConfig({
      ...config,
      conditions: [...config.conditions, { field: '', operator: 'equals', value: '' }]
    });
  };

  const updateCondition = (index, field, value) => {
    const newConditions = [...config.conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConfig({ ...config, conditions: newConditions });
  };

  const removeCondition = (index) => {
    const newConditions = config.conditions.filter((_, i) => i !== index);
    setConfig({ ...config, conditions: newConditions });
  };

  return (
    <RightSideBarConfig
      title="If Block Configuration"
      onSave={handleSave}
      onClose={onClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Main Condition</label>
          <textarea
            value={config.condition}
            onChange={(e) => setConfig({ ...config, condition: e.target.value })}
            style={{
              width: '100%',
              height: '100px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              resize: 'vertical'
            }}
            placeholder="Enter main condition"
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Operator</label>
          <select
            value={config.operator}
            onChange={(e) => setConfig({ ...config, operator: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="AND">AND</option>
            <option value="OR">OR</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>Conditions</label>
          {config.conditions.map((condition, index) => (
            <div key={index} style={{ marginBottom: '16px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={condition.field}
                  onChange={(e) => updateCondition(index, 'field', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                  placeholder="Field name"
                />
                <select
                  value={condition.operator}
                  onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                >
                  <option value="equals">Equals</option>
                  <option value="notEquals">Not Equals</option>
                  <option value="contains">Contains</option>
                  <option value="greaterThan">Greater Than</option>
                  <option value="lessThan">Less Than</option>
                </select>
                <input
                  type="text"
                  value={condition.value}
                  onChange={(e) => updateCondition(index, 'value', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                  placeholder="Value"
                />
                <button
                  onClick={() => removeCondition(index)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addCondition}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            Add Condition
          </button>
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
            placeholder="Enter if block description"
          />
        </div>
      </div>
    </RightSideBarConfig>
  );
}

export default IfBlockNodeConfig; 