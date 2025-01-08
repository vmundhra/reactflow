import React, { useEffect, useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import ReactMarkdown from 'react-markdown';
import type { ApiNodeProps } from './types';
import { storage } from '../utils/storage';
import { api } from '../utils/api';

export const ApiNode = React.memo(({ data, isConnectable = true, selected }: ApiNodeProps) => {
  const [showOutput, setShowOutput] = useState(false);
  const [localResponse, setLocalResponse] = useState<any>(null);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const handleStyle = { background: '#4CAF50' };
  const isHorizontal = data.isHorizontal;

  const methodColors: Record<string, string> = {
    GET: '#61affe',
    POST: '#49cc90',
    PUT: '#fca130',
    DELETE: '#f93e3e',
    PATCH: '#50e3c2'
  };

  // Move apiCall function definition outside useEffect
  const apiCall = async () => {
    try {
      console.log('Starting API call...', {
        url: data.url,
        method: data.method,
        payload: data.payload
      });
      
      // Reset states
      setLocalResponse(null);
      setShowOutput(true);
      
      // Update loading state
      const updatedData = {
        ...data,
        isLoading: true,
        error: undefined,
        response: undefined,
        output: undefined
      };
      data.onUpdate?.(updatedData);

      const result = await api.call({
        id: data.id,
        url: data.url,
        method: data.method,
        payload: data.payload
      });

      console.log('API Call Success:', result);
      const now = new Date();
      
      // Save to localStorage
      storage.saveResponse(data.id, {
        response: result,
        lastRun: now
      });

      // Update local state first
      setLocalResponse(result);
      setLastRun(now);
      setShowOutput(true);

      // Then update node data
      const successData = {
        ...data,
        isLoading: false,
        response: result,
        output: result,
        lastRun: now,
        error: undefined
      };
      data.onUpdate?.(successData);

      console.log('States updated:', {
        localResponse: result,
        showOutput: true,
        lastRun: now
      });

    } catch (error: any) {
      console.error('API Error:', error);
      setLocalResponse(null);
      setShowOutput(false);
      
      const errorData = {
        ...data,
        isLoading: false,
        error: error.message,
        response: undefined,
        output: undefined,
        lastRun: new Date()
      };
      data.onUpdate?.(errorData);
    }
  };

  // Then in useEffect
  useEffect(() => {
    console.log('Initializing executeApiCall');
    if (data.onUpdate) {
      data.onUpdate({
        ...data,
        executeApiCall: apiCall
      });
    }
  }, [data]);

  // Load saved response on mount
  useEffect(() => {
    const savedData = storage.getResponse(data.id);
    if (savedData) {
      console.log('Loading saved response:', savedData);
      setLocalResponse(savedData.response);
      setLastRun(new Date(savedData.lastRun));
      setShowOutput(true);
      
      data.onUpdate?.({
        ...data,
        response: savedData.response,
        output: savedData.response,
        lastRun: savedData.lastRun,
        executeApiCall: apiCall
      });
    }
  }, [data.id]);

  // Debug logging for state changes
  useEffect(() => {
    console.log('ApiNode render state:', {
      localResponse,
      showOutput,
      dataResponse: data.response,
      dataOutput: data.output,
      lastRun,
      isLoading: data.isLoading,
      hasExecuteApiCall: !!data.executeApiCall
    });
  }, [localResponse, showOutput, data.response, data.output, lastRun, data.isLoading, data.executeApiCall]);

  return (
    <div style={{
      padding: '10px',
      borderRadius: '3px',
      border: '1px solid #1E88E5',
      background: 'white',
      width: '100%',
      height: '100%',
      minWidth: '250px',
      minHeight: (localResponse || data.isLoading) && showOutput ? '400px' : '120px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box'
    }}>
      <NodeResizer
        color="#1E88E5"
        isVisible={selected}
        minWidth={250}
        minHeight={120}
        handleStyle={{ width: '8px', height: '8px' }}
        lineStyle={{ border: '1px solid #1E88E5' }}
        keepAspectRatio={false}
      />
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px',
        width: '100%'
      }}>
        <span>🔗 API</span>
        <span style={{
          padding: '2px 6px',
          borderRadius: '3px',
          backgroundColor: methodColors[data.method as keyof typeof methodColors] || '#666',
          color: 'white',
          fontSize: '11px',
          fontWeight: 'bold',
          marginLeft: '8px'
        }}>
          {data.method}
        </span>
      </div>

      <div style={{ 
        fontSize: '14px',
        marginBottom: '8px',
        width: '100%'
      }}>
        {data.label}
      </div>

      <div style={{
        fontSize: '12px',
        color: '#666',
        wordBreak: 'break-all',
        width: '100%',
        marginBottom: '8px'
      }}>
        {data.url}
      </div>

      {/* Show payload if present */}
      {data.payload && (
        <div style={{
          fontSize: '12px',
          backgroundColor: '#f5f5f5',
          padding: '8px',
          borderRadius: '4px',
          maxHeight: '100px',
          overflow: 'auto',
          marginBottom: '8px'
        }}>
          <ReactMarkdown>
            {`\`\`\`json\n${data.payload}\n\`\`\``}
          </ReactMarkdown>
        </div>
      )}

      {/* Response Section */}
      {(localResponse || data.isLoading) && (
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
              gap: '4px',
              color: '#666'
            }}
          >
            {showOutput ? '🔼 Hide' : '🔽 Show'} Response
            {lastRun && (
              <span style={{ fontSize: '10px', marginLeft: '8px' }}>
                ({lastRun.toLocaleTimeString()})
              </span>
            )}
          </button>

          {showOutput && (
            <div style={{
              marginTop: '8px',
              padding: '12px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              maxHeight: '250px',
              overflow: 'auto',
              border: '1px solid #e9ecef'
            }}>
              {data.isLoading ? (
                <div style={{ textAlign: 'center', color: '#666' }}>Loading...</div>
              ) : (
                <ReactMarkdown className="response-markdown">
                  {`\`\`\`json\n${JSON.stringify(localResponse, null, 2)}\n\`\`\``}
                </ReactMarkdown>
              )}
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