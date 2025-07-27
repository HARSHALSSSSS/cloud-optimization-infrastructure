import pytest
from app.services.optimization_service import OptimizationService
from app.models.cloud_resource import CloudResource, ResourceType, CloudProvider

def test_optimization_service_initialization():
    """Test that OptimizationService initializes correctly."""
    service = OptimizationService()
    assert service.downsizing_savings is not None
    assert service.storage_optimization_rate == 0.3

def test_calculate_downsizing_savings():
    """Test downsizing savings calculation."""
    service = OptimizationService()
    
    # Create a test resource
    resource = CloudResource(
        name="test-server",
        resource_type=ResourceType.COMPUTE,
        provider=CloudProvider.AWS,
        instance_type="t3.xlarge",
        cpu_utilization=15.0,
        memory_utilization=25.0,
        monthly_cost=150.0
    )
    
    savings = service._calculate_downsizing_savings(resource)
    assert savings > 0

def test_resource_health_score():
    """Test resource health score calculation."""
    service = OptimizationService()
    
    # Test over-provisioned resource
    over_provisioned = CloudResource(
        name="over-provisioned",
        resource_type=ResourceType.COMPUTE,
        provider=CloudProvider.AWS,
        instance_type="t3.xlarge",
        cpu_utilization=15.0,
        memory_utilization=25.0,
        monthly_cost=150.0
    )
    
    health = service.get_resource_health_score(over_provisioned)
    assert health["score"] < 100
    assert health["status"] == "over-provisioned"
    assert len(health["issues"]) > 0
    
    # Test well-utilized resource
    well_utilized = CloudResource(
        name="well-utilized",
        resource_type=ResourceType.COMPUTE,
        provider=CloudProvider.AWS,
        instance_type="m5.xlarge",
        cpu_utilization=75.0,
        memory_utilization=85.0,
        monthly_cost=180.0
    )
    
    health = service.get_resource_health_score(well_utilized)
    assert health["score"] >= 85
    assert health["status"] == "optimal"
