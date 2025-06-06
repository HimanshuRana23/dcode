import { useCallback, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  Background,
  getBezierPath,
  Controls,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar, { nodeTypes as nodeConfigs, nodeGroups } from './Sidebar';
import CustomNode from './CustomNode';
import InputNodeConfig from './m4/InputNodeConfig';
import DefaultNodeConfig from './source/DefaultNodeConfig';
import OutputNodeConfig from './m4/OutputNodeConfig';
import URLNodeConfig from './source/URLNodeConfig';
import StaticValueNodeConfig from './source/StaticValueNodeConfig';
import QuestionIdNodeConfig from './source/QuestionIdNodeConfig';
import UsersNodeConfig from './m4/UsersNodeConfig';
import ApproversNodeConfig from './m4/ApproversNodeConfig';
import MonitorUsersNodeConfig from './m4/MonitorUsersNodeConfig';
import MachineNodeConfig from './m4/MachineNodeConfig';
import MaterialNodeConfig from './m4/MaterialNodeConfig';
import MethodNodeConfig from './m4/MethodNodeConfig';
import NotificationNodeConfig from './automation/NotificationNodeConfig';
import DelayNotificationNodeConfig from './automation/DelayNotificationNodeConfig';
import BulkUploadNodeConfig from './automation/BulkUploadNodeConfig';
import SAPNodeConfig from './automation/SAPNodeConfig';
import BotNodeConfig from './automation/BotNodeConfig';
import IOTAlarmsNodeConfig from './automation/IOTAlarmsNodeConfig';
import FlowCanvas from './FlowCanvas';

const nodeTypes = {
  custom: CustomNode,
};

function ApiFlowBuilder() {
  const params = useParams();
  console.log('[Flow] All params:', params);
  const { flowId } = params;
  console.log('[Flow] Extracted flowId:', flowId);
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowName, setFlowName] = useState('');
  const [loading, setLoading] = useState(flowId !== 'new');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (flowId === 'new') {
      setNodes([]);
      setEdges([]);
      setLoading(false);
    } else {
      fetchFlow();
    }
  }, [flowId]);

  useEffect(() => {
    const handleNodeDelete = (event) => {
      const { nodeId } = event.detail;
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    };

    document.addEventListener('nodeDelete', handleNodeDelete);
    return () => {
      document.removeEventListener('nodeDelete', handleNodeDelete);
    };
  }, [setNodes]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.right-sidebar');
      const reactFlow = document.querySelector('.react-flow');
      
      if (sidebar && !sidebar.contains(event.target) && 
          reactFlow && !reactFlow.contains(event.target)) {
        setSelectedNode(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchFlow = async () => {
    try {
      console.log('[fetchFlow] Fetching flow for id:', flowId);
      const response = await fetch(`http://localhost/apiflowserver.php?id=${flowId}`);
      const data = await response.json();
      console.log('[fetchFlow] Response data:', data);
      if (data.flow) {
        // Process nodes to update labels from config and add icon
        const nodesWithConfig = data.flow.nodes.map((node, idx) => {
          // Get node type and config
          const nodeType = node.data?.nodeType;
          const nodeConfig = nodeTypes[nodeType];
          
          // Ensure id and type are set
          const safeId = node.id || `node-${idx + 1}`;
          const safeType = node.type || 'custom';

          // Get icon from node config or existing data
          const icon = nodeConfig?.icon || node.data?.icon || '';

          if (node.data?.config) {
            try {
              const configData = JSON.parse(node.data.config);
              return {
                ...node,
                id: safeId,
                type: safeType,
                data: {
                  ...node.data,
                  label: configData.name || node.data.label,
                  icon,
                }
              };
            } catch (e) {
              console.error('Error parsing node config:', e);
            }
          }
          return {
            ...node,
            id: safeId,
            type: safeType,
            data: {
              ...node.data,
              icon,
            }
          };
        });
        // Debug log for loaded nodes
        console.log('[fetchFlow] Loaded nodes:', nodesWithConfig);
        setNodes(nodesWithConfig);
        setEdges(data.flow.edges);
        setFlowName(data.name);
      } else {
        console.warn('[fetchFlow] No flow data found in response:', data);
      }
      setLoading(false);
    } catch (error) {
      console.error('[fetchFlow] Error fetching flow:', error);
      setLoading(false);
    }
  };

  const onConnect = useCallback(
    (connection) => {
      // Check if the target node is a start node
      const targetNode = nodes.find(node => node.id === connection.target);
      if (targetNode?.data?.nodeType === 'start') {
        return; // Don't allow connections to start node
      }
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges, nodes],
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onNodeDoubleClick = useCallback((event, node) => {
    setSelectedNode(node);
    setShowConfig(true);
  }, []);

  const handleNodeConfigSave = useCallback((nodeId, config) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          try {
            const configData = JSON.parse(config);
            return {
              ...node,
              data: {
                ...node.data,
                config,
                label: configData.name || node.data.label
              },
            };
          } catch (e) {
            console.error('Error parsing node config:', e);
            return {
              ...node,
              data: {
                ...node.data,
                config,
              },
            };
          }
        }
        return node;
      })
    );
  }, [setNodes]);

  const onSave = useCallback(async () => {
    if (!flowName.trim()) {
      alert('Please enter a name for your flow');
      return;
    }

    const flowData = {
      name: flowName,
      flow: {
        nodes: nodes.map(node => {
          const nodeType = node.data.nodeType;
          const nodeConfig = nodeTypes[nodeType];
          return {
            ...node,
            data: {
              ...node.data,
              config: node.data.config || '',
              group: node.data.group || '',
              groupId: node.data.groupId || '',
              icon: nodeConfig?.icon || node.data.icon || ''
            }
          };
        }),
        edges,
      },
    };

    // Always include the flowId if it exists and is not 'new'
    if (flowId && flowId !== 'new') {
      flowData.id = flowId;
    }

    try {
      console.log('[onSave] Saving flow with data:', flowData); // Add debug log
      const response = await fetch('http://localhost/apiflowserver.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flowData),
      });

      const data = await response.json();
      console.log('[onSave] Server response:', data); // Add debug log
      if (data.success) {
        // Show success message
        alert('Flow saved successfully!');
        // If this was a new flow, update the URL with the new ID
        if (flowId === 'new' && data.id) {
          navigate(`/api-flow-builder/${data.id}`, { replace: true });
        }
      } else {
        alert('Error saving flow: ' + data.error);
      }
    } catch (error) {
      console.error('[onSave] Error:', error); // Add debug log
      alert('Error saving flow: ' + error.message);
    }
  }, [nodes, edges, flowName, navigate, flowId, nodeTypes]);

  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
  }, []);

  const onEdgeDelete = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    setSelectedEdge(null);
  }, [setEdges]);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdge(null);
  }, []);

  const CustomEdge = useCallback(({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }) => {
    const [edgePath] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    return (
      <>
        {/* Wider invisible path for easier selection */}
        <path
          id={id}
          style={{
            ...style,
            strokeWidth: 20,
            stroke: 'transparent',
            cursor: 'pointer',
          }}
          className="react-flow__edge-path"
          d={edgePath}
        />
        {/* Visible path */}
        <path
          style={{
            ...style,
            strokeWidth: 2,
          }}
          className="react-flow__edge-path"
          d={edgePath}
          markerEnd={markerEnd}
        />
        {selectedEdge?.id === id && (
          <foreignObject
            width={20}
            height={20}
            x={(sourceX + targetX) / 2 - 10}
            y={(sourceY + targetY) / 2 - 10}
            className="edge-button-foreignobject"
            requiredExtensions="http://www.w3.org/1999/xhtml"
          >
            <div
              style={{
                background: 'white',
                border: '1px solid #eee',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#ff0000',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              onClick={(e) => {
                e.stopPropagation();
                onEdgeDelete(id);
              }}
            >
              ×
            </div>
          </foreignObject>
        )}
      </>
    );
  }, [selectedEdge, onEdgeDelete]);

  const renderNodeConfig = () => {
    if (!selectedNode) return null;

    const props = {
      node: selectedNode,
      onSave: handleNodeConfigSave,
      onClose: () => {
        setSelectedNode(null);
        setShowConfig(false);
      },
    };

    switch (selectedNode.data.nodeType) {
      case 'input':
        return <InputNodeConfig {...props} />;
      case 'default':
        return <DefaultNodeConfig {...props} />;
      case 'output':
        return <OutputNodeConfig {...props} />;
      case 'url':
        return <URLNodeConfig {...props} />;
      case 'staticValue':
        return <StaticValueNodeConfig {...props} />;
      case 'questionId':
        return <QuestionIdNodeConfig {...props} />;
      case 'users':
        return <UsersNodeConfig {...props} />;
      case 'approvers':
        return <ApproversNodeConfig {...props} />;
      case 'monitorUsers':
        return <MonitorUsersNodeConfig {...props} />;
      case 'machine':
        return <MachineNodeConfig {...props} />;
      case 'material':
        return <MaterialNodeConfig {...props} />;
      case 'method':
        return <MethodNodeConfig {...props} />;
      case 'notification':
        return <NotificationNodeConfig {...props} />;
      case 'delayNotification':
        return <DelayNotificationNodeConfig {...props} />;
      case 'bulkUpload':
        return <BulkUploadNodeConfig {...props} />;
      case 'sap':
        return <SAPNodeConfig {...props} />;
      case 'bot':
        return <BotNodeConfig {...props} />;
      case 'iotAlarms':
        return <IOTAlarmsNodeConfig {...props} />;
      default:
        return <DefaultNodeConfig {...props} />;
    }
  };

  const handleBack = () => {
    navigate('/api-flow-builder');
  };

  const handleDownload = useCallback(() => {
    const flowData = {
      name: flowName,
      flow: {
        nodes: nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            config: node.data.config || ''
          }
        })),
        edges,
      },
    };

    if (flowId && flowId !== 'new') {
      flowData.id = flowId;
    }

    const blob = new Blob([JSON.stringify(flowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flowName || 'flow'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [nodes, edges, flowName, flowId]);

  const handleUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const flowData = JSON.parse(e.target.result);
          if (flowData.name) setFlowName(flowData.name);
          if (flowData.flow) {
            if (flowData.flow.nodes) setNodes(flowData.flow.nodes);
            if (flowData.flow.edges) setEdges(flowData.flow.edges);
          }
        } catch (error) {
          alert('Error parsing JSON file: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  }, [setNodes, setEdges]);

  const handleShowJson = useCallback(async () => {
    const flowData = {
      name: flowName,
      flow: {
        nodes: nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            config: node.data.config || '',
            group: node.data.group || '',
            groupId: node.data.groupId || '',
            icon: node.data.icon || ''
          }
        })),
        edges,
      },
    };

    try {
      const response = await fetch('http://localhost/validation/flowvalidation.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flowData),
      });

      const data = await response.json();
      setValidationResult(data);
      setShowValidation(true);
      setShowConfig(false);
    } catch (error) {
      console.error('Error validating flow:', error);
      setValidationResult({ error: 'Error validating flow: ' + error.message });
      setShowValidation(true);
      setShowConfig(false);
    }
  }, [nodes, edges, flowName]);

  const handleShowNestedJson = useCallback(async () => {
    const flowData = {
      name: flowName,
      flow: {
        nodes: nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            config: node.data.config || '',
            group: node.data.group || '',
            groupId: node.data.groupId || '',
            icon: node.data.icon || ''
          }
        })),
        edges,
      },
    };

    try {
      const response = await fetch('http://localhost/validation/flowvalidationandor.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flowData),
      });

      const data = await response.json();
      setValidationResult(data);
      setShowValidation(true);
      setShowConfig(false);
    } catch (error) {
      console.error('Error validating flow:', error);
      setValidationResult({ error: 'Error validating flow: ' + error.message });
      setShowValidation(true);
      setShowConfig(false);
    }
  }, [nodes, edges, flowName]);

  const renderValidationResult = () => {
    if (!validationResult) return null;

    const handleCopy = () => {
      const jsonString = JSON.stringify(validationResult, null, 2);
      navigator.clipboard.writeText(jsonString).then(() => {
        alert('JSON copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
      });
    };

    return (
      <div style={{ padding: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px' 
        }}>
          <h3 style={{ margin: 0, color: '#333' }}>Flow Validation Result</h3>
          <button
            onClick={handleCopy}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2d7ff9',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <span>📋</span> Copy JSON
          </button>
        </div>
        <pre style={{
          background: '#f5f5f5',
          padding: '16px',
          borderRadius: '4px',
          overflow: 'auto',
          maxHeight: 'calc(100vh - 200px)',
          fontSize: '14px',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {JSON.stringify(validationResult, null, 2)}
        </pre>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading flow...
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#f6f7fb' }}>
        <Sidebar />
        <div style={{ flex: 1, position: 'relative', minHeight: '100vh', background: '#f6f7fb' }}>
          <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1000, display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: '#f6f7fb', padding: '10px', borderRadius: '8px' }}>
            <button
              onClick={handleBack}
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
              ← Back to List
            </button>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                placeholder="Enter Flow Name"
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  minWidth: '200px'
                }}
              />
              {flowId === 'new' && (
                <div style={{ position: 'relative' }}>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleUpload}
                    style={{ display: 'none' }}
                    id="json-upload"
                  />
                  <label
                    htmlFor="json-upload"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>📁</span> Upload JSON
                  </label>
                </div>
              )}
              <button
                onClick={onSave}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#2d7ff9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                Save Flow
              </button>
              <button
                onClick={handleShowJson}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>🔍</span> Show JSON
              </button>
              <button
                onClick={handleShowNestedJson}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>🔗</span> Show Nested JSON
              </button>
              {flowId !== 'new' && (
                <button
                  onClick={handleDownload}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>⬇️</span> Download JSON
                </button>
              )}
            </div>
          </div>
          <FlowCanvas
            nodes={nodes}
            setNodes={setNodes}
            onNodesChange={onNodesChange}
            edges={edges}
            setEdges={setEdges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            nodeConfigs={nodeConfigs}
            nodeGroups={nodeGroups}
            showConfig={showConfig}
            selectedNode={selectedNode}
            renderNodeConfig={renderNodeConfig}
            flowName={flowName}
            setFlowName={setFlowName}
            flowId={flowId}
          />
          {showValidation && (
            <div style={{
              position: 'absolute',
              top: '120px',
              right: 0,
              height: 'calc(100vh - 140px)',
              width: '50%',
              zIndex: 5,
              overflow: 'hidden',
              background: 'white',
              boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
              borderRadius: '8px 0 0 0',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: '1px solid #eee',
                background: '#f8f9fa',
                flexShrink: 0
              }}>
                <h3 style={{ margin: 0, color: '#333', fontSize: '16px' }}>Validation Result</h3>
                <button
                  onClick={() => setShowValidation(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#666',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s',
                    ':hover': {
                      backgroundColor: '#eee'
                    }
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ 
                flex: 1,
                overflow: 'auto',
                padding: '16px'
              }}>
                {renderValidationResult()}
              </div>
            </div>
          )}
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default ApiFlowBuilder;