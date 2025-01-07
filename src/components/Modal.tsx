import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import type { AppNode } from '../nodes/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { 
    label: string; 
    sourceUrl?: string; 
    dataKey?: string;
    type?: string;
  }) => void;
  node: AppNode | null;
  hasChanges: boolean;
}

const nodeTypeOptions = [
  { value: 'button', label: 'Button Node' },
  { value: 'source', label: 'Source Node' }
];

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  node, 
  hasChanges: initialHasChanges 
}) => {
  const [label, setLabel] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [dataKey, setDataKey] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [hasChanges, setHasChanges] = useState(initialHasChanges);

  useEffect(() => {
    if (node) {
      setLabel(node.data.label || '');
      setSourceUrl(node.data.sourceUrl || '');
      setDataKey(node.data.dataKey || '');
      setSelectedType(node.type || 'button');
      setHasChanges(false);
    }
  }, [node]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ 
      label, 
      sourceUrl, 
      dataKey,
      type: selectedType
    });
  };

  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

        {selectedType === 'source' && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Source URL:</label>
              <input
                type="text"
                value={sourceUrl}
                onChange={handleInputChange(setSourceUrl)}
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
              <label style={{ display: 'block', marginBottom: '5px' }}>Data Key (optional):</label>
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