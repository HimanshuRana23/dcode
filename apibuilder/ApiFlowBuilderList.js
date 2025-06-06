import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ApiFlowBuilderList() {
  const [flows, setFlows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const fetchFlows = async () => {
    try {
      const response = await fetch('http://localhost/apiflowserver.php');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setFlows(data);
      } else {
        setError('Invalid data format received from server');
      }
      setLoading(false);
    } catch (error) {
      setError('Error fetching flows: ' + error.message);
      setLoading(false);
    }
  };

  const handleViewFlow = (flowId) => {
    console.log('[ListFlow] Flow ID being passed:', flowId);
    console.log('[ListFlow] Flow object:', flows.find(f => f.id === flowId));
    const url = `/api-flow-builder/${flowId}`;
    console.log('[ListFlow] Navigating to URL:', url);
    navigate(url);
  };

  const handleCreateNewFlow = () => {
    console.log('Navigating to new flow page');
    navigate('/api-flow-builder/new');
  };

  // Dummy handlers for controls
  const handleExport = () => alert('Export to Excel');
  const handleEdit = () => alert('Edit');
  const handleClone = () => alert('Clone');
  const handleSettings = () => alert('Settings');

  // Filter and sort flows
  const filteredFlows = flows
    .filter(flow =>
      flow.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'ASC') return a.id - b.id;
      else return b.id - a.id;
    });

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading flows...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', background: '#f6f7fb', minHeight: '100vh' }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={handleBackToHome}
              style={{
                padding: '8px 16px',
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              ← Back to Home
            </button>
            <h1 style={{ margin: 0 }}>Flows</h1>
          </div>
          <button
            onClick={handleCreateNewFlow}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2d7ff9',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <span style={{ fontSize: '18px' }}>+</span>
            Create New Flow
          </button>
        </div>
        {/* Controls above table */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))} style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc' }}>
              {[10, 20, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
            </select>
            <span style={{ fontSize: 13, color: '#444' }}>records</span>
          </div>
          <button onClick={handleExport} style={{ background: '#16213e', color: 'white', border: 'none', borderRadius: 4, padding: '8px 24px', fontWeight: 500, fontSize: 16, marginRight: 16 }}>Export to Excel</button>
          <div style={{ fontSize: 15, color: '#444', marginRight: 8 }}>Sorting :</div>
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ padding: '6px 10px', borderRadius: 4, border: '1px solid #ccc' }}>
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </select>
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 15, color: '#444', marginRight: 8 }}>Search:</div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }}
            placeholder=""
          />
        </div>
        {/* Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: '#16213e', color: 'white' }}>
                <th style={{ padding: '14px 12px', fontWeight: 600, fontSize: 15, textAlign: 'left', borderRight: '2px solid #fff' }}>ID No.</th>
                <th style={{ padding: '14px 12px', fontWeight: 600, fontSize: 15, textAlign: 'left', borderRight: '2px solid #fff' }}>Controls</th>
                <th style={{ padding: '14px 12px', fontWeight: 600, fontSize: 15, textAlign: 'left', borderRight: '2px solid #fff' }}>Form Name</th>
                <th style={{ padding: '14px 12px', fontWeight: 600, fontSize: 15, textAlign: 'left', borderRight: '2px solid #fff' }}>Workflow Status</th>
                <th style={{ padding: '14px 12px', fontWeight: 600, fontSize: 15, textAlign: 'left', borderRight: '2px solid #fff' }}>Version</th>
                <th style={{ padding: '14px 12px', fontWeight: 600, fontSize: 15, textAlign: 'left', borderRight: '2px solid #fff' }}>Clone Remark</th>
                <th style={{ padding: '14px 12px', fontWeight: 600, fontSize: 15, textAlign: 'left', borderRight: '2px solid #fff' }}>Secondary-Forms</th>
                <th style={{ padding: '14px 12px', fontWeight: 600, fontSize: 15, textAlign: 'left' }}>Information-Form</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlows.length > 0 ? (
                filteredFlows.slice(0, pageSize).map((flow) => (
                  <tr key={flow.id} style={{ borderBottom: '1px solid #f0f0f0', background: '#fafbfc' }}>
                    <td style={{ padding: '14px 12px', fontSize: 15 }}>{flow.id}</td>
                    <td style={{ padding: '14px 12px', display: 'flex', gap: 8 }}>
                      <button title="View" style={{ background: '#2ecc40', border: 'none', borderRadius: 4, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontSize: 20 }}>👁️</span>
                      </button>
                      <button title="Edit" style={{ background: '#e0e0e0', border: 'none', borderRadius: 4, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleEdit}>
                        <span style={{ color: '#444', fontSize: 18 }}>✏️</span>
                      </button>
                      <button title="Clone" style={{ background: '#e0e0e0', border: 'none', borderRadius: 4, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleClone}>
                        <span style={{ color: '#444', fontSize: 18 }}>📋</span>
                      </button>
                      <button title="Settings" style={{ background: '#2176ae', border: 'none', borderRadius: 4, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={handleSettings}>
                        <span style={{ color: 'white', fontSize: 18 }}>⚙️</span>
                      </button>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span
                        style={{ color: '#2176ae', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', fontSize: 16 }}
                        onClick={() => handleViewFlow(flow.id)}
                      >
                        {flow.name}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      {flow.status === 'Accepted' ? (
                        <span style={{ background: '#23c483', color: 'white', borderRadius: 20, padding: '6px 22px', fontWeight: 600, fontSize: 15, boxShadow: '0 2px 8px #23c48322' }}>Accepted</span>
                      ) : (
                        <span style={{ background: '#333', color: 'white', borderRadius: 20, padding: '6px 22px', fontWeight: 600, fontSize: 15 }}>Draft</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: 15 }}>{flow.version || ''}</td>
                    <td style={{ padding: '14px 12px', fontSize: 15 }}>
                      {flow.clone_remark ? flow.clone_remark : '--'}
                      {flow.clone_remark ? null : (
                        <span style={{ marginLeft: 8, color: '#444', fontSize: 18 }}>✏️</span>
                      )}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      {flow.secondary_forms ? (
                        <button style={{ background: '#2176ae', color: 'white', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>View Forms</button>
                      ) : null}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      {/* Add Information-Form button or content here if needed */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ padding: '20px', textAlign: 'center' }}>
                    No flows found. Create your first flow!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ApiFlowBuilderList;
