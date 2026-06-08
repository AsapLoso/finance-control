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

def initialize_database():
    """Initializes the database schema and seeds sample data if empty."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    # Create tables if they do not exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS fixed_expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            subcategory TEXT,
            amount DECIMAL(10, 2) NOT NULL,
            frequency TEXT CHECK(frequency IN ('Monthly', 'Yearly')) NOT NULL,
            description TEXT
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS incomes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category TEXT NOT NULL
        )
    ''')
    
    # Check if empty to seed sample data
    cursor.execute("SELECT COUNT(*) FROM fixed_expenses")
    expense_count = cursor.fetchone()[0]
    cursor.execute("SELECT COUNT(*) FROM incomes")
    income_count = cursor.fetchone()[0]
    
    if expense_count == 0 and income_count == 0:
        print("Database is empty. Seeding sample data...")
        # Insert sample expenses
        expenses = [
            ('Rent', 'Housing', 'Rent', 1500.00, 'Monthly', 'Monthly apartment rent'),
            ('Energy', 'Housing', 'Energy', 180.00, 'Monthly', 'Gas and Electricity'),
            ('Water', 'Housing', 'Water', 30.00, 'Monthly', 'Water bill'),
            ('Taxes', 'Housing', 'Taxes', 460.00, 'Yearly', 'Municipal taxes'),
            ('Health Insurance', 'Insurance', 'Health/Zorg', 145.00, 'Monthly', 'Basic health insurance'),
            ('Contents Insurance', 'Insurance', 'Contents/Inboedel', 120.00, 'Yearly', 'Home contents insurance'),
            ('Liability Insurance', 'Insurance', 'Liability', 45.00, 'Yearly', 'Personal liability insurance')
        ]
        cursor.executemany('''
            INSERT INTO fixed_expenses (name, category, subcategory, amount, frequency, description)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', expenses)
        
        # Insert sample incomes
        incomes = [
            ('Salaris Werkgever', 2800.00, 'Loon'),
            ('Zorgtoeslag', 123.00, 'Toeslagen'),
            ('Voorlopige Aanslag (HRA)', 150.00, 'Teruggaven')
        ]
        cursor.executemany('''
            INSERT INTO incomes (name, amount, category)
            VALUES (?, ?, ?)
        ''', incomes)
        
    conn.commit()
    conn.close()

# Auto-initialize database on import
try:
    initialize_database()
except Exception as e:
    print(f"ERROR: Failed to initialize database: {e}")

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
