import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { AppNode, HttpMethod } from '../nodes/types';

const defaultPythonCode = `# input variable contains the data from previous node
# Example: process input data
output = input`;

const defaultJavaScriptCode = `// input variable contains the data from previous node
// Example: process input data
const output = input;`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { 
    label: string; 
    url?: string;
    method?: HttpMethod;
    payload?: string;
    dataKey?: string;
    type?: string;
    code?: string;
  }) => void;
  node: AppNode | null;
  hasChanges: boolean;
}

const nodeTypeOptions = [
  { value: 'button', label: 'Button Node' },
  { value: 'api', label: 'API Node' },
  { value: 'python', label: 'Python Script' },
  { value: 'javascript', label: 'JavaScript Script' }
];

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  node, 
  hasChanges: initialHasChanges 
}) => {
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [payload, setPayload] = useState('');
  const [dataKey, setDataKey] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [hasChanges, setHasChanges] = useState(initialHasChanges);
  const [code, setCode] = useState('');

  useEffect(() => {
    if (node) {
      setLabel(node.data.label || '');
      setUrl(node.data.url || '');
      setMethod(node.data.method || 'GET');
      setPayload(node.data.payload || '');
      setDataKey(node.data.dataKey || '');
      if (!selectedType) {
        setSelectedType(node.type || 'button');
      }
      setCode(node.data.code || '');
      
      // Show current input in code placeholder if available
      if (node.data.input && selectedType === 'javascript') {
        const inputExample = JSON.stringify(node.data.input, null, 2);
        setCode(`// Current input data available as 'input' variable:
/*
${inputExample}
*/

// Process the input data
function processData(data) {
  // Add your data processing logic here
  return {
    processed: data,
    timestamp: new Date().toISOString()
  };
}

// Process input and assign to output
const output = processData(input);
`);
      }
      
      setHasChanges(false);
    }
  }, [node]);

  // Add effect to handle code updates when type changes
  useEffect(() => {
    if (node?.data.input && selectedType === 'javascript') {
      const inputExample = JSON.stringify(node.data.input, null, 2);
      setCode(`// Current input data available as 'input' variable:
/*
${inputExample}
*/

// Process the input data
function processData(data) {
  // Add your data processing logic here
  return {
    processed: data,
    timestamp: new Date().toISOString()
  };
}

// Process input and assign to output
const output = processData(input);
`);
      setHasChanges(true);
    }
  }, [selectedType, node?.data.input]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ 
      label,
      url,
      method,
      payload,
      dataKey,
      type: selectedType,
      code
    });
  };

  const handleInputChange = (setter: (value: any) => void) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setter(e.target.value);
    setHasChanges(true);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '600px',
        maxWidth: '90%',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>Edit Node: {node?.id}</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Node Type:</label>
          <select
            value={selectedType}
            onChange={handleInputChange(setSelectedType)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginBottom: '10px'
            }}
          >
            {nodeTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Node Label:</label>
          <input
            type="text"
            value={label}
            onChange={handleInputChange(setLabel)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              marginBottom: '10px'
            }}
          />
        </div>

        {selectedType === 'api' && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>HTTP Method:</label>
              <select
                value={method}
                onChange={handleInputChange(setMethod)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginBottom: '10px'
                }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>API URL:</label>
              <input
                type="text"
                value={url}
                onChange={handleInputChange(setUrl)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginBottom: '10px'
                }}
              />
            </div>

            {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Request Payload:</label>
                <textarea
                  value={payload}
                  onChange={handleInputChange(setPayload)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    minHeight: '100px',
                    fontFamily: 'monospace'
                  }}
                  placeholder="Enter JSON payload..."
                />
              </div>
            )}

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Response Data Key (optional):</label>
              <input
                type="text"
                value={dataKey}
                onChange={handleInputChange(setDataKey)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              />
            </div>
          </>
        )}

        {(selectedType === 'python' || selectedType === 'javascript') && (
          <>
            {/* Current Input Display */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Current Input:</label>
              {node?.data.input ? (
                Array.isArray(node.data.input) ? (
                  // Handle multiple inputs
                  node.data.input.map((input, index) => (
                    <div key={index} style={{ marginBottom: '8px' }}>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                        Input {index + 1}:
                      </div>
                      <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '12px',
                        borderRadius: '4px',
                        border: '1px solid #e9ecef',
                        maxHeight: '150px',
                        overflow: 'auto'
                      }}>
                        <ReactMarkdown>
                          {`\`\`\`json\n${JSON.stringify(input, null, 2)}\n\`\`\``}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))
                ) : (
                  // Single input
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    padding: '12px',
                    borderRadius: '4px',
                    border: '1px solid #e9ecef',
                    maxHeight: '150px',
                    overflow: 'auto'
                  }}>
                    <ReactMarkdown>
                      {`\`\`\`json\n${JSON.stringify(node.data.input, null, 2)}\n\`\`\``}
                    </ReactMarkdown>
                  </div>
                )
              ) : (
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  border: '1px solid #e9ecef',
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  (None)
                </div>
              )}
            </div>

            {/* Script Editor */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Script:</label>
              <textarea
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setHasChanges(true);
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  minHeight: '200px',
                  fontFamily: 'monospace'
                }}
                placeholder={selectedType === 'python' ? defaultPythonCode : defaultJavaScriptCode}
              />
            </div>
          </>
        )}

        {node && (
          <div style={{ 
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            <ReactMarkdown>
              {`\`\`\`json\n${JSON.stringify(node, null, 2)}\n\`\`\``}
            </ReactMarkdown>
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: '10px',
          marginTop: '20px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f0f0f0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            style={{
              padding: '8px 16px',
              backgroundColor: hasChanges ? '#4CAF50' : '#cccccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: hasChanges ? 'pointer' : 'default'
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}; 