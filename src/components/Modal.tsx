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
    contentType?: string;
    endpoint?: string;
    apiKey?: string;
    platform?: 'jira' | 'asana' | 'trello';
    projectKey?: string;
    jqlQuery?: string;
    apiToken?: string;
  }) => void;
  node: AppNode | null;
  hasChanges: boolean;
}

const nodeTypeOptions = [
  { value: 'button', label: 'Button Node' },
  { value: 'api', label: 'API Node' },
  { value: 'python', label: 'Python Script' },
  { value: 'javascript', label: 'JavaScript Script' },
  { value: 'cms', label: 'CMS Integration' },
  { value: 'projectMgmt', label: 'Project Management' }
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
  const [contentType, setContentType] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [platform, setPlatform] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [jqlQuery, setJqlQuery] = useState('');
  const [apiToken, setApiToken] = useState('');

  useEffect(() => {
    if (node) {
      setLabel(node.data.label || '');
      setSelectedType(node.type || 'button');
      
      // Reset all fields
      setUrl('');
      setMethod('GET');
      setPayload('');
      setDataKey('');
      setCode('');
      setContentType('');
      setEndpoint('');
      setApiKey('');
      setPlatform('jira');
      setProjectKey('');
      setJqlQuery('');
      setApiToken('');

      // Set fields based on node type
      switch (node.type) {
        case 'api':
          setUrl(node.data.url || '');
          setMethod((node.data.method || 'GET') as HttpMethod);
          setPayload(node.data.payload || '');
          setDataKey(node.data.dataKey || '');
          break;
        case 'python':
        case 'javascript':
          setCode(node.data.code || '');
          break;
        case 'cms':
          setContentType(node.data.contentType || '');
          setEndpoint(node.data.endpoint || '');
          setApiKey(node.data.apiKey || '');
          break;
        case 'projectMgmt':
          setPlatform(node.data.platform || 'jira');
          setProjectKey(node.data.projectKey || '');
          setJqlQuery(node.data.jqlQuery || '');
          setApiToken(node.data.apiToken || '');
          break;
      }
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
    const updates: any = { label };

    switch (selectedType) {
      case 'api':
        updates.url = url;
        updates.method = method;
        updates.payload = payload;
        updates.dataKey = dataKey;
        break;
      case 'python':
      case 'javascript':
        updates.code = code;
        break;
      case 'cms':
        updates.contentType = contentType;
        updates.endpoint = endpoint;
        updates.apiKey = apiKey;
        break;
      case 'projectMgmt':
        updates.platform = platform;
        updates.projectKey = projectKey;
        updates.jqlQuery = jqlQuery;
        updates.apiToken = apiToken;
        break;
    }

    updates.type = selectedType;
    onSave(updates);
    setHasChanges(false);
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

        {selectedType === 'cms' && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Content Type:</label>
              <input
                type="text"
                value={contentType || ''}
                onChange={handleInputChange(setContentType)}
                placeholder="e.g., article, project, task"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginBottom: '10px'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>API Endpoint:</label>
              <input
                type="text"
                value={endpoint || ''}
                onChange={handleInputChange(setEndpoint)}
                placeholder="https://your-cms-api.com/content"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginBottom: '10px'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>API Key:</label>
              <input
                type="password"
                value={apiKey || ''}
                onChange={handleInputChange(setApiKey)}
                placeholder="Enter your CMS API key"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginBottom: '10px'
                }}
              />
            </div>
          </>
        )}

        {selectedType === 'projectMgmt' && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Platform:</label>
              <select
                value={platform || 'jira'}
                onChange={handleInputChange(setPlatform)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginBottom: '10px'
                }}
              >
                <option value="jira">Jira</option>
                <option value="asana">Asana</option>
                <option value="trello">Trello</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Project Key:</label>
              <input
                type="text"
                value={projectKey || ''}
                onChange={handleInputChange(setProjectKey)}
                placeholder="e.g., PROJ"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginBottom: '10px'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Query:</label>
              <textarea
                value={jqlQuery || ''}
                onChange={handleInputChange(setJqlQuery)}
                placeholder="e.g., project = PROJ AND type = Task"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginBottom: '10px',
                  minHeight: '80px'
                }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>API Token:</label>
              <input
                type="password"
                value={apiToken || ''}
                onChange={handleInputChange(setApiToken)}
                placeholder="Enter your platform API token"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginBottom: '10px'
                }}
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