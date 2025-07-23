import ApiService from './ApiService';
import MockApiService from './MockApiService';

/**
 * API Configuration
 * 
 * This file provides a unified interface for API services,
 * allowing easy switching between real and mock implementations.
 */

// Determine if we should use mock API based on environment variable
const useMockApi = process.env.REACT_APP_USE_MOCK_API === 'true' || process.env.NODE_ENV === 'development';

// Export the appropriate API service
const api = useMockApi ? MockApiService : ApiService;

export default api;