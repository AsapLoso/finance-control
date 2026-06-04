from pydantic import BaseModel, Field
from typing import Optional, Literal

class ExpenseBase(BaseModel):
    name: str = Field(..., min_length=1, description="Name of the expense")
    category: str = Field(..., description="Category like Housing or Insurance")
    subcategory: Optional[str] = Field(None, description="Specific subcategory")
    amount: float = Field(..., gt=0, description="Cost amount")
    frequency: Literal['Monthly', 'Yearly'] = Field(..., description="Payment frequency")
    description: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int

    class Config:
        from_attributes = True

class IncomeBase(BaseModel):
    name: str = Field(..., min_length=1, description="Name of the income source")
    amount: float = Field(..., gt=0, description="Income amount")
    category: str = Field(..., description="Category like Salary, Allowance, etc.")

class IncomeCreate(IncomeBase):
    pass

class Income(IncomeBase):
    id: int

    class Config:
        from_attributes = True
