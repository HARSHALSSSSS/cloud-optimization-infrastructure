import React, { useState } from 'react';
import { Check, X, AlertTriangle, TrendingDown, Info } from 'lucide-react';
import { OptimizationRecommendation } from '../types/api';
import { 
  formatCurrency, 
  getConfidenceStyle, 
  getRecommendationTypeStyle,
  calculateImplementedSavings 
} from '../utils/helpers';

interface RecommendationsProps {
  recommendations: OptimizationRecommendation[];
  isLoading: boolean;
  error: string | null;
  onMarkImplemented: (recommendationId: number, implemented: boolean) => void;
}

interface RecommendationCardProps {
  recommendation: OptimizationRecommendation;
  onMarkImplemented: (implemented: boolean) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  onMarkImplemented 
}) => {
  // Debug logging for current_cost
  console.log('Recommendation data:', {
    resource_name: recommendation.resource_name,
    current_cost: recommendation.current_cost,
    estimated_savings: recommendation.estimated_savings
  });

  const confidenceStyle = getConfidenceStyle(recommendation.confidence_level);
  const typeStyle = getRecommendationTypeStyle(recommendation.recommendation_type);
  const [isImplemented, setIsImplemented] = useState(recommendation.implemented || false);

  const handleToggleImplemented = () => {
    const newStatus = !isImplemented;
    setIsImplemented(newStatus);
    onMarkImplemented(newStatus);
  };

  return (
    <div className={`card ${isImplemented ? 'opacity-75' : ''} transition-opacity duration-200`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${typeStyle.bgColorClass} flex items-center justify-center`}>
              <span className="text-lg">{typeStyle.icon}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {recommendation.resource_name}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeStyle.bgColorClass} ${typeStyle.colorClass} capitalize`}>
                  {recommendation.recommendation_type.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {recommendation.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${confidenceStyle.bgColorClass} ${confidenceStyle.colorClass}`}>
              {confidenceStyle.text}
            </span>
          </div>
        </div>

        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '0.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Current Cost</p>
              <p style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: '#1f2937'
              }}>
                {formatCurrency(recommendation.current_cost)}/month
              </p>
            </div>
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '0.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Estimated Savings</p>
              <p style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: '#059669'
              }}>
                {formatCurrency(recommendation.estimated_savings)}/month
              </p>
            </div>
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: '0.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>Annual Impact</p>
              <p style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: '#059669'
              }}>
                {formatCurrency(recommendation.estimated_savings * 12)}/year
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">Recommended Action</p>
              <p className="text-sm text-blue-800">{recommendation.recommended_action}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isImplemented && (
              <div className="flex items-center space-x-2 text-success-600">
                <Check size={16} />
                <span className="text-sm font-medium">Implemented</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleImplemented}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isImplemented
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-success-600 text-white hover:bg-success-700'
              }`}
            >
              {isImplemented ? (
                <>
                  <X size={16} className="mr-2" />
                  Mark as Not Implemented
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Mark as Implemented
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  isLoading,
  error,
  onMarkImplemented
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'implemented'>('all');
  
  const filteredRecommendations = recommendations.filter(rec => {
    if (filter === 'pending') return !rec.implemented;
    if (filter === 'implemented') return rec.implemented;
    return true;
  });

  const implementedSavings = calculateImplementedSavings(recommendations);
  const pendingSavings = recommendations
    .filter(rec => !rec.implemented)
    .reduce((total, rec) => total + rec.estimated_savings, 0);

  if (error) {
    return (
      <div className="card p-8">
        <div className="text-center">
          <div className="text-danger-600 mb-4">
            <AlertTriangle size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Recommendations</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Optimization Recommendations</h2>
          <p className="text-gray-600">
            {filteredRecommendations.length} of {recommendations.length} recommendations
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'implemented')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Recommendations</option>
            <option value="pending">Pending Implementation</option>
            <option value="implemented">Implemented</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      {recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Savings</p>
                <p className="text-2xl font-bold text-warning-600">
                  {formatCurrency(pendingSavings)}/month
                </p>
                <p className="text-sm text-gray-500">
                  {recommendations.filter(r => !r.implemented).length} recommendations
                </p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                <TrendingDown size={24} className="text-warning-600" />
              </div>
            </div>
          </div>
          
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Implemented Savings</p>
                <p className="text-2xl font-bold text-success-600">
                  {formatCurrency(implementedSavings)}/month
                </p>
                <p className="text-sm text-gray-500">
                  {recommendations.filter(r => r.implemented).length} implemented
                </p>
              </div>
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                <Check size={24} className="text-success-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="animate-pulse">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredRecommendations.length > 0 ? (
        <div className="space-y-4">
          {filteredRecommendations.map((recommendation, index) => (
            <RecommendationCard
              key={`${recommendation.resource_id}-${index}`}
              recommendation={recommendation}
              onMarkImplemented={(implemented) => 
                onMarkImplemented(recommendation.resource_id, implemented)
              }
            />
          ))}
        </div>
      ) : (
        <div className="card p-12">
          <div className="text-center">
            <Check size={48} className="mx-auto text-success-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'implemented' 
                ? 'No implemented recommendations yet'
                : filter === 'pending'
                ? 'No pending recommendations'
                : 'No optimization recommendations'
              }
            </h3>
            <p className="text-gray-600">
              {filter === 'implemented'
                ? 'Start implementing recommendations to see them here.'
                : filter === 'pending'
                ? 'All recommendations have been implemented!'
                : 'Your infrastructure is well-optimized!'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
