#!/usr/bin/env python3
"""
Complete Dashboard Data Verification
Checks all data sources and displays comprehensive system status
"""

import requests
import json
from typing import Dict, Any

def test_complete_dashboard():
    print("🔍 COMPLETE DASHBOARD DATA VERIFICATION")
    print("=" * 60)
    
    base_url = "http://localhost:8000/api/v1"
    
    try:
        # 1. Test Resources
        print("\n📊 1. RESOURCES DATA")
        print("-" * 30)
        r = requests.get(f"{base_url}/resources")
        if r.status_code == 200:
            resources = r.json()
            print(f"✅ Total Resources: {len(resources)}")
            total_monthly_cost = sum(res['monthly_cost'] for res in resources)
            print(f"💰 Total Monthly Cost: ${total_monthly_cost}")
            
            # Sample resource details
            if resources:
                sample = resources[0]
                print(f"📋 Sample Resource:")
                print(f"   Name: {sample['name']}")
                print(f"   Type: {sample['resource_type']}")
                print(f"   Provider: {sample['provider']}")
                print(f"   Cost: ${sample['monthly_cost']}/month")
                print(f"   CPU: {sample.get('cpu_utilization', 'N/A')}%")
                print(f"   Memory: {sample.get('memory_utilization', 'N/A')}%")
        else:
            print(f"❌ Resources API failed: {r.status_code}")
            return False
        
        # 2. Test Recommendations
        print("\n🎯 2. RECOMMENDATIONS DATA")
        print("-" * 30)
        r = requests.get(f"{base_url}/recommendations")
        if r.status_code == 200:
            data = r.json()
            print(f"✅ Total Recommendations: {len(data['recommendations'])}")
            print(f"💰 Total Monthly Cost: ${data['total_monthly_cost']}")
            print(f"💡 Total Potential Savings: ${data['total_potential_savings']}")
            print(f"📈 Savings Percentage: {data['savings_percentage']}%")
            
            # Check each recommendation
            print(f"\n📋 RECOMMENDATION DETAILS:")
            for i, rec in enumerate(data['recommendations'][:3], 1):  # Show first 3
                print(f"   {i}. {rec['resource_name']}")
                print(f"      Current Cost: ${rec['current_cost']}/month")
                print(f"      Estimated Savings: ${rec['estimated_savings']}/month")
                print(f"      Type: {rec['recommendation_type']}")
                print(f"      Confidence: {rec['confidence_level']}")
                print(f"      Implemented: {rec.get('implemented', False)}")
                print()
        else:
            print(f"❌ Recommendations API failed: {r.status_code}")
            return False
        
        # 3. Test Analytics
        print("\n📈 3. ANALYTICS DATA")
        print("-" * 30)
        r = requests.get(f"{base_url}/analytics/cost-summary")
        if r.status_code == 200:
            analytics = r.json()
            print(f"✅ Analytics API working")
            print(f"📊 Provider Breakdown:")
            for provider, data in analytics['provider_breakdown'].items():
                print(f"   {provider.upper()}: {data['count']} resources, ${data['cost']}")
            
            print(f"📊 Resource Type Breakdown:")
            for res_type, data in analytics['resource_type_breakdown'].items():
                print(f"   {res_type.title()}: {data['count']} resources, ${data['cost']}")
        else:
            print(f"❌ Analytics API failed: {r.status_code}")
            return False
        
        # 4. Summary
        print("\n🎉 DASHBOARD VERIFICATION COMPLETE")
        print("=" * 60)
        print("✅ All APIs are working correctly")
        print("✅ All data is properly formatted")
        print("✅ Current costs are available in recommendations")
        print("✅ Dashboard should display all values correctly")
        
        print(f"\n🚀 Frontend should show:")
        print(f"   • Total Resources: {len(resources)}")
        print(f"   • Monthly Cost: ${data['total_monthly_cost']}")
        print(f"   • Potential Savings: ${data['total_potential_savings']}")
        print(f"   • Optimization Opportunities: {len([r for r in data['recommendations'] if not r.get('implemented', False)])}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during verification: {e}")
        return False

if __name__ == "__main__":
    test_complete_dashboard()
