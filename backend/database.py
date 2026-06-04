import sqlite3
from typing import List, Optional
from models import Expense, ExpenseCreate, Income, IncomeCreate

import os

import sys

# Use absolute path to avoid CWD confusion
if getattr(sys, 'frozen', False):
    # Running inside PyInstaller single-file .exe
    BASE_DIR = os.path.dirname(sys.executable)
else:
    # Running as Python script
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DB_NAME = os.path.join(BASE_DIR, 'expenses.db')
print(f"DEBUG: Database path is {DB_NAME}")


def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def create_expense(expense: ExpenseCreate) -> Expense:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        '''INSERT INTO fixed_expenses (name, category, subcategory, amount, frequency, description)
           VALUES (?, ?, ?, ?, ?, ?)''',
        (expense.name, expense.category, expense.subcategory, expense.amount, expense.frequency, expense.description)
    )
    expense_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return Expense(id=expense_id, **expense.dict())

def get_expenses() -> List[Expense]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM fixed_expenses")
    rows = cursor.fetchall()
    conn.close()
    
    return [Expense(
        id=row['id'],
        name=row['name'],
        category=row['category'],
        subcategory=row['subcategory'],
        amount=row['amount'],
        frequency=row['frequency'],
        description=row['description']
    ) for row in rows]

def delete_expense(expense_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM fixed_expenses WHERE id = ?", (expense_id,))
    conn.commit()
    conn.close()

def create_income(income: IncomeCreate) -> Income:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        '''INSERT INTO incomes (name, amount, category)
           VALUES (?, ?, ?)''',
        (income.name, income.amount, income.category)
    )
    income_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return Income(id=income_id, **income.dict())

def get_incomes() -> List[Income]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM incomes")
    rows = cursor.fetchall()
    conn.close()
    
    return [Income(
        id=row['id'],
        name=row['name'],
        amount=row['amount'],
        category=row['category']
    ) for row in rows]

def delete_income(income_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM incomes WHERE id = ?", (income_id,))
    conn.commit()
    conn.close()
