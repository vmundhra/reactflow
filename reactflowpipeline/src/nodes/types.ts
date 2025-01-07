import type { Node, BuiltInNode } from '@xyflow/react';
import type { ButtonNodeData } from './ButtonNode';

export type PositionLoggerNode = Node<{ label: string }, 'position-logger'>;
export type ButtonNode = Node<ButtonNodeData, 'button'>;
export type AppNode = BuiltInNode | PositionLoggerNode | ButtonNode;
