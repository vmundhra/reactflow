import type { Node, NodeProps } from '@xyflow/react';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface BaseNodeData {
  label: string;
  isHorizontal?: boolean;
  [key: string]: any;
}

export interface ButtonNodeData extends BaseNodeData {
  onClick?: () => void;
}

export interface ApiNodeData extends BaseNodeData {
  id: string;
  label: string;
  url: string;
  method: HttpMethod;
  payload?: string;
  dataKey?: string;
  isHorizontal?: boolean;
  isLoading?: boolean;
  error?: string;
  response?: any;
  output?: any;
  lastRun?: Date;
  executeApiCall?: () => Promise<void>;
  onUpdate?: (data: ApiNodeData) => void;
  input?: any;
  [key: string]: any;
}

export interface ScriptNodeData extends BaseNodeData {
  code: string;
  isLoading?: boolean;
  input?: any;
  output?: any;
  error?: string;
  lastRun?: Date;
  onUpdate?: (data: ScriptNodeData) => void;
  executeScript?: () => Promise<void>;
}

export interface CmsNodeData extends BaseNodeData {
  id: string;
  contentType: string;  // e.g., 'article', 'project', 'task'
  endpoint: string;
  filters?: Record<string, any>;
  sort?: string;
  limit?: number;
  apiKey?: string;
  response?: any;
  error?: string;
  lastRun?: Date;
  executeQuery?: () => Promise<void>;
  onUpdate?: (data: CmsNodeData) => void;
}

export interface ProjectMgmtNodeData extends BaseNodeData {
  id: string;
  platform: 'jira' | 'asana' | 'trello';
  projectKey?: string;
  issueType?: string;
  jqlQuery?: string;
  apiToken?: string;
  response?: any;
  error?: string;
  lastRun?: Date;
  executeQuery?: () => Promise<void>;
  onUpdate?: (data: ProjectMgmtNodeData) => void;
}

export type ButtonNodeProps = NodeProps<ButtonNodeData>;
export type ApiNodeProps = NodeProps<ApiNodeData>;
export type ScriptNodeProps = NodeProps<ScriptNodeData>;

export type ButtonNodeType = Node<ButtonNodeData>;
export type ApiNodeType = Node<ApiNodeData>;
export type ScriptNodeType = Node<ScriptNodeData>;
export type AppNode = ButtonNodeType | ApiNodeType | ScriptNodeType;

export type NodeType = 'button' | 'api' | 'python' | 'javascript' | 'cms' | 'projectMgmt';
