import React from 'react';
import { TrendingUp, DollarSign, AlertCircle, Server } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/helpers';

interface SummaryCardsProps {
  totalResources: number;
  totalMonthlyCost: number;
  totalPotentialSavings: number;
  optimizationOpportunities: number;
  savingsPercentage: number;
  isLoading: boolean;
}

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  isLoading: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  isLoading 
}) => {
  const changeColorClass = {
    positive: 'text-success-600',
    negative: 'text-danger-600',
    neutral: 'text-gray-600'
  }[changeType];

  if (isLoading) {
    return (
      <div className="stats-card">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-8 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-card hover:shadow-md transition-shadow duration-200" style={{backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold mb-2" style={{color: '#6b7280', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em'}}>{title}</p>
          <p className="text-4xl font-bold mb-1" style={{color: '#1f2937', fontSize: '2.25rem', fontWeight: '800', lineHeight: '1.2'}}>{value}</p>
          {change && (
            <p className={`text-sm font-medium ${changeColorClass}`} style={{fontSize: '0.875rem', fontWeight: '600'}}>
              {change}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{
            backgroundColor: '#3b82f6', 
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
          }}>
            <div style={{color: 'white', fontSize: '1.5rem'}}>
              {icon}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalResources,
  totalMonthlyCost,
  totalPotentialSavings,
  optimizationOpportunities,
  savingsPercentage,
  isLoading
}) => {
  // Debug logging
  console.log('SummaryCards props:', {
    totalResources,
    totalMonthlyCost,
    totalPotentialSavings,
    optimizationOpportunities,
    savingsPercentage,
    isLoading
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Resources"
        value={totalResources.toString()}
        icon={<Server size={24} />}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Monthly Cost"
        value={formatCurrency(totalMonthlyCost)}
        icon={<DollarSign size={24} />}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Potential Savings"
        value={formatCurrency(totalPotentialSavings)}
        change={`${formatPercentage(savingsPercentage)} reduction`}
        changeType="positive"
        icon={<TrendingUp size={24} />}
        isLoading={isLoading}
      />
      
      <StatCard
        title="Optimization Opportunities"
        value={optimizationOpportunities.toString()}
        change={optimizationOpportunities > 0 ? "Action required" : "All optimized"}
        changeType={optimizationOpportunities > 0 ? "negative" : "positive"}
        icon={<AlertCircle size={24} />}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SummaryCards;
