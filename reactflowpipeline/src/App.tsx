import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  Node,
  NodeProps,
  Edge,
  Connection,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { initialNodes, nodeTypes, getNextNodeId } from './nodes';
import { initialEdges, edgeTypes } from './edges';
import { NodeControls } from './components/NodeControls';
import { ButtonNodeData } from './nodes/ButtonNode';
import type { ButtonNode } from './nodes/types';

// Define initial edges if not already defined
const defaultEdges: Edge[] = [];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultEdges);

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

  const handleEditNode = useCallback((node: Node) => {
    // TODO: Implement edit modal/form
    console.log('Edit node:', node);
  }, []);

  const handleDeleteNode = useCallback((node: Node) => {
    console.log('Deleting node:', node.id);
    setNodes((nodes) => nodes.filter((n) => n.id !== node.id));
    // Also remove connected edges
    setEdges((edges) => edges.filter(
      (e) => e.source !== node.id && e.target !== node.id
    ));
  }, [setNodes, setEdges]);

  const handleAddNode = useCallback(() => {
    setNodes((nodes) => {
      const nextId = getNextNodeId(nodes);
      const nodeNumber = parseInt(nextId.replace('node', ''), 10);
      console.log('Adding node with ID:', nextId, 'Number:', nodeNumber); // Debug log
      
      return [
        ...nodes,
        {
          id: nextId,
          type: 'button' as const,
          position: { 
            x: Math.random() * 500, 
            y: Math.random() * 500 
          },
          data: {
            label: `Node ${nodeNumber}`,
            onClick: () => alert(`Node ${nodeNumber} clicked!`)
          }
        } as ButtonNode
      ];
    });
  }, [setNodes]);

  // Custom node wrapper component
  const NodeWrapper = ({ children, data }: { children: React.ReactNode, data: Node }) => (
    <div style={{ position: 'relative' }}>
      <NodeControls
        node={data}
        onEdit={handleEditNode}
        onDelete={handleDeleteNode}
      />
      {children}
    </div>
  );

  const enhancedNodeTypes = useMemo(() => ({
    ...nodeTypes,
    button: (props: NodeProps<ButtonNodeData>) => (
      <NodeWrapper data={props as unknown as Node}>
        {nodeTypes.button(props)}
      </NodeWrapper>
    ),
  }), [handleEditNode, handleDeleteNode]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={enhancedNodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
    </div>
  );
}
