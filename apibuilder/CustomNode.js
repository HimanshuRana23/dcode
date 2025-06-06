import React from 'react';
import { Handle, Position } from '@xyflow/react';

function CustomNode({ data = {}, id, selected }) {
  // Debug log to check id and data
  console.log('CustomNode id:', id, 'data:', data);

  const handleDelete = (event) => {
    event.stopPropagation();
    const deleteEvent = new CustomEvent('nodeDelete', {
      detail: { nodeId: id }
    });
    document.dispatchEvent(deleteEvent);
  };

  return (
    <div
      style={{
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        minWidth: '150px',
        position: 'relative',
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {data.icon && (
          <span style={{ fontSize: '22px', width: '28px', textAlign: 'center' }}>{data.icon}</span>
        )}
        <span>{data.label || ''}</span>
      </div>
      {selected && (
        <button
          onClick={handleDelete}
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            background: 'white',
            border: '1px solid #ddd',
            cursor: 'pointer',
            padding: '2px',
            color: '#ff0000',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: 10,
          }}
        >
          ×
        </button>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default CustomNode;