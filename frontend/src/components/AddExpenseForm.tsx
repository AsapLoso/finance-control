import React, { useState } from 'react';

interface ExpenseCreate {
    name: string;
    category: string;
    subcategory: string;
    amount: string; // Use string for input handling, convert to number on submit
    frequency: 'Monthly' | 'Yearly';
    description: string;
}

interface AddExpenseFormProps {
    onAdd: (expense: any) => Promise<void>;
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onAdd }) => {
    const [formData, setFormData] = useState<ExpenseCreate>({
        name: '',
        category: 'Housing',
        subcategory: '',
        amount: '',
        frequency: 'Monthly',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.amount) return;

        await onAdd({
            ...formData,
            subcategory: formData.subcategory || null,
            description: formData.description || null,
            amount: parseFloat(formData.amount)
        });

        // Reset form on success (optional, keeping it simple)
        setFormData({
            name: '',
            category: 'Housing',
            subcategory: '',
            amount: '',
            frequency: 'Monthly',
            description: ''
        });
    };

    return (
        <div className="card">
            <h2>Add New Expense</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Health Insurance"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <input
                            type="text"
                            list="categories"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            required
                        />
                        <datalist id="categories">
                            <option value="Housing" />
                            <option value="Insurance" />
                            <option value="Subscriptions" />
                            <option value="Transport" />
                        </datalist>
                    </div>
                </div>

                <div className="grid">
                    <div className="form-group">
                        <label>Subcategory (Optional)</label>
                        <input
                            type="text"
                            value={formData.subcategory}
                            onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                            placeholder="e.g. Rent"
                        />
                    </div>
                    <div className="form-group">
                        <label>Amount (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                <div className="grid">
                    <div className="form-group">
                        <label>Frequency</label>
                        <select
                            value={formData.frequency}
                            onChange={e => setFormData({ ...formData, frequency: e.target.value as 'Monthly' | 'Yearly' })}
                        >
                            <option value="Monthly">Monthly</option>
                            <option value="Yearly">Yearly</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                <button type="submit">Add Expense</button>
            </form>
        </div>
    );
};
