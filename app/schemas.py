from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from enum import Enum

class ResourceType(str, Enum):
    COMPUTE = "compute"
    STORAGE = "storage"
    DATABASE = "database"
    CACHE = "cache"

class CloudProvider(str, Enum):
    AWS = "aws"
    AZURE = "azure"
    GCP = "gcp"

class CloudResourceBase(BaseModel):
    name: str = Field(..., description="Resource name")
    resource_type: ResourceType = Field(..., description="Type of resource")
    provider: CloudProvider = Field(..., description="Cloud provider")
    instance_type: str = Field(..., description="Instance type or specification")
    size: Optional[str] = Field(None, description="Size for storage resources")
    cpu_utilization: Optional[float] = Field(None, ge=0, le=100, description="CPU utilization percentage")
    memory_utilization: Optional[float] = Field(None, ge=0, le=100, description="Memory utilization percentage")
    storage_usage: Optional[float] = Field(None, ge=0, description="Storage usage in GB")
    monthly_cost: float = Field(..., gt=0, description="Monthly cost in USD")

class CloudResourceCreate(CloudResourceBase):
    pass

class CloudResourceResponse(CloudResourceBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True

class OptimizationRecommendation(BaseModel):
    resource_id: int
    resource_name: str
    current_cost: float
    recommendation_type: str
    description: str
    recommended_action: str
    estimated_savings: float
    confidence_level: str

class OptimizationSummary(BaseModel):
    total_resources: int
    total_monthly_cost: float
    total_potential_savings: float
    recommendations: List[OptimizationRecommendation]
    savings_percentage: float

class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None
