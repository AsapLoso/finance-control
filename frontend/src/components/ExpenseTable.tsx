import React from 'react';

// Define the shape of our data (Rigid)
export interface Expense {
    id: number;
    name: string;
    category: string;
    subcategory: string | null;
    amount: number;
    frequency: 'Monthly' | 'Yearly';
    description: string | null;
}

interface ExpenseTableProps {
    expenses: Expense[];
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses }) => {
    const totalMonthlyFromMonthly = expenses
        .filter(e => e.frequency === 'Monthly')
        .reduce((sum, e) => sum + e.amount, 0);

    const totalMonthlyFromYearly = expenses
        .filter(e => e.frequency === 'Yearly')
        .reduce((sum, e) => sum + (e.amount / 12), 0);

    const totalMonthly = totalMonthlyFromMonthly + totalMonthlyFromYearly;

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Fixed Expenses</h2>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Monthly:</span>
                    <br />
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                        €{totalMonthly.toFixed(2)}
                    </span>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Frequency</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense.id}>
                            <td>
                                <div style={{ fontWeight: 500 }}>{expense.name}</div>
                                {expense.description && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        {expense.description}
                                    </div>
                                )}
                            </td>
                            <td>
                                {expense.category}
                                {expense.subcategory && <span style={{ opacity: 0.6 }}> / {expense.subcategory}</span>}
                            </td>
                            <td style={{ fontFamily: 'monospace', fontSize: '1rem' }}>
                                €{expense.amount.toFixed(2)}
                            </td>
                            <td>
                                <span className={`badge ${expense.frequency === 'Monthly' ? 'badge-monthly' : 'badge-yearly'}`}>
                                    {expense.frequency}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
