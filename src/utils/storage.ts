import type { AppNode } from '../nodes/types';
import type { Edge } from '@xyflow/react';

interface AppState {
  nodes: AppNode[];
  edges: Edge[];
  lastUpdated: string;
}

interface NodeResponse {
  response: any;
  lastRun: Date;
  error?: string;
}

interface NodeResponseCache {
  [nodeId: string]: NodeResponse;
}

const STORAGE_KEYS = {
  APP_STATE: 'react-flow-app-state',
  API_RESPONSES: 'api-node-responses'
};

let isClearing = false;

export const storage = {
  // API Response methods
  saveResponse(nodeId: string, data: NodeResponse) {
    try {
      const cache = this.getAllResponses();
      cache[nodeId] = {
        ...data,
        lastRun: data.lastRun.toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.API_RESPONSES, JSON.stringify(cache));
    } catch (error) {
      console.error('Error saving response to localStorage:', error);
    }
  },

  getResponse(nodeId: string): NodeResponse | null {
    try {
      const cache = this.getAllResponses();
      const data = cache[nodeId];
      if (data) {
        return {
          ...data,
          lastRun: new Date(data.lastRun)
        };
      }
      return null;
    } catch (error) {
      console.error('Error reading response from localStorage:', error);
      return null;
    }
  },

  getAllResponses(): NodeResponseCache {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.API_RESPONSES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading responses from localStorage:', error);
      return {};
    }
  },

  // App State methods
  saveAppState(nodes: AppNode[], edges: Edge[]) {
    if (isClearing) return; // Don't save while clearing
    try {
      const state: AppState = {
        nodes,
        edges,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEYS.APP_STATE, JSON.stringify(state));
      console.log('App state saved:', state);
    } catch (error) {
      console.error('Error saving app state to localStorage:', error);
    }
  },

  getAppState(): AppState | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APP_STATE);
      if (!data) return null;

      const state: AppState = JSON.parse(data);
      
      // Rehydrate dates and functions in nodes
      state.nodes = state.nodes.map(node => {
        if (node.type === 'api') {
          // Restore API node specific data
          const savedResponse = this.getResponse(node.id);
          if (savedResponse) {
            node.data = {
              ...node.data,
              response: savedResponse.response,
              lastRun: savedResponse.lastRun,
              error: savedResponse.error
            };
          }
        }
        return node;
      });

      return state;
    } catch (error) {
      console.error('Error reading app state from localStorage:', error);
      return null;
    }
  },

  clearAll() {
    console.log('=== Storage Clear Process Started ===');
    console.log('Current URL:', window.location.href);
    console.log('localStorage object:', localStorage);
    
    isClearing = true;
    
    try {
      // Get and log all keys
      const keys = Object.keys(localStorage);
      console.log('Found localStorage keys:', keys);
      console.log('Current localStorage contents:');
      keys.forEach(key => {
        const value = localStorage.getItem(key);
        console.log(`${key}:`, value);
      });

      // Clear each key
      console.log('\nClearing keys...');
      keys.forEach(key => {
        try {
          console.log(`Removing key: "${key}"`);
          localStorage.removeItem(key);
          const checkRemoved = localStorage.getItem(key);
          console.log(`Key "${key}" removal ${checkRemoved === null ? 'successful' : 'FAILED'}`);
        } catch (error) {
          console.error(`Error removing key "${key}":`, error);
        }
      });

      // Verify clear operation
      const remainingKeys = Object.keys(localStorage);
      console.log('\nVerification after clear:');
      console.log('Remaining keys:', remainingKeys);
      console.log('localStorage length:', localStorage.length);
      
      if (remainingKeys.length > 0) {
        console.warn('WARNING: Some keys still remain:', remainingKeys);
        console.log('Attempting force clear...');
        localStorage.clear();
        console.log('Force clear completed. Final key count:', Object.keys(localStorage).length);
      }

    } catch (error) {
      console.error('Critical error during storage clear:', error);
    } finally {
      console.log('=== Storage Clear Process Completed ===');
      isClearing = false;
    }
  },

  clear: () => {
    isClearing = true;
    localStorage.clear();
    setTimeout(() => {
      isClearing = false;
    }, 100); // Reset flag after clear operation
  }
};

export const saveProject = (projectData: any) => {
  const timestamp = new Date().toISOString();
  localStorage.setItem(`project_${timestamp}`, JSON.stringify(projectData));
  console.log(`Project saved as project_${timestamp}`);
};

export const loadProject = (timestamp: string) => {
  const projectData = localStorage.getItem(`project_${timestamp}`);
  return projectData ? JSON.parse(projectData) : null;
}; 