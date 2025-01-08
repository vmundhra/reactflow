import React, { useState, useEffect } from 'react';
import { loadProject } from '../utils/storage';
import { loadDemoConfig } from '../utils/loadDemoConfig';
import { format } from 'date-fns';

interface SavedProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoad: (projectData: any) => void;
}

export const SavedProjectsModal: React.FC<SavedProjectsModalProps> = ({ isOpen, onClose, onLoad }) => {
  const [savedProjects, setSavedProjects] = useState<string[]>([]);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('project_'));
    console.log('Saved project keys:', keys);
    setSavedProjects(['Demo Project', ...keys]);
  }, [isOpen]);

  const handleLoad = (key: string) => {
    console.log('Loading project for key:', key);
    if (key === 'Demo Project') {
      const demoConfig = loadDemoConfig();
      console.log('Loaded demo config:', demoConfig);
      onLoad(demoConfig);
    } else {
      const projectData = loadProject(key.replace('project_', ''));
      console.log('Loaded project data:', projectData);
      if (projectData) {
        onLoad(projectData);
      } else {
        alert('Project not found!');
      }
    }
    onClose();
  };

  const formatTimestamp = (key: string) => {
    const timestamp = key.replace('project_', '');
    return format(new Date(timestamp), 'PPpp');
  };

  if (!isOpen) return null;

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
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '400px',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}>
        <h2>Saved Projects</h2>
        <ul>
          {savedProjects.map(key => (
            <li key={key} style={{ marginBottom: '10px' }}>
              <button onClick={() => handleLoad(key)} style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}>
                {key === 'Demo Project' ? key : formatTimestamp(key)}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={onClose} style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>
          Close
        </button>
      </div>
    </div>
  );
}; 