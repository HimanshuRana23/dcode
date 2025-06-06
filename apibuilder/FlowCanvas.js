import React, { useCallback, useState, useRef } from 'react';
import { ReactFlow, Controls, Background, getBezierPath } from '@xyflow/react';
import CustomNode from './CustomNode';

function FlowCanvas({
  nodes,
  setNodes,
  onNodesChange,
  edges,
  setEdges,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onNodeDoubleClick,
  onEdgeClick,
  onPaneClick,
  nodeTypes,
  nodeConfigs,
  nodeGroups,
  showConfig,
  selectedNode,
  renderNodeConfig,
  onSave,
  flowName,
  setFlowName,
  flowId,
}) {
  const [rfInstance, setRfInstance] = useState(null);
  const reactFlowWrapper = useRef(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  const onInit = useCallback((instance) => {
    console.log('ReactFlow onInit instance:', instance);
    setRfInstance(instance);
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onEdgeDelete = useCallback((edgeId) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    setSelectedEdge(null);
  }, [setEdges]);

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

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;
      if (!rfInstance) {
        console.warn('rfInstance is not available yet');
        return;
      }
      if (typeof rfInstance.screenToFlowPosition !== 'function') {
        console.warn('rfInstance.screenToFlowPosition is not a function', rfInstance);
        return;
      }
      const position = rfInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const nodeConfig = nodeConfigs[type];
      if (!nodeConfig) {
        console.log('Node config not found for type:', type);
        return;
      }
      const icon = nodeConfig.icon || '';
      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type: 'custom',
        position,
        data: {
          label: nodeConfig.label,
          config: '',
          nodeType: type,
          icon,
        },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes, nodeConfigs, rfInstance]
  );

  const handleEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
    onEdgeClick(event, edge);
  }, [onEdgeClick]);

  return (
    <div style={{ flex: 1, position: 'relative', minHeight: '100vh', background: '#f6f7fb' }} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={{ custom: CustomEdge }}
        defaultEdgeOptions={{ type: 'custom' }}
        style={{ minHeight: '100vh', background: '#fff' }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        onInit={onInit}
      >
        <Controls />
        <Background />
      </ReactFlow>

      {nodes.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#bbb',
          fontSize: 24,
          pointerEvents: 'none',
          zIndex: 10
        }}>
          Drag nodes here to start building your flow!
        </div>
      )}
      {showConfig && selectedNode && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '50%',
          zIndex: 5,
          overflow: 'hidden'
        }}>
          {renderNodeConfig()}
        </div>
      )}
    </div>
  );
}

export default FlowCanvas; 