import type { NodeTypes } from '@xyflow/react';

import { PositionLoggerNode } from './PositionLoggerNode';
import { ButtonNode } from './ButtonNode';
import type { ButtonNode as ButtonNodeType } from './types';
import { AppNode } from './types';
import { SourceNode } from './SourceNode';

export const initialNodes: AppNode[] = [
  {
    id: 'source1',
    type: 'source',
    position: { x: 100, y: 0 },
    data: { 
      label: 'Source Node',
      sourceUrl: 'https://www.testapi.com/exampledata',
      dataKey: 'results.data'
    }
  } as SourceNode,
  {
    id: 'header',
    type: 'button',
    position: { x: 100, y: 100 },
    data: { 
      label: 'React Flow Pipeline'
    }
  } as ButtonNodeType,
  {
    id: 'node1',
    type: 'button',
    position: { x: 175, y: 200 },
    data: { 
      label: 'Node 1',
      onClick: () => alert('Node 1 clicked!')
    }
  } as ButtonNodeType,
];

export const initialEdges = [
  {
    id: 'source1-node1',
    source: 'source1',
    target: 'node1',
    type: 'default',
    animated: true,
    style: { stroke: '#4CAF50' }
  }
];

export const getNextNodeId = (nodes: AppNode[]) => {
  const nodeIds = nodes
    .map(node => node.id)
    .filter(id => id.startsWith('node'))
    .map(id => parseInt(id.replace('node', ''), 10))
    .sort((a, b) => a - b);

  console.log('Current node IDs:', nodeIds); // Debug log

  // Find first gap in sequence
  let nextId = 1;
  for (const id of nodeIds) {
    if (id !== nextId) {
      console.log('Found gap, returning:', nextId); // Debug log
      return `node${nextId}`;
    }
    nextId++;
  }
  
  console.log('No gaps found, next ID:', nextId); // Debug log
  return `node${nextId}`;
};

export const nodeTypes: NodeTypes = {
  'position-logger': PositionLoggerNode,
  'button': ButtonNode,
  'source': SourceNode
};
