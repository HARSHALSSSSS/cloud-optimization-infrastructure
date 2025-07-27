from typing import List, Dict
from sqlalchemy.orm import Session
from app.models.cloud_resource import CloudResource, ResourceType
from app.schemas import OptimizationRecommendation, OptimizationSummary

class OptimizationService:
    """
    Service class for analyzing cloud resources and generating optimization recommendations.
    """
    
    def __init__(self):
        # Cost reduction multipliers for different optimization types
        self.downsizing_savings = {
            "t3.xlarge": {"to": "t3.large", "savings": 50},
            "m5.large": {"to": "m5.medium", "savings": 45},
            "Standard_D2s_v3": {"to": "Standard_D2s_v2", "savings": 35},
        }
        
        # Storage optimization rates
        self.storage_optimization_rate = 0.3  # 30% potential savings
    
    def analyze_resources(self, db: Session) -> OptimizationSummary:
        """
        Analyze all resources and generate comprehensive optimization recommendations.
        """
        resources = db.query(CloudResource).all()
        recommendations = []
        total_cost = sum(resource.monthly_cost for resource in resources)
        total_savings = 0
        
        for resource in resources:
            resource_recommendations = self._analyze_single_resource(resource)
            recommendations.extend(resource_recommendations)
            total_savings += sum(rec.estimated_savings for rec in resource_recommendations)
        
        savings_percentage = (total_savings / total_cost * 100) if total_cost > 0 else 0
        
        return OptimizationSummary(
            total_resources=len(resources),
            total_monthly_cost=total_cost,
            total_potential_savings=total_savings,
            recommendations=recommendations,
            savings_percentage=round(savings_percentage, 2)
        )
    
    def _analyze_single_resource(self, resource: CloudResource) -> List[OptimizationRecommendation]:
        """
        Analyze a single resource and generate recommendations.
        """
        recommendations = []
        
        # Check for over-provisioned compute instances
        if resource.resource_type in [ResourceType.COMPUTE, ResourceType.DATABASE, ResourceType.CACHE]:
            if (resource.cpu_utilization and resource.memory_utilization and 
                resource.cpu_utilization < 30 and resource.memory_utilization < 50):
                
                savings = self._calculate_downsizing_savings(resource)
                recommendations.append(
                    OptimizationRecommendation(
                        resource_id=resource.id,
                        resource_name=resource.name,
                        current_cost=resource.monthly_cost,
                        recommendation_type="downsize",
                        description=f"Over-provisioned instance with {resource.cpu_utilization}% CPU and {resource.memory_utilization}% memory utilization",
                        recommended_action=f"Downsize from {resource.instance_type} to a smaller instance type",
                        estimated_savings=savings,
                        confidence_level="high"
                    )
                )
        
        # Check for large storage volumes
        if resource.resource_type == ResourceType.STORAGE:
            if resource.storage_usage and resource.storage_usage > 500:
                savings = resource.monthly_cost * self.storage_optimization_rate
                recommendations.append(
                    OptimizationRecommendation(
                        resource_id=resource.id,
                        resource_name=resource.name,
                        current_cost=resource.monthly_cost,
                        recommendation_type="storage_optimization",
                        description=f"Large storage volume of {resource.storage_usage}GB detected",
                        recommended_action="Consider archiving old data or using cheaper storage tiers",
                        estimated_savings=round(savings, 2),
                        confidence_level="medium"
                    )
                )
        
        # Check for unused or underutilized resources
        if (resource.cpu_utilization and resource.cpu_utilization < 10 and 
            resource.memory_utilization and resource.memory_utilization < 20):
            
            recommendations.append(
                OptimizationRecommendation(
                    resource_id=resource.id,
                    resource_name=resource.name,
                    current_cost=resource.monthly_cost,
                    recommendation_type="terminate",
                    description=f"Severely underutilized resource with {resource.cpu_utilization}% CPU usage",
                    recommended_action="Consider terminating this resource if not needed",
                    estimated_savings=resource.monthly_cost * 0.8,  # 80% savings if terminated
                    confidence_level="medium"
                )
            )
        
        return recommendations
    
    def _calculate_downsizing_savings(self, resource: CloudResource) -> float:
        """
        Calculate potential savings from downsizing a resource.
        """
        if resource.instance_type in self.downsizing_savings:
            savings_amount = self.downsizing_savings[resource.instance_type]["savings"]
            return savings_amount
        
        # Default savings estimate based on typical downsizing (25-40% cost reduction)
        return resource.monthly_cost * 0.35
    
    def get_resource_health_score(self, resource: CloudResource) -> Dict:
        """
        Calculate a health score for a resource based on utilization metrics.
        """
        score = 100
        status = "optimal"
        issues = []
        
        if resource.cpu_utilization:
            if resource.cpu_utilization < 20:
                score -= 30
                issues.append("Low CPU utilization")
                status = "over-provisioned"
            elif resource.cpu_utilization > 80:
                score -= 20
                issues.append("High CPU utilization")
                status = "under-provisioned"
        
        if resource.memory_utilization:
            if resource.memory_utilization < 30:
                score -= 25
                issues.append("Low memory utilization")
                if status != "under-provisioned":
                    status = "over-provisioned"
            elif resource.memory_utilization > 85:
                score -= 15
                issues.append("High memory utilization")
                status = "under-provisioned"
        
        return {
            "score": max(score, 0),
            "status": status,
            "issues": issues
        }
