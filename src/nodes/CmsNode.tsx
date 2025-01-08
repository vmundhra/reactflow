import React, { useCallback, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import ReactMarkdown from 'react-markdown';
import type { CmsNodeData } from './types';
import { storage } from '../utils/storage';

export const CmsNode = React.memo(({ data, isConnectable = true, selected }: CmsNodeProps) => {
  const [showOutput, setShowOutput] = useState(false);
  const handleStyle = { background: '#4CAF50' };
  const isHorizontal = data.isHorizontal;

  const executeQuery = useCallback(async () => {
    try {
      const response = await fetch(`${data.endpoint}`, {
        headers: {
          'Authorization': `Bearer ${data.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      // Update node data
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
      border: '1px solid #9C27B0',
      background: 'white',
      minWidth: '250px',
      position: 'relative'
    }}>
      <div style={{ marginBottom: '8px' }}>
        <span>📚 CMS</span>
        <span style={{ marginLeft: '8px', fontSize: '12px' }}>
          {data.contentType}
        </span>
      </div>
      
      {/* Rest of the UI similar to ApiNode */}
    </div>
  );
}); 