import type { NodeTypes } from '@xyflow/react';
import { ButtonNode } from './ButtonNode';
import { ApiNode } from './ApiNode';
import type { AppNode, ButtonNodeType } from './types';
import { PythonNode } from './PythonNode';
import { JavaScriptNode } from './JavaScriptNode';
import { CmsNode } from './CmsNode';
import { ProjectMgmtNode } from './ProjectMgmtNode';

export const initialNodes: AppNode[] = [
  {
    id: 'cms1',
    type: 'cms',
    position: { x: 100, y: 100 },
    data: {
      label: 'Fetch Project Materials',
      contentType: 'materials',
      endpoint: 'http://your-strapi.com/api/materials',
      filters: {
        status: 'published'
      },
      isHorizontal: false
    }
  },
  {
    id: 'project1',
    type: 'projectMgmt',
    position: { x: 100, y: 250 },
    data: {
      label: 'Get Project Tasks',
      platform: 'jira',
      projectKey: 'PROJ',
      jqlQuery: 'project = PROJ AND type = Task',
      isHorizontal: false
    }
  },
  {
    id: 'python1',
    type: 'python',
    position: { x: 400, y: 175 },
    data: {
      label: 'Process & Merge Data',
      code: `# Merge CMS materials with project tasks
materials = input['cms1']['response']
tasks = input['project1']['response']

# Map materials to tasks
output = {
    'materials': materials,
    'tasks': tasks,
    'mapped': [
        {
            'material': m,
            'related_tasks': [t for t in tasks if t['fields']['summary'].lower().contains(m['title'].lower())]
        }
        for m in materials
    ]
}`,
      isHorizontal: false
    }
  },
  {
    id: 'api1',
    type: 'api',
    position: { x: 700, y: 175 },
    data: {
      label: 'Update Project System',
      method: 'POST',
      url: 'https://your-project-system/api/update',
      isHorizontal: false
    }
  }
];

export const initialEdges = [
  {
    id: 'cms1-python1',
    source: 'cms1',
    target: 'python1',
    animated: true
  },
  {
    id: 'project1-python1',
    source: 'project1',
    target: 'python1',
    animated: true
  },
  {
    id: 'python1-api1',
    source: 'python1',
    target: 'api1',
    animated: true
  }
];

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
