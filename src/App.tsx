import React, { useCallback, useMemo, useState } from 'react';
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
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { initialNodes, getNextNodeId } from './nodes';
import { initialEdges } from './edges';
import { NodeControls } from './components/NodeControls';
import { ButtonNode } from './nodes/ButtonNode';
import { SourceNode } from './nodes/SourceNode';
import type { AppNode, ButtonNode as ButtonNodeType, SourceNode as SourceNodeType, ButtonNodeData, SourceNodeData } from './nodes/types';
import { Modal } from './components/Modal';

// Define initial edges if not already defined
const defaultEdges: Edge[] = [];

const withControls = (
  WrappedComponent: React.ComponentType<any>,
  handleEdit: (node: AppNode) => void,
  handleDelete: (node: AppNode) => void
) => {
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

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AppNode | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const onConnect = useCallback((params: Connection) => {
    console.log('New connection:', params);
    setEdges((eds) => addEdge(
      {
        ...params,
        type: 'default',
        animated: true,
        style: { stroke: '#4CAF50' }
      }, 
      eds
    ));
  }, [setEdges]);

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
            onClick: () => alert(`Node ${nodeNumber} clicked!`)
          }
        } as ButtonNodeType
      ];
    });
  }, [setNodes]);

  const enhancedNodeTypes = useMemo(() => ({
    button: withControls(ButtonNode, handleEditNode, handleDeleteNode),
    source: withControls(SourceNode, handleEditNode, handleDeleteNode)
  }), [handleEditNode, handleDeleteNode]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNode(null);
    setHasChanges(false);
  }, []);

  const handleSaveChanges = useCallback((updates: { 
    label: string; 
    sourceUrl?: string; 
    dataKey?: string 
  }) => {
    if (selectedNode) {
      setNodes((nds) => 
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            const updatedData = {
              ...node.data,
              ...updates,
            };
            
            if (node.type === 'button') {
              (updatedData as ButtonNodeData).onClick = () => alert(`${updates.label} clicked!`);
            }

            return {
              ...node,
              data: updatedData
            } as AppNode;
          }
          return node;
        })
      );
      setIsModalOpen(false);
      setSelectedNode(null);
      setHasChanges(false);
    }
  }, [selectedNode, setNodes]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={enhancedNodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdit={handleEditNode}
        onDelete={handleDeleteNode}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: 'default',
          animated: true,
          style: { stroke: '#4CAF50' }
        }}
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
