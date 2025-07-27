import React, { useState, useEffect } from 'react';
import { Cloud, RefreshCw, AlertCircle, ExternalLink, Server, TrendingUp } from 'lucide-react';
import SummaryCards from './components/SummaryCards';
import ResourcesTable from './components/ResourcesTable';
import Recommendations from './components/Recommendations';
import LoadingSpinner from './components/LoadingSpinner';
import { CloudOptimizationAPI } from './services/api';
import { CloudResource, OptimizationSummary, LoadingState, ErrorState } from './types/api';

function App() {
  // State management
  const [resources, setResources] = useState<CloudResource[]>([]);
  const [recommendations, setRecommendations] = useState<OptimizationSummary | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    resources: true,
    recommendations: true,
    analytics: true
  });
  const [errors, setErrors] = useState<ErrorState>({
    resources: null,
    recommendations: null,
    analytics: null
  });
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

    // Load all data with better error handling and performance
  const loadData = async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setIsRefreshing(true);
    }

    try {
      // Reset errors
      setErrors({
        resources: null,
        recommendations: null,
        analytics: null
      });

      // Load resources with timeout
      setLoading(prev => ({ ...prev, resources: true }));
      try {
        const resourcesData = await Promise.race([
          CloudOptimizationAPI.getResources(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 10000))
        ]);
        setResources(Array.isArray(resourcesData) ? resourcesData : []);
        setErrors(prev => ({ ...prev, resources: null }));
      } catch (error) {
        console.error('Failed to load resources:', error);
        setErrors(prev => ({ ...prev, resources: error instanceof Error ? error.message : 'Failed to load resources' }));
        setResources([]);
      } finally {
        setLoading(prev => ({ ...prev, resources: false }));
      }

      // Load recommendations with timeout
      setLoading(prev => ({ ...prev, recommendations: true }));
      try {
        const recommendationsData = await Promise.race([
          CloudOptimizationAPI.getRecommendations(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 10000))
        ]);
        setRecommendations(recommendationsData as OptimizationSummary);
        setErrors(prev => ({ ...prev, recommendations: null }));
      } catch (error) {
        console.error('Failed to load recommendations:', error);
        setErrors(prev => ({ ...prev, recommendations: error instanceof Error ? error.message : 'Failed to load recommendations' }));
        setRecommendations(null);
      } finally {
        setLoading(prev => ({ ...prev, recommendations: false }));
      }

      setLastRefresh(new Date());
    } finally {
      if (showRefreshLoader) {
        setIsRefreshing(false);
      }
      setLoading(prev => ({ ...prev, analytics: false }));
    }
  };

  // Initial data load
  useEffect(() => {
    loadData();
  }, []);

  // Handle recommendation implementation
  const handleMarkImplemented = (resourceId: number, implemented: boolean) => {
    if (!recommendations) return;

    const updatedRecommendations = {
      ...recommendations,
      recommendations: recommendations.recommendations.map(rec => 
        rec.resource_id === resourceId 
          ? { ...rec, implemented }
          : rec
      )
    };

    setRecommendations(updatedRecommendations);
  };

  // Check if backend is available
  const checkBackendHealth = async () => {
    try {
      await CloudOptimizationAPI.checkHealth();
      return true;
    } catch {
      return false;
    }
  };

  // Refresh handler
  const handleRefresh = () => {
    loadData(true);
  };

  // Calculate summary data
  const summaryData = {
    totalResources: resources.length,
    totalMonthlyCost: recommendations?.total_monthly_cost || 0,
    totalPotentialSavings: recommendations?.total_potential_savings || 0,
    optimizationOpportunities: recommendations?.recommendations.filter(r => !r.implemented).length || 0,
    savingsPercentage: recommendations?.savings_percentage || 0
  };

  // Calculate data for components
  const data = {
    totalResources: resources.length,
    currentCost: recommendations?.total_monthly_cost || 0,
    optimizedCost: (recommendations?.total_monthly_cost || 0) - (recommendations?.total_potential_savings || 0),
    potentialSavings: recommendations?.total_potential_savings || 0,
    savingsPercentage: recommendations?.savings_percentage || 0,
    resources: resources,
    recommendations: recommendations?.recommendations || []
  };

  const hasAnyError = errors.resources || errors.recommendations || errors.analytics;
  const isAnyLoading = loading.resources || loading.recommendations || loading.analytics;

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center space-x-6 animate-slide-up">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl animate-float" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
              }}>
                <Cloud className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 style={{
                  fontSize: '1.75rem', 
                  fontWeight: '800', 
                  background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: '1.2',
                  marginBottom: '0.25rem'
                }}>
                  Cloud Infrastructure Optimization
                </h1>
                <p style={{
                  fontSize: '0.95rem', 
                  color: '#6b7280',
                  fontWeight: '600',
                  letterSpacing: '0.025em'
                }}>
                  Enterprise Cost Management Dashboard
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-8 animate-fade-scale">
              <div style={{
                fontSize: '0.875rem', 
                color: '#6b7280',
                fontWeight: '600',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                Last updated: {lastRefresh.toLocaleTimeString()}
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn-premium"
                style={{
                  opacity: isRefreshing ? 0.7 : 1,
                  cursor: isRefreshing ? 'not-allowed' : 'pointer'
                }}
              >
                <RefreshCw 
                  size={16} 
                  className={`${isRefreshing ? 'animate-spin' : ''}`} 
                />
                <span>Refresh</span>
              </button>
              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{
                  textDecoration: 'none'
                }}
              >
                <ExternalLink size={16} />
                <span>API Docs</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{
        paddingTop: '3rem', 
        paddingBottom: '3rem'
      }}>
        {/* Hero Section */}
        <div className="text-center mb-12 animate-slide-up" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'white',
            marginBottom: '1rem',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            AI-Powered Cloud Cost Optimization
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: '500',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Intelligent insights and recommendations to optimize your cloud infrastructure costs
          </p>
        </div>
        {/* Error Banner */}
        {hasAnyError && (
          <div style={{
            marginBottom: '1.5rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.75rem',
            padding: '1rem',
            boxShadow: '0 1px 3px rgba(239, 68, 68, 0.1)'
          }}>
            <div className="flex items-start space-x-3">
              <AlertCircle size={20} style={{color: '#dc2626', marginTop: '0.125rem'}} />
              <div>
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#991b1b',
                  marginBottom: '0.25rem'
                }}>
                  Some data could not be loaded
                </h3>
                <div style={{fontSize: '0.875rem', color: '#b91c1c'}}>
                  {errors.resources && <p>• Resources: {errors.resources}</p>}
                  {errors.recommendations && <p>• Recommendations: {errors.recommendations}</p>}
                  {errors.analytics && <p>• Analytics: {errors.analytics}</p>}
                </div>
                <button
                  onClick={() => checkBackendHealth()}
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#b91c1c',
                    textDecoration: 'underline',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Check backend server status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <SummaryCards 
          totalResources={data.totalResources}
          totalMonthlyCost={data.currentCost}
          totalPotentialSavings={data.potentialSavings}
          optimizationOpportunities={data.recommendations.filter(r => !r.implemented).length}
          savingsPercentage={data.savingsPercentage}
          isLoading={isAnyLoading}
        />

        {/* Content Grid - CSS Responsive */}
        <div className="content-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '2rem',
          marginTop: '2rem',
          alignItems: 'start'
        }}>
          {/* Resources Table */}
          <div className="premium-glass" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            willChange: 'transform',
            minHeight: '750px', // Increased minimum height
            maxHeight: 'calc(100vh - 200px)', // Better max height calculation
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexShrink: 0
            }}>
              <Server size={24} />
              Cloud Resources ({data.resources.length})
            </h3>
            <div style={{ 
              flex: 1, 
              overflow: 'auto',
              minHeight: 0,
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.3) transparent',
              position: 'relative'
            }}>
              {/* Scroll fade indicator at bottom */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '20px',
                background: 'linear-gradient(transparent, rgba(255,255,255,0.1))',
                pointerEvents: 'none',
                zIndex: 1
              }}></div>
              <ResourcesTable 
                resources={data.resources} 
                isLoading={loading.resources} 
                error={errors.resources} 
              />
            </div>
          </div>

          {/* Recommendations */}
          <div className="premium-glass" style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            willChange: 'transform',
            minHeight: '500px'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'white',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <TrendingUp size={24} />
              Optimization Recommendations ({data.recommendations.length})
            </h3>
            <Recommendations 
              recommendations={data.recommendations} 
              isLoading={loading.recommendations}
              error={errors.recommendations}
              onMarkImplemented={handleMarkImplemented}
            />
          </div>
        </div>

        {/* Loading State for Initial Load */}
        {isAnyLoading && resources.length === 0 && (
          <div className="card">
            <LoadingSpinner 
              size="lg" 
              message="Loading cloud infrastructure data..." 
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              © 2025 Cloud Infrastructure Optimization System
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <button className="hover:text-gray-900">Documentation</button>
              <button className="hover:text-gray-900">Support</button>
              <a href="http://localhost:8000/health" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                API Status
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
