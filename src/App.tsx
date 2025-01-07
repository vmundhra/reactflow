import React, { useCallback, useMemo, useState, useRef } from 'react';
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
import { SourceNode } from './nodes/SourceNode';
import type { 
  AppNode, 
  ButtonNodeType, 
  SourceNodeType, 
  ButtonNodeData, 
  SourceNodeData 
} from './nodes/types';
import { Modal } from './components/Modal';
import { RotationControl } from './components/RotationControl';

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
  
  return React.memo((props: any) => (
    <div style={{ position: 'relative' }}>
      <NodeControls
        node={props}
        onEdit={() => handleEdit(props)}
        onDelete={() => handleDelete(props)}
      />
      <WrappedComponent {...props} />
    </div>
  ));
};

function Flow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

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
    source: createWithControls(SourceNode, isHorizontal, handleEditNode, handleDeleteNode)
  }), [isHorizontal, handleEditNode, handleDeleteNode]);

  // Update default edge options
  const defaultEdgeOptions = useMemo(() => ({
    type: 'smoothstep',
    animated: true,
    sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
    targetPosition: isHorizontal ? Position.Left : Position.Top,
    style: { 
      stroke: '#4CAF50',
      strokeWidth: 2,
      animation: 'flow 1s linear infinite',
      strokeDasharray: '5 5'
    }
  }), [isHorizontal]);

  const onConnect = useCallback((params: Connection) => {
    console.log('New connection:', params);
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
  }, [setEdges]);

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

  const handleSaveChanges = useCallback((updates: { 
    label: string; 
    sourceUrl?: string; 
    dataKey?: string;
    type?: string;
  }) => {
    if (selectedNode) {
      setNodes((nds) => 
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            // Create base node data
            const baseData = {
              label: updates.label,
              isHorizontal
            };

            // Create node based on type
            let updatedNode: AppNode;
            if (updates.type === 'source') {
              updatedNode = {
                ...node,
                type: 'source',
                data: {
                  ...baseData,
                  sourceUrl: updates.sourceUrl || '',
                  dataKey: updates.dataKey
                }
              } as SourceNodeType;
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

            return updatedNode;
          }
          return node;
        })
      );
      setIsModalOpen(false);
      setSelectedNode(null);
      setHasChanges(false);
    }
  }, [selectedNode, setNodes, isHorizontal]);

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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={defaultEdgeOptions}
      >
        <Background />
        <MiniMap />
        <Controls />
        <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}>
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
