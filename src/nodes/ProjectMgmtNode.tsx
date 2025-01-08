import React, { useCallback, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import ReactMarkdown from 'react-markdown';
import type { ProjectMgmtNodeData } from './types';
import { storage } from '../utils/storage';

export const ProjectMgmtNode = React.memo(({ data, isConnectable = true, selected }: ProjectMgmtProps) => {
  const [showOutput, setShowOutput] = useState(false);
  const handleStyle = { background: '#4CAF50' };
  const isHorizontal = data.isHorizontal;

  const platformColors = {
    jira: '#0052CC',
    asana: '#F06A6A',
    trello: '#0079BF'
  };

  const executeQuery = useCallback(async () => {
    try {
      // Example for Jira
      const baseUrl = 'https://your-domain.atlassian.net/rest/api/3';
      const endpoint = data.jqlQuery 
        ? `/search?jql=${encodeURIComponent(data.jqlQuery)}`
        : `/project/${data.projectKey}/issues`;

      const response = await fetch(`${baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Basic ${btoa(data.apiToken || '')}`,
          'Accept': 'application/json'
        }
      });
      
      const result = await response.json();
      
      data.onUpdate?.({
        ...data,
        response: result,
        lastRun: new Date(),
        error: undefined
      });

    } catch (error: any) {
      data.onUpdate?.({
        ...data,
        error: error.message,
        response: undefined,
        lastRun: new Date()
      });
    }
  }, [data]);

  return (
    <div style={{
      padding: '10px',
      borderRadius: '3px',
      border: `1px solid ${platformColors[data.platform]}`,
      background: 'white',
      minWidth: '250px',
      position: 'relative'
    }}>
      <div style={{ marginBottom: '8px' }}>
        <span>📋 {data.platform.toUpperCase()}</span>
        {data.projectKey && (
          <span style={{ marginLeft: '8px', fontSize: '12px' }}>
            {data.projectKey}
          </span>
        )}
      </div>
      
      {/* Rest of the UI similar to ApiNode */}
    </div>
  );
}); 