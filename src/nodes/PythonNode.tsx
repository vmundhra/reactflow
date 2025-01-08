import React, { useCallback, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import ReactMarkdown from 'react-markdown';
import type { ScriptNodeProps } from './types';
import { storage } from '../utils/storage';

const defaultPythonCode = `# input variable contains the data from previous node
# Example: process input data
output = input`;

export const PythonNode = React.memo(({ data, isConnectable = true, selected }: ScriptNodeProps) => {
  const [showOutput, setShowOutput] = useState(false);
  const handleStyle = { background: '#4CAF50' };
  const isHorizontal = data.isHorizontal;

  const executeScript = useCallback(async () => {
    try {
      data.onUpdate?.({
        ...data,
        isLoading: true,
        error: undefined,
        output: undefined
      });

      // Here we'll use Pyodide or a similar solution to run Python in browser
      // For now, we'll simulate Python execution
      const inputData = data.input || {};
      
      // TODO: Replace with actual Python execution
      // This is just a simulation
      const result = {
        output: inputData // In reality, this would be the processed data
      };

      const now = new Date();
      
      // Save to localStorage
      storage.saveResponse(data.id, {
        response: result.output,
        lastRun: now
      });

      data.onUpdate?.({
        ...data,
        isLoading: false,
        output: result.output,
        lastRun: now
      });

      setShowOutput(true);
    } catch (error: any) {
      console.error('Script Error:', error);
      data.onUpdate?.({
        ...data,
        isLoading: false,
        error: error.message,
        lastRun: new Date()
      });
    }
  }, [data]);

  // Add executeScript to node data
  data.executeScript = executeScript;

  return (
    <div style={{
      padding: '10px',
      borderRadius: '3px',
      border: '1px solid #FFD700',
      background: 'white',
      width: '100%',
      height: '100%',
      minWidth: '250px',
      minHeight: data.output && showOutput ? '400px' : '150px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <Handle
        type="target"
        position={isHorizontal ? Position.Left : Position.Top}
        style={handleStyle}
        isConnectable={isConnectable}
      />

      <NodeResizer
        color="#FFD700"
        isVisible={selected}
        minWidth={250}
        minHeight={150}
        handleStyle={{ width: '8px', height: '8px' }}
        lineStyle={{ border: '1px solid #FFD700' }}
      />

      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <span>🐍 Python</span>
      </div>

      <div style={{ 
        fontSize: '14px',
        marginBottom: '8px'
      }}>
        {data.label}
      </div>

      <div style={{
        fontSize: '12px',
        backgroundColor: '#f5f5f5',
        padding: '8px',
        borderRadius: '4px',
        maxHeight: '150px',
        overflow: 'auto',
        marginBottom: '8px',
        fontFamily: 'monospace'
      }}>
        <ReactMarkdown>
          {`\`\`\`python\n${data.code || defaultPythonCode}\n\`\`\``}
        </ReactMarkdown>
      </div>

      {/* Input Data Preview */}
      {data.input && (
        <div style={{
          fontSize: '12px',
          color: '#666',
          marginBottom: '8px'
        }}>
          Input Data Available ✓
        </div>
      )}

      {/* Output Section */}
      {data.output && (
        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={() => setShowOutput(!showOutput)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            {showOutput ? '🔼 Hide' : '🔽 Show'} Output
            {data.lastRun && (
              <span style={{ fontSize: '10px', marginLeft: '8px' }}>
                ({new Date(data.lastRun).toLocaleTimeString()})
              </span>
            )}
          </button>

          {showOutput && (
            <div style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              maxHeight: '200px',
              overflow: 'auto',
              border: '1px solid #e9ecef'
            }}>
              <ReactMarkdown>
                {`\`\`\`json\n${JSON.stringify(data.output, null, 2)}\n\`\`\``}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={isHorizontal ? Position.Right : Position.Bottom}
        style={handleStyle}
        isConnectable={isConnectable}
      />
    </div>
  );
}); 