from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.cloud_resource import CloudResource
from app.schemas import CloudResourceResponse, OptimizationSummary, APIResponse
from app.services.optimization_service import OptimizationService

router = APIRouter(prefix="/api/v1", tags=["Cloud Resources"])

@router.get("/resources", response_model=List[CloudResourceResponse])
async def get_all_resources(db: Session = Depends(get_db)):
    """
    Get all cloud infrastructure resources with utilization data.
    
    Returns a comprehensive list of all cloud resources including:
    - Resource identification and specifications
    - Current utilization metrics
    - Cost information
    - Timestamps
    """
    try:
        resources = db.query(CloudResource).all()
        return resources
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving resources: {str(e)}"
        )

@router.get("/resources/{resource_id}", response_model=CloudResourceResponse)
async def get_resource_by_id(resource_id: int, db: Session = Depends(get_db)):
    """
    Get a specific cloud resource by ID.
    """
    try:
        resource = db.query(CloudResource).filter(CloudResource.id == resource_id).first()
        if not resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Resource with ID {resource_id} not found"
            )
        return resource
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving resource: {str(e)}"
        )

@router.get("/recommendations", response_model=OptimizationSummary)
async def get_optimization_recommendations(db: Session = Depends(get_db)):
    """
    Analyze cloud resources and return cost-saving optimization recommendations.
    
    This endpoint implements sophisticated optimization rules:
    - Over-provisioned instances: Recommends downsizing when CPU < 30% AND memory < 50%
    - Large storage volumes: Suggests optimization for storage > 500GB
    - Cost calculations: Provides estimated savings for each recommendation
    
    Returns:
    - Total cost analysis
    - Detailed recommendations with confidence levels
    - Potential savings calculations
    """
    try:
        optimization_service = OptimizationService()
        summary = optimization_service.analyze_resources(db)
        return summary
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating recommendations: {str(e)}"
        )

@router.get("/resources/{resource_id}/health", response_model=dict)
async def get_resource_health(resource_id: int, db: Session = Depends(get_db)):
    """
    Get health score and status for a specific resource.
    """
    try:
        resource = db.query(CloudResource).filter(CloudResource.id == resource_id).first()
        if not resource:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Resource with ID {resource_id} not found"
            )
        
        optimization_service = OptimizationService()
        health_data = optimization_service.get_resource_health_score(resource)
        
        return {
            "resource_id": resource_id,
            "resource_name": resource.name,
            "health_score": health_data["score"],
            "status": health_data["status"],
            "issues": health_data["issues"],
            "monthly_cost": resource.monthly_cost
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error calculating resource health: {str(e)}"
        )

@router.get("/analytics/cost-summary", response_model=dict)
async def get_cost_summary(db: Session = Depends(get_db)):
    """
    Get comprehensive cost analytics and summary.
    """
    try:
        resources = db.query(CloudResource).all()
        
        total_cost = sum(resource.monthly_cost for resource in resources)
        by_type = {}
        by_provider = {}
        
        for resource in resources:
            # Group by resource type
            if resource.resource_type not in by_type:
                by_type[resource.resource_type] = {"count": 0, "cost": 0}
            by_type[resource.resource_type]["count"] += 1
            by_type[resource.resource_type]["cost"] += resource.monthly_cost
            
            # Group by provider
            if resource.provider not in by_provider:
                by_provider[resource.provider] = {"count": 0, "cost": 0}
            by_provider[resource.provider]["count"] += 1
            by_provider[resource.provider]["cost"] += resource.monthly_cost
        
        # Get optimization potential
        optimization_service = OptimizationService()
        optimization_summary = optimization_service.analyze_resources(db)
        
        return {
            "total_monthly_cost": round(total_cost, 2),
            "total_resources": len(resources),
            "cost_by_type": by_type,
            "cost_by_provider": by_provider,
            "optimization_potential": {
                "potential_savings": optimization_summary.total_potential_savings,
                "savings_percentage": optimization_summary.savings_percentage,
                "recommendations_count": len(optimization_summary.recommendations)
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating cost summary: {str(e)}"
        )
