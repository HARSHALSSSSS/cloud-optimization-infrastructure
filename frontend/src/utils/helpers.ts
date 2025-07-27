/**
 * Utility functions for the Cloud Optimization Dashboard
 */

import { CloudResource, OptimizationRecommendation } from '../types/api';

/**
 * Format currency values
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format percentage values
 */
export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};

/**
 * Get utilization status based on CPU and memory usage
 */
export const getUtilizationStatus = (resource: CloudResource): {
  status: 'over-provisioned' | 'well-utilized' | 'under-provisioned' | 'unknown';
  color: string;
  bgColor: string;
} => {
  if (!resource.cpu_utilization || !resource.memory_utilization) {
    return {
      status: 'unknown',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    };
  }

  const cpu = resource.cpu_utilization;
  const memory = resource.memory_utilization;

  if (cpu < 30 && memory < 50) {
    return {
      status: 'over-provisioned',
      color: 'text-warning-600',
      bgColor: 'bg-warning-100'
    };
  }

  if (cpu > 80 || memory > 85) {
    return {
      status: 'under-provisioned',
      color: 'text-danger-600',
      bgColor: 'bg-danger-100'
    };
  }

  return {
    status: 'well-utilized',
    color: 'text-success-600',
    bgColor: 'bg-success-100'
  };
};

/**
 * Get provider logo/icon class
 */
export const getProviderInfo = (provider: string): {
  name: string;
  colorClass: string;
  bgColorClass: string;
} => {
  switch (provider.toLowerCase()) {
    case 'aws':
      return {
        name: 'AWS',
        colorClass: 'text-orange-600',
        bgColorClass: 'bg-orange-100'
      };
    case 'azure':
      return {
        name: 'Azure',
        colorClass: 'text-blue-600',
        bgColorClass: 'bg-blue-100'
      };
    case 'gcp':
      return {
        name: 'GCP',
        colorClass: 'text-green-600',
        bgColorClass: 'bg-green-100'
      };
    default:
      return {
        name: provider.toUpperCase(),
        colorClass: 'text-gray-600',
        bgColorClass: 'bg-gray-100'
      };
  }
};

/**
 * Get resource type display info
 */
export const getResourceTypeInfo = (type: string): {
  name: string;
  icon: string;
  colorClass: string;
} => {
  switch (type.toLowerCase()) {
    case 'compute':
      return {
        name: 'Compute',
        icon: '🖥️',
        colorClass: 'text-blue-600'
      };
    case 'storage':
      return {
        name: 'Storage',
        icon: '💾',
        colorClass: 'text-purple-600'
      };
    case 'database':
      return {
        name: 'Database',
        icon: '🗃️',
        colorClass: 'text-green-600'
      };
    case 'cache':
      return {
        name: 'Cache',
        icon: '⚡',
        colorClass: 'text-yellow-600'
      };
    default:
      return {
        name: type,
        icon: '📦',
        colorClass: 'text-gray-600'
      };
  }
};

/**
 * Get confidence level styling
 */
export const getConfidenceStyle = (level: string): {
  colorClass: string;
  bgColorClass: string;
  text: string;
} => {
  switch (level.toLowerCase()) {
    case 'high':
      return {
        colorClass: 'text-success-700',
        bgColorClass: 'bg-success-100',
        text: 'High Confidence'
      };
    case 'medium':
      return {
        colorClass: 'text-warning-700',
        bgColorClass: 'bg-warning-100',
        text: 'Medium Confidence'
      };
    case 'low':
      return {
        colorClass: 'text-danger-700',
        bgColorClass: 'bg-danger-100',
        text: 'Low Confidence'
      };
    default:
      return {
        colorClass: 'text-gray-700',
        bgColorClass: 'bg-gray-100',
        text: 'Unknown'
      };
  }
};

/**
 * Calculate total savings from implemented recommendations
 */
export const calculateImplementedSavings = (recommendations: OptimizationRecommendation[]): number => {
  return recommendations
    .filter(rec => rec.implemented)
    .reduce((total, rec) => total + rec.estimated_savings, 0);
};

/**
 * Get recommendation type styling
 */
export const getRecommendationTypeStyle = (type: string): {
  colorClass: string;
  bgColorClass: string;
  icon: string;
} => {
  switch (type.toLowerCase()) {
    case 'downsize':
      return {
        colorClass: 'text-blue-700',
        bgColorClass: 'bg-blue-100',
        icon: '↓'
      };
    case 'storage_optimization':
      return {
        colorClass: 'text-purple-700',
        bgColorClass: 'bg-purple-100',
        icon: '💾'
      };
    case 'terminate':
      return {
        colorClass: 'text-red-700',
        bgColorClass: 'bg-red-100',
        icon: '🗑️'
      };
    default:
      return {
        colorClass: 'text-gray-700',
        bgColorClass: 'bg-gray-100',
        icon: '💡'
      };
  }
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Group resources by type for analytics
 */
export const groupResourcesByType = (resources: CloudResource[]) => {
  return resources.reduce((acc, resource) => {
    const type = resource.resource_type;
    if (!acc[type]) {
      acc[type] = {
        resources: [],
        totalCost: 0,
        count: 0
      };
    }
    acc[type].resources.push(resource);
    acc[type].totalCost += resource.monthly_cost;
    acc[type].count += 1;
    return acc;
  }, {} as Record<string, { resources: CloudResource[]; totalCost: number; count: number }>);
};
