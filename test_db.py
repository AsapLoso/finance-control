import sqlite3
import unittest
import os

class TestDatabase(unittest.TestCase):
    def setUp(self):
        self.conn = sqlite3.connect(':memory:')
        self.cursor = self.conn.cursor()
        
        # Create table directly to test schema logic or read from file
        with open('schema.sql', 'r') as f:
            schema = f.read()
            self.cursor.executescript(schema)

    def tearDown(self):
        self.conn.close()

    def test_insert_valid_data(self):
        self.cursor.execute('''
            INSERT INTO fixed_expenses (name, category, subcategory, amount, frequency)
            VALUES ('Rent', 'Housing', 'Rent', 1000, 'Monthly')
        ''')
        self.conn.commit()
        
        self.cursor.execute("SELECT * FROM fixed_expenses WHERE name='Rent'")
        row = self.cursor.fetchone()
        self.assertIsNotNone(row)
        # frequency is the 6th column (index 5)
        self.assertEqual(row[5], 'Monthly')

    def test_invalid_frequency(self):
        with self.assertRaises(sqlite3.IntegrityError):
            self.cursor.execute('''
                INSERT INTO fixed_expenses (name, category, subcategory, amount, frequency)
                VALUES ('Bad', 'Housing', 'Rent', 1000, 'Daily')
            ''')

if __name__ == '__main__':
    unittest.main()
