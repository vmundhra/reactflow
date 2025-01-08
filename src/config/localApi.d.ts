declare module '../config/localApi' {
  export function fetchLocalData(endpoint: string): {
    success: boolean;
    data?: any;
    error?: string;
  };
} 