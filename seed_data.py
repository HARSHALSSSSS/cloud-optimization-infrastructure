"""
Database seeding script to populate the cloud_resources table with sample data.
This script creates the exact resources specified in the requirements.
"""

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.cloud_resource import CloudResource, ResourceType, CloudProvider, Base
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_sample_data():
    """Create sample cloud resources data as specified in requirements."""
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_count = db.query(CloudResource).count()
        if existing_count > 0:
            logger.info(f"Database already contains {existing_count} resources. Skipping seed data creation.")
            return
        
        # Over-provisioned instances
        over_provisioned_resources = [
            CloudResource(
                name="web-server-1",
                resource_type=ResourceType.COMPUTE,
                provider=CloudProvider.AWS,
                instance_type="t3.xlarge",
                cpu_utilization=15.0,
                memory_utilization=25.0,
                monthly_cost=150.0
            ),
            CloudResource(
                name="api-server-2",
                resource_type=ResourceType.COMPUTE,
                provider=CloudProvider.AWS,
                instance_type="m5.large",
                cpu_utilization=12.0,
                memory_utilization=30.0,
                monthly_cost=90.0
            ),
            CloudResource(
                name="worker-3",
                resource_type=ResourceType.COMPUTE,
                provider=CloudProvider.AZURE,
                instance_type="Standard_D2s_v3",
                cpu_utilization=8.0,
                memory_utilization=20.0,
                monthly_cost=70.0
            )
        ]
        
        # Well-utilized instances
        well_utilized_resources = [
            CloudResource(
                name="database-1",
                resource_type=ResourceType.DATABASE,
                provider=CloudProvider.AWS,
                instance_type="m5.xlarge",
                cpu_utilization=75.0,
                memory_utilization=85.0,
                monthly_cost=180.0
            ),
            CloudResource(
                name="cache-server",
                resource_type=ResourceType.CACHE,
                provider=CloudProvider.GCP,
                instance_type="n1-standard-2",
                cpu_utilization=65.0,
                memory_utilization=70.0,
                monthly_cost=50.0
            )
        ]
        
        # Storage resources
        storage_resources = [
            # Under-utilized storage
            CloudResource(
                name="backup-storage",
                resource_type=ResourceType.STORAGE,
                provider=CloudProvider.AWS,
                instance_type="EBS gp3",
                size="1000GB",
                storage_usage=1000.0,
                monthly_cost=100.0
            ),
            CloudResource(
                name="log-storage",
                resource_type=ResourceType.STORAGE,
                provider=CloudProvider.AWS,
                instance_type="EBS gp3",
                size="500GB",
                storage_usage=500.0,
                monthly_cost=75.0
            ),
            # Well-utilized storage
            CloudResource(
                name="database-storage",
                resource_type=ResourceType.STORAGE,
                provider=CloudProvider.AWS,
                instance_type="EBS gp3",
                size="200GB",
                storage_usage=200.0,
                monthly_cost=25.0
            )
        ]
        
        # Combine all resources
        all_resources = over_provisioned_resources + well_utilized_resources + storage_resources
        
        # Add resources to database
        for resource in all_resources:
            db.add(resource)
        
        db.commit()
        
        logger.info(f"Successfully created {len(all_resources)} sample resources:")
        for resource in all_resources:
            logger.info(f"  - {resource.name} ({resource.resource_type.value}, ${resource.monthly_cost}/month)")
        
        # Calculate and display summary
        total_cost = sum(r.monthly_cost for r in all_resources)
        logger.info(f"\nTotal monthly cost: ${total_cost}")
        
        # Display resource breakdown
        by_type = {}
        for resource in all_resources:
            if resource.resource_type not in by_type:
                by_type[resource.resource_type] = {"count": 0, "cost": 0}
            by_type[resource.resource_type]["count"] += 1
            by_type[resource.resource_type]["cost"] += resource.monthly_cost
        
        logger.info("\nResource breakdown:")
        for resource_type, data in by_type.items():
            logger.info(f"  - {resource_type.value}: {data['count']} resources, ${data['cost']}/month")
            
    except Exception as e:
        logger.error(f"Error creating sample data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Starting database seeding...")
    create_sample_data()
    logger.info("Database seeding completed successfully!")
