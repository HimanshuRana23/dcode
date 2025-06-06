import React, { useState } from 'react';

function RightSideBarConfig({ title, children, onClose, onSave }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before calling onClose
    setTimeout(() => {
      onClose();
    }, 300); // Match this with animation duration
  };

  return (
    <div 
      className="right-sidebar"
      style={{
        width: '50vw',
        height: 'calc(100vh - 100px)',
        backgroundColor: 'white',
        borderLeft: '1px solid #eee',
        padding: '20px',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: '100px',
        right: 0,
        animation: isClosing ? 'slideOut 0.3s ease-out' : 'slideIn 0.3s ease-out',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
          @keyframes slideOut {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(100%);
            }
          }
        `}
      </style>
      
      {/* Header Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '1px solid #eee'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              onSave();
              handleClose();
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1a192b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.2s ease',
              ':hover': {
                backgroundColor: '#2a2a3b'
              }
            }}
          >
            Save
          </button>
          <h3 style={{ 
            margin: 0,
            fontSize: '18px',
            color: '#1a192b'
          }}>
            {title}
          </h3>
        </div>
        <button
          onClick={handleClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '12px',
            color: '#1a192b',
            fontSize: '24px',
            fontWeight: 'normal'
          }}
        >
          {isClosing ? '▶' : '×'}
        </button>
      </div>

      {/* Content Section */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '10px 0'
      }}>
        {children}
      </div>
    </div>
  );
}

export default RightSideBarConfig; 