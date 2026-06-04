import sqlite3
import os

DB_NAME = 'expenses.db'
SCHEMA_FILE = 'schema.sql'

def init_db():
    if os.path.exists(DB_NAME):
        os.remove(DB_NAME) # Start fresh for this example
    
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    
    with open(SCHEMA_FILE, 'r') as f:
        schema = f.read()
        cursor.executescript(schema)
    
    # Insert sample data
    # Insert sample expenses
    expenses = [
        ('Rent', 'Housing', 'Rent', 1500.00, 'Monthly', 'Monthly apartment rent'),
        ('Energy', 'Housing', 'Energy', 150.00, 'Monthly', 'Gas and Electricity'),
        ('Water', 'Housing', 'Water', 30.00, 'Monthly', 'Water bill'),
        ('Taxes', 'Housing', 'Taxes', 400.00, 'Yearly', 'Municipal taxes'),
        ('Health Insurance', 'Insurance', 'Health/Zorg', 130.00, 'Monthly', 'Basic health insurance'),
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
    print(f"Database '{DB_NAME}' initialized with {len(expenses)} expenses and {len(incomes)} incomes.")
    
    # Verify
    print("\nExpenses:")
    cursor.execute("SELECT * FROM fixed_expenses")
    for row in cursor.fetchall():
        print(row)

    print("\nIncomes:")
    cursor.execute("SELECT * FROM incomes")
    for row in cursor.fetchall():
        print(row)
        
    conn.close()

if __name__ == '__main__':
    init_db()
