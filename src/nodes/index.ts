import type { NodeTypes } from '@xyflow/react';
import { ButtonNode } from './ButtonNode';
import { ApiNode } from './ApiNode';
import type { AppNode, ButtonNodeType } from './types';
import { PythonNode } from './PythonNode';
import { JavaScriptNode } from './JavaScriptNode';
import { CmsNode } from './CmsNode';
import { ProjectMgmtNode } from './ProjectMgmtNode';

export const getNextNodeId = (nodes: AppNode[]): string => {
  const nodeNumbers = nodes
    .map(node => {
      const match = node.id.match(/^node(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(num => !isNaN(num));

  const maxNumber = nodeNumbers.length > 0 ? Math.max(...nodeNumbers) : 0;
  return `node${maxNumber + 1}`;
};

export const nodeTypes: NodeTypes = {
  button: ButtonNode,
  api: ApiNode,
  python: PythonNode,
  javascript: JavaScriptNode,
  cms: CmsNode,
  projectMgmt: ProjectMgmtNode
};
