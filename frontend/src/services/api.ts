import axios from 'axios';
import { CloudResource, OptimizationSummary, CostAnalytics } from '../types/api';

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for loading states
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please check if the backend server is running.');
    }
    
    if (error.response?.status === 500) {
      throw new Error('Internal server error. Please try again later.');
    }
    
    if (error.response?.status === 404) {
      throw new Error('Endpoint not found. Please check the API configuration.');
    }
    
    if (!error.response) {
      throw new Error('Network error. Please check if the backend server is running on http://localhost:8000');
    }
    
    throw new Error(error.response?.data?.detail || 'An unexpected error occurred');
  }
);

// API Service Class
export class CloudOptimizationAPI {
  
  /**
   * Get all cloud resources
   */
  static async getResources(): Promise<CloudResource[]> {
    try {
      const response = await api.get<CloudResource[]>('/resources');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      throw error;
    }
  }

  /**
   * Get optimization recommendations
   */
  static async getRecommendations(): Promise<OptimizationSummary> {
    try {
      const response = await api.get<OptimizationSummary>('/recommendations');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      throw error;
    }
  }

  /**
   * Get cost analytics summary
   */
  static async getCostAnalytics(): Promise<CostAnalytics> {
    try {
      const response = await api.get<CostAnalytics>('/analytics/cost-summary');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cost analytics:', error);
      throw error;
    }
  }

  /**
   * Get individual resource health
   */
  static async getResourceHealth(resourceId: number): Promise<any> {
    try {
      const response = await api.get(`/resources/${resourceId}/health`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch health for resource ${resourceId}:`, error);
      throw error;
    }
  }

  /**
   * Check API health
   */
  static async checkHealth(): Promise<{ status: string; message: string; version: string }> {
    try {
      const response = await axios.get<{ status: string; message: string; version: string }>('http://localhost:8000/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Backend server is not available');
    }
  }
}

export default CloudOptimizationAPI;
