import requests
import sys

def check_system():
    print("🔍 Checking Cloud Infrastructure Optimization System")
    print("=" * 50)
    
    # Check Backend
    try:
        r = requests.get('http://localhost:8000/api/v1/resources', timeout=3)
        print(f"✅ Backend API: Running (Status: {r.status_code})")
        resources = r.json()
        print(f"   📊 Resources: {len(resources)} found")
    except Exception:
        print("❌ Backend API: Not accessible")
        return False
    
    # Check Recommendations
    try:
        r = requests.get('http://localhost:8000/api/v1/recommendations', timeout=3)
        data = r.json()
        print(f"✅ Optimization Engine: Working")
        print(f"   💡 Recommendations: {len(data['recommendations'])}")
        print(f"   💰 Monthly Cost: ${data['total_monthly_cost']}")
        print(f"   💾 Potential Savings: ${data['total_potential_savings']}")
    except Exception:
        print("❌ Optimization Engine: Error")
        return False
    
    # Check Frontend
    try:
        r = requests.get('http://localhost:3000', timeout=3)
        if r.status_code == 200:
            print("✅ Frontend Dashboard: Running")
        else:
            print(f"⚠️ Frontend Dashboard: Status {r.status_code}")
    except Exception:
        print("❌ Frontend Dashboard: Not accessible")
        return False
    
    print("\n🎉 System Status: ALL SERVICES OPERATIONAL")
    print("\n🚀 Access your dashboard at: http://localhost:3000")
    print("📖 API Documentation: http://localhost:8000/docs")
    return True

if __name__ == "__main__":
    check_system()
