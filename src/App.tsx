import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type Node,
  type NodeProps,
  type Edge,
  type Connection,
  type NodeTypes,
  Position,
  useReactFlow,
  ReactFlowProvider,
  useUpdateNodeInternals,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { initialNodes, getNextNodeId } from './nodes';
import { initialEdges } from './edges';
import { NodeControls } from './components/NodeControls';
import { ButtonNode } from './nodes/ButtonNode';
import { ApiNode } from './nodes/ApiNode';
import type { 
  AppNode, 
  ButtonNodeType, 
  ApiNodeType, 
  ButtonNodeData, 
  ApiNodeData,
  HttpMethod
} from './nodes/types';
import { Modal } from './components/Modal';
import { RotationControl } from './components/RotationControl';
import { CustomEdge } from './components/CustomEdge';
import { storage } from './utils/storage';
import { PythonNode } from './nodes/PythonNode';
import { JavaScriptNode } from './nodes/JavaScriptNode';

// Define initial edges if not already defined
const defaultEdges: Edge[] = [];

const createNodeComponent = (
  Component: React.ComponentType<any>,
  isHorizontal: boolean
) => {
  return React.memo((props: any) => (
    <Component {...props} isHorizontal={isHorizontal} />
  ));
};

const createWithControls = (
  Component: React.ComponentType<any>,
  isHorizontal: boolean,
  handleEdit: (node: AppNode) => void,
  handleDelete: (node: AppNode) => void
) => {
  const WrappedComponent = createNodeComponent(Component, isHorizontal);
  
  return React.memo((props: any) => {
    const { selected } = props;
    return (
      <div style={{ position: 'relative' }}>
        <NodeControls
          node={props}
          onEdit={() => handleEdit(props)}
          onDelete={() => handleDelete(props)}
        />
        <WrappedComponent {...props} selected={selected} />
      </div>
    );
  });
};

function Flow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  // Load saved state on mount
  useEffect(() => {
    const savedState = storage.getAppState();
    if (savedState) {
      console.log('Loading saved state:', savedState);
      setNodes(savedState.nodes);
      setEdges(savedState.edges);
    } else {
      // Load initial state if no saved state exists
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [setNodes, setEdges]);

  // Save state on changes
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      storage.saveAppState(nodes, edges);
    }
  }, [nodes, edges]);

  const handleEditNode = useCallback((node: AppNode) => {
    setSelectedNode(node);
    setIsModalOpen(true);
    setHasChanges(false);
    console.log('Edit node:', node);
  }, []);

  const handleDeleteNode = useCallback((node: AppNode) => {
    console.log('Deleting node:', node.id);
    setNodes((nodes) => nodes.filter((n) => n.id !== node.id));
    setEdges((edges) => edges.filter(
      (e) => e.source !== node.id && e.target !== node.id
    ));
  }, [setNodes, setEdges]);

  const handleRotate = useCallback(() => {
    const newIsHorizontal = !isHorizontal;
    setIsHorizontal(newIsHorizontal);

    // First, update nodes with new handle positions
    setNodes(nodes => nodes.map(node => ({
      ...node,
      // Force React Flow to recalculate handles
      handleBounds: undefined,
      // Pass layout info to nodes
      data: {
        ...node.data,
        isHorizontal: newIsHorizontal,
        handlePositionsUpdated: Date.now()
      }
    })));

    // Update edges with new positions
    setEdges(edges => edges.map(edge => ({
      ...edge,
      // Force edge recreation with new positions
      id: `${edge.source}-${edge.target}-${Date.now()}`,
      type: 'smoothstep',
      sourcePosition: newIsHorizontal ? Position.Right : Position.Bottom,
      targetPosition: newIsHorizontal ? Position.Left : Position.Top,
      animated: true,
      style: {
        stroke: '#4CAF50',
        strokeWidth: 2,
        animation: 'flow 1s linear infinite',
        strokeDasharray: '5 5'
      }
    })));

    // Force React Flow to update node internals
    requestAnimationFrame(() => {
      nodes.forEach(node => {
        updateNodeInternals(node.id);
      });
    });
  }, [isHorizontal, setNodes, setEdges, nodes, updateNodeInternals]);

  // Define node types with proper memoization
  const nodeTypes = useMemo(() => ({
    button: createWithControls(ButtonNode, isHorizontal, handleEditNode, handleDeleteNode),
    api: createWithControls(ApiNode, isHorizontal, handleEditNode, handleDeleteNode),
    python: createWithControls(PythonNode, isHorizontal, handleEditNode, handleDeleteNode),
    javascript: createWithControls(JavaScriptNode, isHorizontal, handleEditNode, handleDeleteNode)
  }), [isHorizontal, handleEditNode, handleDeleteNode]);

  // Define edge types
  const edgeTypes = useMemo(() => ({
    custom: CustomEdge,
  }), []);

  // Update default edge options
  const defaultEdgeOptions = useMemo(() => ({
    type: 'custom',
    animated: true,
    style: { 
      stroke: '#4CAF50',
      strokeWidth: 2,
      animation: 'flow 1s linear infinite',
      strokeDasharray: '5 5'
    }
  }), []);

  const onConnect = useCallback((params: Connection) => {
    console.log('New connection:', params);

    // First, find the source node to get its output
    const sourceNode = nodes.find(n => n.id === params.source);
    if (!sourceNode) return;

    // Get the target node
    const targetNode = nodes.find(n => n.id === params.target);
    if (!targetNode) return;

    console.log('Source node data:', sourceNode.data);

    // Get the source node's output or response
    const sourceOutput = sourceNode.data.output || sourceNode.data.response;
    console.log('Source output:', sourceOutput);
    
    // Update target node's input
    setNodes(nds => nds.map(node => {
      if (node.id === params.target) {
        console.log('Updating target node input:', sourceOutput);
        
        // If node already has input, convert to array or add to existing array
        let newInput;
        if (node.data.input) {
          newInput = Array.isArray(node.data.input) 
            ? [...node.data.input, sourceOutput]
            : [node.data.input, sourceOutput];
        } else {
          newInput = sourceOutput;
        }

        const updatedNode = {
          ...node,
          data: {
            ...node.data,
            input: newInput
          }
        };
        console.log('Updated node:', updatedNode);
        return updatedNode;
      }
      return node;
    }));

    // Add the edge
    setEdges((eds) => addEdge(
      {
        ...params,
        type: 'default',
        animated: true,
        style: { 
          stroke: '#4CAF50',
          strokeWidth: 2,
          animation: 'flow 1s linear infinite',
          strokeDasharray: '5 5'
        }
      }, 
      eds
    ));
  }, [nodes, setNodes, setEdges]);

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: any) => {
      if (!connectionState.isValid) {
        const nextId = getNextNodeId(nodes);
        const { clientX, clientY } = 'changedTouches' in event 
          ? event.changedTouches[0] 
          : event;

        const position = screenToFlowPosition({
          x: clientX,
          y: clientY,
        });

        const newNode = {
          id: nextId,
          type: 'button',
          position,
          selected: false,
          data: {
            label: `Node ${nextId.replace('node', '')}`,
            onClick: () => alert(`Node ${nextId} clicked!`),
            isHorizontal
          }
        } as ButtonNodeType;

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat({
          id: `${connectionState.fromNode.id}-${nextId}`,
          source: connectionState.fromNode.id,
          target: nextId,
          type: 'default',
          animated: true,
          style: {
            stroke: '#4CAF50',
            strokeWidth: 2,
            animation: 'flow 1s linear infinite',
            strokeDasharray: '5 5'
          }
        }));
      }
    },
    [screenToFlowPosition, nodes, isHorizontal]
  );

  const handleAddNode = useCallback(() => {
    setNodes((nodes) => {
      const nextId = getNextNodeId(nodes);
      const nodeNumber = parseInt(nextId.replace('node', ''), 10);
      console.log('Adding node with ID:', nextId, 'Number:', nodeNumber);
      
      return [
        ...nodes,
        {
          id: nextId,
          type: 'button',
          position: { 
            x: Math.random() * 500, 
            y: Math.random() * 500 
          },
          selected: false,
          data: {
            label: `Node ${nodeNumber}`,
            onClick: () => alert(`Node ${nodeNumber} clicked!`),
            isHorizontal
          }
        } as ButtonNodeType
      ];
    });
  }, [setNodes, isHorizontal]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNode(null);
    setHasChanges(false);
  }, []);

  const handleNodeDataUpdate = useCallback((nodeId: string, newData: any) => {
    console.log('Updating node data:', { nodeId, newData });
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          // Preserve the executeApiCall function if it exists
          const existingExecuteApiCall = node.data.executeApiCall;
          const updatedNode = {
            ...node,
            data: {
              ...node.data,
              ...newData,
              // Keep the existing executeApiCall if it exists and wasn't provided in newData
              executeApiCall: newData.executeApiCall || existingExecuteApiCall,
              onUpdate: (data: any) => handleNodeDataUpdate(node.id, data)
            }
          };
          console.log('Updated node:', updatedNode);
          return updatedNode;
        }
        return node;
      })
    );
  }, [setNodes]);

  const handleSaveChanges = useCallback((updates: { 
    label: string; 
    url?: string;
    method?: HttpMethod;
    payload?: string;
    dataKey?: string;
    type?: string;
    code?: string;
  }) => {
    if (selectedNode) {
      console.log('Saving node changes:', updates);
      setNodes((nds) => 
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            const baseData = {
              label: updates.label,
              isHorizontal,
              // Preserve existing data
              input: node.data.input,
              output: node.data.output,
              response: node.data.response,
              lastRun: node.data.lastRun,
              executeApiCall: node.data.executeApiCall,
              onUpdate: (data: any) => handleNodeDataUpdate(node.id, data)
            };

            let updatedNode: AppNode;
            if (updates.type === 'api') {
              updatedNode = {
                ...node,
                type: 'api',
                data: {
                  ...baseData,
                  method: updates.method || 'GET',
                  url: updates.url || '',
                  payload: updates.payload,
                  dataKey: updates.dataKey
                }
              } as ApiNodeType;
            } else if (updates.type === 'python' || updates.type === 'javascript') {
              updatedNode = {
                ...node,
                type: updates.type,
                data: {
                  ...baseData,
                  code: updates.code || ''
                }
              } as ScriptNodeType;
            } else {
              updatedNode = {
                ...node,
                type: 'button',
                data: {
                  ...baseData,
                  onClick: () => alert(`${updates.label} clicked!`)
                }
              } as ButtonNodeType;
            }

            console.log('Updated node:', updatedNode);
            return updatedNode;
          }
          return node;
        })
      );
      setIsModalOpen(false);
      setSelectedNode(null);
      setHasChanges(false);
    }
  }, [selectedNode, setNodes, isHorizontal, handleNodeDataUpdate]);

  // Handle edge deletion
  const onEdgeClick = useCallback((evt: React.MouseEvent, edge: Edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  }, [setEdges]);

  const handleResetStorage = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all nodes and clear storage? This action cannot be undone.')) {
      // Clear all storage
      localStorage.clear();
      // Reset React Flow state
      setNodes([]);
      setEdges([]);
      // Force reload after state is cleared
      window.location.reload();
    }
  }, [setNodes, setEdges]);

  return (
    <div style={{ width: '100vw', height: '100vh' }} ref={reactFlowWrapper}>
      <RotationControl
        isHorizontal={isHorizontal}
        onRotate={handleRotate}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onEdgeClick={onEdgeClick}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <Background />
        <MiniMap />
        <Controls />
        <div style={{ 
          position: 'absolute', 
          right: 10, 
          top: 10, 
          zIndex: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <button 
            onClick={handleAddNode}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Add Node
          </button>
          <button 
            onClick={handleResetStorage}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Reset Storage
          </button>
        </div>
      </ReactFlow>
      <Modal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveChanges}
        node={selectedNode}
        hasChanges={hasChanges}
      />
    </div>
  );
}

// Wrap the Flow component with ReactFlowProvider
export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
