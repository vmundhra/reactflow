import { storage } from './storage';
import type { ApiNodeData, HttpMethod } from '../nodes/types';

interface ApiCallOptions {
  id: string;
  url: string;
  method: HttpMethod;
  payload?: string;
  onUpdate?: (data: Partial<ApiNodeData>) => void;
}

export const api = {
  async call({ id, url, method, payload, onUpdate }: ApiCallOptions) {
    try {
      // Update loading state
      onUpdate?.({
        isLoading: true,
        error: undefined,
        response: undefined
      });

      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors'
      };

      if (payload && ['POST', 'PUT', 'PATCH'].includes(method)) {
        options.body = payload;
      }

      const response = await fetch(url, options);
      const responseData = await response.json();
      console.log('API Response:', responseData);

      const now = new Date();

      // Save to localStorage
      storage.saveResponse(id, {
        response: responseData,
        lastRun: now
      });

      // Update node state
      onUpdate?.({
        isLoading: false,
        response: responseData,
        lastRun: now
      });

      return {
        success: true,
        data: responseData,
        lastRun: now
      };
    } catch (error: any) {
      console.error('API Error:', error);
      const now = new Date();

      // Save error to localStorage
      storage.saveResponse(id, {
        response: null,
        lastRun: now,
        error: error.message
      });

      // Update node state
      onUpdate?.({
        isLoading: false,
        error: error.message,
        lastRun: now
      });

      return {
        success: false,
        error: error.message,
        lastRun: now
      };
    }
  }
}; 