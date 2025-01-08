export const fetchLocalData = (endpoint) => {
  switch (endpoint) {
    case '/api/project':
      return {
        success: true,
        data: {
          message: 'Fetched project data successfully',
          // Add more mock data as needed
        },
        lastRun: new Date().toISOString(),
      };
    case '/api/update':
      return {
        success: true,
        data: {
          message: 'Updated project system successfully',
          // Add more mock data as needed
        },
        lastRun: new Date().toISOString(),
      };
    default:
      return {
        success: false,
        error: 'Endpoint not found',
      };
  }
}; 