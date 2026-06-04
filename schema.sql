CREATE TABLE IF NOT EXISTS fixed_expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g., 'Housing', 'Insurance'
    subcategory TEXT,       -- e.g., 'Rent', 'Health'
    amount DECIMAL(10, 2) NOT NULL,
    frequency TEXT CHECK(frequency IN ('Monthly', 'Yearly')) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL -- e.g., 'Salary', 'Allowance'
);
