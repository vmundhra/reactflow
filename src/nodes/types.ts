import { Node, NodeProps } from '@xyflow/react';

export interface ButtonNodeData {
  label: string;
  onClick?: () => void;
  handlePositionsUpdated?: number;
  [key: string]: any;
}

export interface SourceNodeData {
  label: string;
  sourceUrl: string;
  dataKey?: string;
  handlePositionsUpdated?: number;
  [key: string]: any;
}

export interface ButtonNodeProps extends NodeProps {
  data: ButtonNodeData;
  isHorizontal?: boolean;
}

export interface SourceNodeProps extends NodeProps {
  data: SourceNodeData;
  isHorizontal?: boolean;
}

export type ButtonNodeType = Node<ButtonNodeData>;
export type SourceNodeType = Node<SourceNodeData>;

export type AppNode = ButtonNodeType | SourceNodeType;
