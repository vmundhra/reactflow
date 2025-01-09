import React, { useState, useEffect } from 'react';
import { loadProject, storage } from '../utils/storage';
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

  const handleDeleteProject = (key: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      localStorage.removeItem(key);
      setSavedProjects(prevKeys => prevKeys.filter(k => k !== key));
    }
  };

  const formatTimestamp = (key: string) => {
    const timestamp = key.replace('project_', '');
    return format(new Date(timestamp), 'PPpp');
  };

  const handleClearStorage = () => {
    console.log('Clear storage button clicked');
    
    if (window.confirm('Are you sure you want to clear all storage? This action cannot be undone.')) {
      console.log('Starting clear storage process...');
      
      // Find and remove all project keys
      const keys = Object.keys(localStorage);
      console.log('Current localStorage keys:', keys);
      keys.forEach(key => {
        if (key.startsWith('project_')) {
          console.log(`Removing project key: ${key}`);
          localStorage.removeItem(key);
        }
      });

      // Clear other app state
      storage.clearAll();
      
      // Wait for clear operation to complete
      setTimeout(() => {
        // Load demo configuration
        const demoConfig = loadDemoConfig();
        console.log('Loading demo configuration:', demoConfig);
        
        // Update state with demo data
        onLoad(demoConfig);
        
        // Close modal and update projects list
        onClose();
        setSavedProjects(['Demo Project']);
      }, 200);
    }
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
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {savedProjects.map((key, index) => (
            <li key={key} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={() => handleLoad(key)} style={{
                flexGrow: 1,
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}>
                {key === 'Demo Project' ? key : formatTimestamp(key)}
              </button>
              {key !== 'Demo Project' && (
                <button onClick={() => handleDeleteProject(key)} style={{
                  marginLeft: '10px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}>
                  🗑️
                </button>
              )}
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={handleClearStorage} style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
            Clear All Projects
          </button>
          <button onClick={onClose} style={{
            flex: 1,
            padding: '10px',
            backgroundColor: '#757575',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}; 