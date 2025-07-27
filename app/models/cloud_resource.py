from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base
import enum

class ResourceType(str, enum.Enum):
    COMPUTE = "compute"
    STORAGE = "storage"
    DATABASE = "database"
    CACHE = "cache"

class CloudProvider(str, enum.Enum):
    AWS = "aws"
    AZURE = "azure"
    GCP = "gcp"

class CloudResource(Base):
    __tablename__ = "cloud_resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    resource_type = Column(Enum(ResourceType), nullable=False)
    provider = Column(Enum(CloudProvider), nullable=False)
    instance_type = Column(String, nullable=False)
    size = Column(String)  # For storage resources
    cpu_utilization = Column(Float)  # Percentage
    memory_utilization = Column(Float)  # Percentage
    storage_usage = Column(Float)  # In GB
    monthly_cost = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<CloudResource(name='{self.name}', type='{self.resource_type}', cost=${self.monthly_cost})>"
