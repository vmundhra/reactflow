import type { Node } from '@xyflow/react';

export interface ButtonNodeData extends Record<string, unknown> {
  label: string;
  onClick?: () => void;
}

export interface SourceNodeData extends Record<string, unknown> {
  label: string;
  sourceUrl: string;
  dataKey?: string;
}

export type ButtonNode = Node<ButtonNodeData, 'button'>;
export type SourceNode = Node<SourceNodeData, 'source'>;
export type AppNode = ButtonNode | SourceNode;
