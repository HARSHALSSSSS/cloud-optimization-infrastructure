// Types for Cloud Infrastructure Optimization API

export interface CloudResource {
  id: number;
  name: string;
  resource_type: 'compute' | 'storage' | 'database' | 'cache';
  provider: 'aws' | 'azure' | 'gcp';
  instance_type: string;
  size?: string;
  cpu_utilization?: number;
  memory_utilization?: number;
  storage_usage?: number;
  monthly_cost: number;
  created_at: string;
  updated_at?: string;
}

export interface OptimizationRecommendation {
  resource_id: number;
  resource_name: string;
  current_cost: number;
  recommendation_type: string;
  description: string;
  recommended_action: string;
  estimated_savings: number;
  confidence_level: 'high' | 'medium' | 'low';
  implemented?: boolean;
}

export interface OptimizationSummary {
  total_resources: number;
  total_monthly_cost: number;
  total_potential_savings: number;
  recommendations: OptimizationRecommendation[];
  savings_percentage: number;
}

export interface CostAnalytics {
  total_monthly_cost: number;
  total_resources: number;
  cost_by_type: Record<string, { count: number; cost: number }>;
  cost_by_provider: Record<string, { count: number; cost: number }>;
  optimization_potential: {
    potential_savings: number;
    savings_percentage: number;
    recommendations_count: number;
  };
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoadingState {
  resources: boolean;
  recommendations: boolean;
  analytics: boolean;
}

export interface ErrorState {
  resources: string | null;
  recommendations: string | null;
  analytics: string | null;
}
