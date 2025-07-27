import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

client = TestClient(app)

def test_root_endpoint():
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert data["version"] == "1.0.0"

def test_health_check():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "message" in data

def test_get_all_resources():
    """Test getting all resources."""
    response = client.get("/api/v1/resources")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_optimization_recommendations():
    """Test getting optimization recommendations."""
    response = client.get("/api/v1/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert "total_resources" in data
    assert "total_monthly_cost" in data
    assert "total_potential_savings" in data
    assert "recommendations" in data
    assert "savings_percentage" in data

def test_get_cost_summary():
    """Test getting cost analytics summary."""
    response = client.get("/api/v1/analytics/cost-summary")
    assert response.status_code == 200
    data = response.json()
    assert "total_monthly_cost" in data
    assert "total_resources" in data
    assert "cost_by_type" in data
    assert "cost_by_provider" in data
    assert "optimization_potential" in data

def test_nonexistent_resource():
    """Test getting a non-existent resource."""
    response = client.get("/api/v1/resources/99999")
    assert response.status_code == 404
