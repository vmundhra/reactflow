import React, { useCallback, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import ReactMarkdown from 'react-markdown';
import type { ScriptNodeProps } from './types';
import { storage } from '../utils/storage';

const defaultJavaScriptCode = `// The input variable contains data from the previous node
// Example: Process the input data and return a new object

function processData(data) {
  // Example: Add a timestamp and transform the data
  return {
    originalData: data,
    timestamp: new Date().toISOString(),
    processed: true,
    summary: typeof data === 'object' 
      ? Object.keys(data).length + ' properties processed'
      : 'Processed ' + typeof data
  };
}

// Process the input and assign to output variable
const output = processData(input);

// The output variable will be passed to the next node
`;

export const JavaScriptNode = React.memo(({ data, isConnectable = true, selected }: ScriptNodeProps) => {
  const [showOutput, setShowOutput] = useState(false);
  const handleStyle = { background: '#F7DF1E' };
  const isHorizontal = data.isHorizontal;

  const executeScript = useCallback(async () => {
    try {
      data.onUpdate?.({
        ...data,
        isLoading: true,
        error: undefined,
        output: undefined
      });

      const inputData = data.input || {};
      
      // Execute JavaScript code with error handling
      const fn = new Function('input', `
        try {
          ${data.code || defaultJavaScriptCode}
          return { output };
        } catch (error) {
          throw new Error('Script execution failed: ' + error.message);
        }
      `);

      const result = fn(inputData);
      const now = new Date();

      if (!result || typeof result.output === 'undefined') {
        throw new Error('Script must define an output variable');
      }

      storage.saveResponse(data.id, {
        response: result.output,
        lastRun: now
      });

      data.onUpdate?.({
        ...data,
        isLoading: false,
        output: result.output,
        lastRun: now,
        error: undefined
      });

      setShowOutput(true);
    } catch (error: any) {
      console.error('Script Error:', error);
      data.onUpdate?.({
        ...data,
        isLoading: false,
        error: error.message,
        lastRun: new Date(),
        output: undefined
      });
    }
  }, [data]);

  // Add executeScript to node data
  data.executeScript = executeScript;

  return (
    <div style={{
      padding: '10px',
      borderRadius: '3px',
      border: '1px solid #F7DF1E',
      background: 'white',
      width: '100%',
      height: '100%',
      minWidth: '250px',
      minHeight: (data.output && showOutput) || data.error ? '400px' : '150px',
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
        color="#F7DF1E"
        isVisible={selected}
        minWidth={250}
        minHeight={150}
        handleStyle={{ width: '8px', height: '8px' }}
        lineStyle={{ border: '1px solid #F7DF1E' }}
      />

      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <span>📜 JavaScript</span>
      </div>

      <div style={{ 
        fontSize: '14px',
        marginBottom: '8px'
      }}>
        {data.label}
      </div>

      {/* Current Input Display */}
      {data.input && (
        <div style={{
          marginBottom: '12px'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#666',
            marginBottom: '4px',
            fontWeight: 'bold'
          }}>
            Current Input:
          </div>
          <div style={{
            fontSize: '12px',
            backgroundColor: '#f8f9fa',
            padding: '8px',
            borderRadius: '4px',
            maxHeight: '100px',
            overflow: 'auto',
            border: '1px solid #e9ecef',
            fontFamily: 'monospace'
          }}>
            <ReactMarkdown>
              {`\`\`\`json\n${JSON.stringify(data.input, null, 2)}\n\`\`\``}
            </ReactMarkdown>
          </div>
        </div>
      )}

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
          {`\`\`\`javascript\n${data.code || defaultJavaScriptCode}\n\`\`\``}
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

      {/* Error Display */}
      {data.error && (
        <div style={{
          marginTop: '8px',
          padding: '12px',
          backgroundColor: '#fff3f3',
          borderRadius: '4px',
          border: '1px solid #ffcdd2',
          color: '#d32f2f',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <strong>Error:</strong> {data.error}
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