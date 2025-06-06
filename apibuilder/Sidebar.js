import React, { useState } from 'react';

// Define node groups and icons
export const nodeGroups = {
  source: {
    label: 'Source',
    nodes: ['start', 'url', 'staticValue', 'questionId']
  },
  operator: {
    label: 'Operator',
    nodes: ['equalTo', 'lessThan', 'greaterThan', 'lessThanOrEqual', 'greaterThanOrEqual', 'and', 'or']
  },
  messages: {
    label: 'Messages',
    nodes: ['errorMessage', 'warningMessage']
  }
};

export const nodeTypes = {
  start: {
    label: 'Start',
    group: 'source',
    icon: '▶️'
  },
  url: {
    label: 'URL',
    group: 'source',
    icon: '🔗'
  },
  staticValue: {
    label: 'Static Value',
    group: 'source',
    icon: '📝'
  },
  questionId: {
    label: 'Question ID',
    group: 'source',
    icon: '❓'
  },
  equalTo: {
    label: 'Equal to',
    group: 'operator',
    icon: '='
  },
  lessThan: {
    label: 'Less than',
    group: 'operator',
    icon: '<'
  },
  greaterThan: {
    label: 'Greater than',
    group: 'operator',
    icon: '>'
  },
  lessThanOrEqual: {
    label: 'Less than or Equal to',
    group: 'operator',
    icon: '≤'
  },
  greaterThanOrEqual: {
    label: 'Greater than or Equal to',
    group: 'operator',
    icon: '≥'
  },
  and: {
    label: 'AND',
    group: 'operator',
    icon: '∧'
  },
  or: {
    label: 'OR',
    group: 'operator',
    icon: '∨'
  },
  errorMessage: {
    label: 'Error Message',
    group: 'messages',
    icon: '❌'
  },
  warningMessage: {
    label: 'Warning Message',
    group: 'messages',
    icon: '⚠️'
  }
};

const tabLabels = ['Source', 'Operator', 'Messages'];

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('source');

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const renderTabNodes = (tabKey) => {
    const group = nodeGroups[tabKey.toLowerCase()];
    if (!group) return null;

    return (
      <div style={{ padding: '10px' }}>
        {group.nodes.length === 0 && (
          <div style={{ color: '#888', fontSize: '13px', marginTop: '20px' }}>No nodes available.</div>
        )}
        {group.nodes.map((nodeKey) => {
          const nodeType = nodeTypes[nodeKey];
          if (!nodeType) return null;
          
          return (
            <div
              key={nodeKey}
              className="dndnode"
              onDragStart={(event) => onDragStart(event, nodeKey)}
              draggable
              style={{
                border: '1px solid #ddd',
                padding: '12px',
                marginBottom: '12px',
                borderRadius: '6px',
                cursor: 'grab',
                backgroundColor: '#f8f8f8',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '15px',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '22px', width: '28px', textAlign: 'center' }}>{nodeType.icon}</span>
              <span>{nodeType.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <aside style={{
      width: 260,
      padding: 0,
      borderRight: '1px solid #eee',
      backgroundColor: 'white',
      height: '100%',
      boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #eee',
        background: '#fafbfc',
      }}>
        {tabLabels.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '16px 0',
              textAlign: 'center',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              borderBottom: activeTab === tab ? '3px solid #2d7ff9' : '3px solid transparent',
              color: activeTab === tab ? '#2d7ff9' : '#333',
              fontSize: '13px',
              background: activeTab === tab ? '#fff' : 'transparent',
              transition: 'all 0.2s',
            }}
          >
            {tab}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {renderTabNodes(activeTab)}
      </div>
    </aside>
  );
};

export default Sidebar; 