from pydantic import BaseModel, Field, EmailStr, HttpUrl, condecimal
from typing import List, Optional, Dict, Any, Union
from datetime import datetime
from enum import Enum
from decimal import Decimal

class TransactionType(str, Enum):
    EXPENSE = "expense"
    INCOME = "income"

class PlaidCredentials(BaseModel):
    user_id: int
    access_token: str
    item_id: str
    institution_id: str
    institution_name: str

class PlaidTransaction(BaseModel):
    transaction_id: str
    account_id: str
    amount: Decimal
    date: datetime
    name: str
    merchant_name: Optional[str] = None
    category: List[str]
    pending: bool
    transaction_type: TransactionType

class PlaidAccount(BaseModel):
    account_id: str
    name: str
    type: str
    subtype: str
    balance_available: Optional[Decimal] = None
    balance_current: Decimal
    balance_limit: Optional[Decimal] = None
