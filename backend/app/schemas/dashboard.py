from pydantic import BaseModel, Field, EmailStr, HttpUrl, condecimal
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum
from decimal import Decimal
from expense import ExpenseCategory

class MetricPeriod(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"

class DashboardMetrics(BaseModel):
    total_expenses: Decimal
    total_income: Decimal
    net_savings: Decimal
    period: MetricPeriod
    category_breakdown: Dict[ExpenseCategory, Decimal]
    top_merchants: List[Dict[str, Any]]
    spending_trends: List[Dict[str, Any]]
    budget_status: Dict[ExpenseCategory, Dict[str, Any]]

class BudgetLimit(BaseModel):
    user_id: int
    category: ExpenseCategory
    limit_amount: Decimal
    period: MetricPeriod
    alert_threshold: float = Field(default=0.8, ge=0.0, le=1.0)
