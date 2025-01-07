import React, { useState, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newLabel: string) => void;
  node: any;
  hasChanges: boolean;
}

const modalStyles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    position: 'relative' as const,
    width: '80%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexShrink: 0,
  },
  contentArea: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  markdownContainer: {
    overflow: 'auto',
    flex: 1,
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'right' as const,
    flexShrink: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  saveButton: {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    opacity: hasChanges => hasChanges ? 1 : 0.5,
    pointerEvents: hasChanges => hasChanges ? 'auto' : 'none',
  },
  formGroup: {
    marginBottom: '20px',
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '4px',
    border: '1px solid #e0e0e0',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#666',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  jsonPreview: {
    marginTop: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    padding: '15px',
  }
};

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  node, 
  hasChanges: initialHasChanges 
}) => {
  const [nodeLabel, setNodeLabel] = useState('');
  const [hasChanges, setHasChanges] = useState(initialHasChanges);

  // Reset state when a new node is loaded
  useEffect(() => {
    if (node && isOpen) {
      setNodeLabel(node.data.label || '');
      setHasChanges(false);
    }
  }, [node, isOpen]);

  const handleLabelChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setNodeLabel(evt.target.value);
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    onSave(nodeLabel);
  }, [nodeLabel, onSave]);

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <div style={modalStyles.header}>
          <h2>Edit Node: {node.id}</h2>
          <button onClick={onClose} style={modalStyles.closeButton}>×</button>
        </div>
        <div style={modalStyles.contentArea}>
          <div style={modalStyles.formGroup}>
            <label htmlFor="nodeLabel" style={modalStyles.label}>
              Node Label:
            </label>
            <input
              id="nodeLabel"
              className="nodrag"
              value={nodeLabel}
              onChange={handleLabelChange}
              style={modalStyles.input}
              placeholder="Enter node label"
            />
          </div>
          <div style={modalStyles.jsonPreview}>
            <ReactMarkdown>
              {`\`\`\`json
${JSON.stringify(node, null, 2)}
\`\`\``}
            </ReactMarkdown>
          </div>
        </div>
        <div style={modalStyles.footer}>
          <button 
            onClick={handleSave}
            style={{
              ...modalStyles.saveButton,
              opacity: hasChanges ? 1 : 0.5,
              pointerEvents: hasChanges ? 'auto' : 'none'
            }}
            disabled={!hasChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}; 