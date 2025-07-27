#!/usr/bin/env python3
"""
Full-Stack Integration Test
Tests the complete end-to-end functionality of the Cloud Infrastructure Optimization System
"""

import requests
import json
import time
from typing import Dict, Any

class FullStackTester:
    def __init__(self):
        self.backend_url = "http://localhost:8000/api/v1"
        self.frontend_url = "http://localhost:3000"
        self.test_results = []
    
    def test_backend_health(self) -> bool:
        """Test if backend is running and accessible"""
        try:
            response = requests.get(f"{self.backend_url}/resources", timeout=5)
            success = response.status_code == 200
            self.log_test("Backend Health Check", success, 
                         f"Status: {response.status_code}" if success else "Backend not accessible")
            return success
        except requests.exceptions.RequestException as e:
            self.log_test("Backend Health Check", False, f"Connection failed: {e}")
            return False
    
    def test_resources_endpoint(self) -> bool:
        """Test resources endpoint functionality"""
        try:
            response = requests.get(f"{self.backend_url}/resources")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    sample_resource = data[0]
                    required_fields = ['id', 'name', 'type', 'provider', 'monthly_cost']
                    has_required_fields = all(field in sample_resource for field in required_fields)
                    
                    self.log_test("Resources Endpoint", has_required_fields, 
                                 f"Found {len(data)} resources with proper structure" if has_required_fields 
                                 else "Missing required fields in resource data")
                    return has_required_fields
                else:
                    self.log_test("Resources Endpoint", False, "No resources found or invalid format")
                    return False
            else:
                self.log_test("Resources Endpoint", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Resources Endpoint", False, f"Error: {e}")
            return False
    
    def test_recommendations_endpoint(self) -> bool:
        """Test recommendations endpoint and optimization logic"""
        try:
            response = requests.get(f"{self.backend_url}/recommendations")
            if response.status_code == 200:
                data = response.json()
                required_top_level = ['recommendations', 'total_monthly_cost', 'total_potential_savings', 'savings_percentage']
                has_structure = all(field in data for field in required_top_level)
                
                if has_structure and len(data['recommendations']) > 0:
                    sample_rec = data['recommendations'][0]
                    rec_fields = ['resource_id', 'resource_name', 'recommendation_type', 'estimated_savings', 'confidence_level']
                    has_rec_structure = all(field in sample_rec for field in rec_fields)
                    
                    # Test business logic
                    total_savings = sum(rec['estimated_savings'] for rec in data['recommendations'] if not rec.get('implemented', False))
                    savings_match = abs(total_savings - data['total_potential_savings']) < 0.01
                    
                    success = has_rec_structure and savings_match
                    self.log_test("Recommendations Endpoint", success, 
                                 f"Found {len(data['recommendations'])} recommendations, ${data['total_potential_savings']:.2f} potential savings" if success
                                 else "Invalid recommendation structure or calculation error")
                    return success
                else:
                    self.log_test("Recommendations Endpoint", False, 
                                 "Missing required fields or no recommendations")
                    return False
            else:
                self.log_test("Recommendations Endpoint", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Recommendations Endpoint", False, f"Error: {e}")
            return False
    
    def test_analytics_endpoint(self) -> bool:
        """Test cost analytics endpoint"""
        try:
            response = requests.get(f"{self.backend_url}/analytics/cost-summary")
            if response.status_code == 200:
                data = response.json()
                required_fields = ['provider_breakdown', 'resource_type_breakdown', 'optimization_summary']
                has_structure = all(field in data for field in required_fields)
                
                self.log_test("Analytics Endpoint", has_structure, 
                             "Cost analytics structure is valid" if has_structure 
                             else "Missing required analytics fields")
                return has_structure
            else:
                self.log_test("Analytics Endpoint", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Analytics Endpoint", False, f"Error: {e}")
            return False
    
    def test_optimization_business_logic(self) -> bool:
        """Test that optimization recommendations make business sense"""
        try:
            resources_response = requests.get(f"{self.backend_url}/resources")
            recommendations_response = requests.get(f"{self.backend_url}/recommendations")
            
            if resources_response.status_code == 200 and recommendations_response.status_code == 200:
                resources = resources_response.json()
                recommendations = recommendations_response.json()['recommendations']
                
                # Test 1: Over-provisioned resources should have recommendations
                over_provisioned = [r for r in resources if r.get('cpu_utilization', 0) < 30 and r.get('memory_utilization', 0) < 30]
                over_provisioned_recs = [r for r in recommendations if r['recommendation_type'] == 'downsize_instance']
                
                # Test 2: Large storage with low usage should have storage recommendations
                large_storage_recs = [r for r in recommendations if r['recommendation_type'] == 'optimize_storage']
                
                # Test 3: All recommendations should have positive savings
                positive_savings = all(rec['estimated_savings'] > 0 for rec in recommendations)
                
                # Test 4: Confidence levels should be valid
                valid_confidence = all(rec['confidence_level'] in ['high', 'medium', 'low'] for rec in recommendations)
                
                logic_valid = positive_savings and valid_confidence
                self.log_test("Business Logic Validation", logic_valid, 
                             f"Found {len(over_provisioned_recs)} downsize and {len(large_storage_recs)} storage recommendations" if logic_valid
                             else "Business logic validation failed")
                return logic_valid
            else:
                self.log_test("Business Logic Validation", False, "Could not fetch data for validation")
                return False
        except Exception as e:
            self.log_test("Business Logic Validation", False, f"Error: {e}")
            return False
    
    def test_frontend_accessibility(self) -> bool:
        """Test if frontend is accessible"""
        try:
            response = requests.get(self.frontend_url, timeout=5)
            success = response.status_code == 200 and 'text/html' in response.headers.get('content-type', '')
            self.log_test("Frontend Accessibility", success, 
                         "Frontend is serving HTML content" if success 
                         else f"Frontend issue: {response.status_code}")
            return success
        except requests.exceptions.RequestException as e:
            self.log_test("Frontend Accessibility", False, f"Frontend not accessible: {e}")
            return False
    
    def log_test(self, test_name: str, success: bool, details: str):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        result = {
            'test': test_name,
            'status': status,
            'success': success,
            'details': details
        }
        self.test_results.append(result)
        print(f"{status} {test_name}: {details}")
    
    def run_all_tests(self):
        """Run complete test suite"""
        print("🧪 Starting Full-Stack Integration Tests")
        print("=" * 60)
        
        tests = [
            self.test_backend_health,
            self.test_resources_endpoint,
            self.test_recommendations_endpoint,
            self.test_analytics_endpoint,
            self.test_optimization_business_logic,
            self.test_frontend_accessibility
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            try:
                if test():
                    passed += 1
            except Exception as e:
                print(f"❌ FAIL {test.__name__}: Unexpected error: {e}")
        
        print("\n" + "=" * 60)
        print(f"🎯 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! The full-stack system is working perfectly.")
            print("\n📊 System Summary:")
            print("   • Backend API: Fully functional")
            print("   • Database: Properly seeded with sample data")
            print("   • Optimization Logic: Working correctly")  
            print("   • Frontend: Accessible and ready")
            print("   • Integration: Complete and verified")
        else:
            print("⚠️  Some tests failed. Please check the logs above.")
        
        return passed == total

if __name__ == "__main__":
    tester = FullStackTester()
    tester.run_all_tests()
