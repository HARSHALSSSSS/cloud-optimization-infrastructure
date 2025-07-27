"""
Debug script to test database connection and optimization service functionality.
"""

import sys
from pathlib import Path

# Add project root to Python path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root))

from app.database import SessionLocal
from app.models.cloud_resource import CloudResource
from app.services.optimization_service import OptimizationService

def debug_database():
    """Debug database connection and data."""
    print("🔍 Debugging Database Connection and Data...")
    
    db = SessionLocal()
    try:
        # Test basic database connection
        resources = db.query(CloudResource).all()
        print(f"✓ Database connection successful")
        print(f"✓ Found {len(resources)} resources in database")
        
        if len(resources) == 0:
            print("❌ No resources found in database!")
            return False
        
        # Display all resources
        print("\n📋 Resources in database:")
        for resource in resources:
            print(f"  - {resource.name}: {resource.resource_type.value}, ${resource.monthly_cost}/month")
            print(f"    CPU: {resource.cpu_utilization}%, Memory: {resource.memory_utilization}%")
        
        # Test optimization service
        print(f"\n🧠 Testing Optimization Service...")
        optimization_service = OptimizationService()
        summary = optimization_service.analyze_resources(db)
        
        print(f"✓ Optimization analysis completed")
        print(f"  - Total resources: {summary.total_resources}")
        print(f"  - Total monthly cost: ${summary.total_monthly_cost}")
        print(f"  - Total potential savings: ${summary.total_potential_savings}")
        print(f"  - Savings percentage: {summary.savings_percentage}%")
        print(f"  - Number of recommendations: {len(summary.recommendations)}")
        
        if len(summary.recommendations) > 0:
            print(f"\n💡 Recommendations:")
            for rec in summary.recommendations:
                print(f"  - {rec.resource_name}: {rec.recommendation_type}")
                print(f"    {rec.description}")
                print(f"    Savings: ${rec.estimated_savings}")
        else:
            print(f"❌ No recommendations generated!")
            
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    success = debug_database()
    if success:
        print(f"\n✅ Debug completed successfully!")
    else:
        print(f"\n❌ Debug failed - please check the issues above.")
