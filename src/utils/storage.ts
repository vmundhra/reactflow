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
  }
}; 