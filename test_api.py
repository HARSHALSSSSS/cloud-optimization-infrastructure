"""
API Test Script - Demonstrates the working Cloud Infrastructure Optimization API
"""

import requests
import json
from datetime import datetime

def test_api_endpoints():
    """Test all API endpoints and display results beautifully."""
    
    base_url = "http://localhost:8000"
    
    print("🚀 Cloud Infrastructure Optimization API - Live Test")
    print("=" * 60)
    
    # Test 1: Health Check
    print("\n1️⃣ Health Check")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ API is healthy and running")
            data = response.json()
            print(f"   Status: {data['status']}")
            print(f"   Version: {data['version']}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health check error: {e}")
    
    # Test 2: Get All Resources
    print("\n2️⃣ Cloud Resources")
    try:
        response = requests.get(f"{base_url}/api/v1/resources")
        if response.status_code == 200:
            resources = response.json()
            print(f"✅ Found {len(resources)} cloud resources:")
            
            total_cost = 0
            for resource in resources:
                print(f"   📦 {resource['name']}: {resource['resource_type']} (${resource['monthly_cost']}/month)")
                if resource['cpu_utilization']:
                    print(f"      💻 CPU: {resource['cpu_utilization']}%, Memory: {resource['memory_utilization']}%")
                total_cost += resource['monthly_cost']
            
            print(f"\n   💰 Total Monthly Cost: ${total_cost}")
        else:
            print(f"❌ Failed to get resources: {response.status_code}")
    except Exception as e:
        print(f"❌ Resources error: {e}")
    
    # Test 3: Get Optimization Recommendations
    print("\n3️⃣ Optimization Recommendations")
    try:
        response = requests.get(f"{base_url}/api/v1/recommendations")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Optimization Analysis Complete:")
            print(f"   📊 Total Resources: {data['total_resources']}")
            print(f"   💰 Current Monthly Cost: ${data['total_monthly_cost']}")
            print(f"   💡 Potential Savings: ${data['total_potential_savings']}")
            print(f"   📈 Savings Percentage: {data['savings_percentage']}%")
            print(f"   🎯 Recommendations: {len(data['recommendations'])}")
            
            if data['recommendations']:
                print(f"\n   🔍 Detailed Recommendations:")
                for i, rec in enumerate(data['recommendations'], 1):
                    print(f"      {i}. {rec['resource_name']} - {rec['recommendation_type'].upper()}")
                    print(f"         💡 {rec['description']}")
                    print(f"         🎯 Action: {rec['recommended_action']}")
                    print(f"         💰 Estimated Savings: ${rec['estimated_savings']}")
                    print(f"         🎖️  Confidence: {rec['confidence_level']}")
                    print()
        else:
            print(f"❌ Failed to get recommendations: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"❌ Recommendations error: {e}")
    
    # Test 4: Cost Analytics
    print("\n4️⃣ Cost Analytics Summary")
    try:
        response = requests.get(f"{base_url}/api/v1/analytics/cost-summary")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Cost Analytics:")
            print(f"   💰 Total Monthly Cost: ${data['total_monthly_cost']}")
            print(f"   📦 Total Resources: {data['total_resources']}")
            
            print(f"\n   📊 Cost Breakdown by Type:")
            for resource_type, info in data['cost_by_type'].items():
                print(f"      {resource_type}: {info['count']} resources, ${info['cost']}/month")
            
            print(f"\n   🏢 Cost Breakdown by Provider:")
            for provider, info in data['cost_by_provider'].items():
                print(f"      {provider.upper()}: {info['count']} resources, ${info['cost']}/month")
            
            opt = data['optimization_potential']
            print(f"\n   🎯 Optimization Potential:")
            print(f"      Potential Savings: ${opt['potential_savings']}")
            print(f"      Savings Percentage: {opt['savings_percentage']}%")
            print(f"      Recommendations: {opt['recommendations_count']}")
        else:
            print(f"❌ Failed to get cost summary: {response.status_code}")
    except Exception as e:
        print(f"❌ Cost analytics error: {e}")
    
    print("\n" + "=" * 60)
    print("🎉 API Test Complete!")
    print(f"📚 Full API Documentation: {base_url}/docs")
    print(f"⚡ API Status: {base_url}/health")

if __name__ == "__main__":
    test_api_endpoints()
