import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, ExternalLink } from 'lucide-react';
import { CloudResource } from '../types/api';
import { 
  formatCurrency, 
  formatPercentage, 
  getUtilizationStatus, 
  getProviderInfo, 
  getResourceTypeInfo,
  debounce 
} from '../utils/helpers';

interface ResourcesTableProps {
  resources: CloudResource[];
  isLoading: boolean;
  error: string | null;
}

const ResourcesTable: React.FC<ResourcesTableProps> = ({
  resources,
  isLoading,
  error
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvider, setFilterProvider] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState<keyof CloudResource>('monthly_cost');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  // Filtered and sorted resources
  const filteredResources = useMemo(() => {
    let filtered = resources.filter(resource => {
      const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.instance_type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProvider = filterProvider === 'all' || resource.provider === filterProvider;
      const matchesType = filterType === 'all' || resource.resource_type === filterType;
      
      return matchesSearch && matchesProvider && matchesType;
    });

    // Sort resources
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [resources, searchTerm, filterProvider, filterType, sortField, sortDirection]);

  const handleSort = (field: keyof CloudResource) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortableHeader: React.FC<{ field: keyof CloudResource; children: React.ReactNode }> = ({ 
    field, 
    children 
  }) => (
    <th 
      style={{
        padding: '0.75rem 1.5rem',
        textAlign: 'left',
        fontSize: '0.75rem',
        fontWeight: '500',
        color: 'white',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        userSelect: 'none'
      }}
      onClick={() => handleSort(field)}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.25rem' 
      }}>
        <span>{children}</span>
        <ChevronDown 
          size={16} 
          style={{
            transform: `rotate(${
              sortField === field 
                ? sortDirection === 'asc' ? '180deg' : '0deg'
                : '0deg'
            })`,
            transition: 'transform 0.2s ease',
            opacity: sortField === field ? 1 : 0.5
          }}
        />
      </div>
    </th>
  );

  if (error) {
    return (
      <div className="card p-8">
        <div className="text-center">
          <div className="text-danger-600 mb-4">
            <ExternalLink size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Resources</h3>
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
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '15px',
      padding: '0',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: '1px solid rgba(229, 231, 235, 0.3)',
        flexShrink: 0
      }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '0.25rem' 
            }}>
              Cloud Resources
            </h2>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280' 
            }}>
              {filteredResources.length} of {resources.length} resources
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                style={{
                  paddingLeft: '2.5rem',
                  paddingRight: '1rem',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  width: '200px'
                }}
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>
            
            {/* Provider Filter */}
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none',
                minWidth: '140px'
              }}
            >
              <option value="all">All Providers</option>
              <option value="aws">AWS</option>
              <option value="azure">Azure</option>
              <option value="gcp">GCP</option>
            </select>
            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                outline: 'none',
                minWidth: '120px'
              }}
            >
              <option value="all">All Types</option>
              <option value="compute">Compute</option>
              <option value="storage">Storage</option>
              <option value="database">Database</option>
              <option value="cache">Cache</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div style={{ 
          padding: '1.5rem',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="animate-pulse" style={{ width: '100%' }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                paddingTop: '1rem', 
                paddingBottom: '1rem' 
              }}>
                <div style={{ 
                  height: '1rem', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '0.25rem', 
                  width: '25%' 
                }}></div>
                <div style={{ 
                  height: '1rem', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '0.25rem', 
                  width: '16.666%' 
                }}></div>
                <div style={{ 
                  height: '1rem', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '0.25rem', 
                  width: '16.666%' 
                }}></div>
                <div style={{ 
                  height: '1rem', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '0.25rem', 
                  width: '16.666%' 
                }}></div>
                <div style={{ 
                  height: '1rem', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '0.25rem', 
                  width: '16.666%' 
                }}></div>
                <div style={{ 
                  height: '1rem', 
                  backgroundColor: '#e5e7eb', 
                  borderRadius: '0.25rem', 
                  width: '16.666%' 
                }}></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ 
          overflowX: 'auto',
          overflowY: 'auto',
          flex: 1,
          minHeight: '450px', // Ensure minimum scrollable area
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(102, 126, 234, 0.3) rgba(255, 255, 255, 0.1)'
        }}>
          <table style={{
            width: '100%',
            minWidth: '800px',
            borderCollapse: 'collapse'
          }}>
            <thead style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              <tr>
                <SortableHeader field="name">Resource Name</SortableHeader>
                <SortableHeader field="resource_type">Type</SortableHeader>
                <SortableHeader field="provider">Provider</SortableHeader>
                <SortableHeader field="instance_type">Instance Type</SortableHeader>
                <th style={{
                  padding: '0.75rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Utilization
                </th>
                <SortableHeader field="monthly_cost">Monthly Cost</SortableHeader>
                <th style={{
                  padding: '0.75rem 1.5rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: 'white' }}>
              {filteredResources.map((resource, index) => {
                const utilizationStatus = getUtilizationStatus(resource);
                const providerInfo = getProviderInfo(resource.provider);
                const typeInfo = getResourceTypeInfo(resource.resource_type);

                return (
                  <tr 
                    key={resource.id} 
                    style={{
                      backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      borderBottom: '1px solid #e5e7eb'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e0f2fe';
                      e.currentTarget.style.transform = 'translateX(2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f8fafc' : '#ffffff';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <td style={{ 
                      padding: '1rem 1.5rem', 
                      whiteSpace: 'nowrap',
                      verticalAlign: 'middle'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '0.75rem'
                      }}>
                        <span style={{ fontSize: '1.5rem' }}>{typeInfo.icon}</span>
                        <div>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '0.25rem'
                          }}>
                            {resource.name}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6b7280'
                          }}>
                            ID: {resource.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td style={{ 
                      padding: '1rem 1.5rem', 
                      whiteSpace: 'nowrap',
                      verticalAlign: 'middle'
                    }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {typeInfo.name}
                      </span>
                    </td>
                    
                    <td style={{ 
                      padding: '1rem 1.5rem', 
                      whiteSpace: 'nowrap',
                      verticalAlign: 'middle'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backgroundColor: providerInfo.bgColorClass === 'bg-orange-100' ? '#fed7aa' : 
                                       providerInfo.bgColorClass === 'bg-blue-100' ? '#dbeafe' : '#dcfce7',
                        color: providerInfo.colorClass === 'text-orange-600' ? '#ea580c' :
                               providerInfo.colorClass === 'text-blue-600' ? '#2563eb' : '#16a34a'
                      }}>
                        {providerInfo.name}
                      </span>
                    </td>
                    
                    <td style={{ 
                      padding: '1rem 1.5rem',
                      fontSize: '0.875rem',
                      color: '#1f2937',
                      verticalAlign: 'middle'
                    }}>
                      <div>
                        {resource.instance_type}
                        {resource.size && (
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6b7280',
                            marginTop: '0.125rem'
                          }}>
                            {resource.size}
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td style={{ 
                      padding: '1rem 1.5rem',
                      fontSize: '0.875rem',
                      color: '#1f2937',
                      verticalAlign: 'middle'
                    }}>
                      {resource.cpu_utilization !== null && resource.cpu_utilization !== undefined && 
                       resource.memory_utilization !== null && resource.memory_utilization !== undefined ? (
                        <div>
                          <div style={{ marginBottom: '0.125rem' }}>
                            CPU: {formatPercentage(resource.cpu_utilization)}
                          </div>
                          <div style={{ marginBottom: '0.125rem' }}>
                            Memory: {formatPercentage(resource.memory_utilization)}
                          </div>
                          {resource.storage_usage && (
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#6b7280'
                            }}>
                              Storage: {resource.storage_usage}GB
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#6b7280', fontStyle: 'italic' }}>N/A</span>
                      )}
                    </td>
                    
                    <td style={{ 
                      padding: '1rem 1.5rem',
                      fontWeight: '700',
                      fontSize: '1rem',
                      color: '#dc2626',
                      verticalAlign: 'middle'
                    }}>
                      {formatCurrency(resource.monthly_cost)}
                    </td>
                    
                    <td style={{ 
                      padding: '1rem 1.5rem', 
                      whiteSpace: 'nowrap',
                      verticalAlign: 'middle'
                    }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        textTransform: 'capitalize',
                        backgroundColor: utilizationStatus.bgColor === 'bg-green-100' ? '#dcfce7' :
                                       utilizationStatus.bgColor === 'bg-yellow-100' ? '#fef3c7' :
                                       utilizationStatus.bgColor === 'bg-red-100' ? '#fee2e2' : '#f3f4f6',
                        color: utilizationStatus.color === 'text-green-600' ? '#16a34a' :
                               utilizationStatus.color === 'text-yellow-600' ? '#ca8a04' :
                               utilizationStatus.color === 'text-red-600' ? '#dc2626' : '#6b7280'
                      }}>
                        {utilizationStatus.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredResources.length === 0 && !isLoading && (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1.5rem',
              backgroundColor: 'white'
            }}>
              <Filter size={48} style={{
                color: '#9ca3af',
                margin: '0 auto 1rem auto'
              }} />
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '500',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}>
                No resources found
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem'
              }}>
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourcesTable;
