import React, { useState, useEffect } from 'react';
import {
    Home,
    ShieldAlert,
    Plus,
    Trash2,
    Car,
    Wifi,
    PiggyBank,
    ArrowDownCircle,
    ArrowUpCircle,
    Landmark,
    Calendar,
    Wallet
} from 'lucide-react';

const API_URL = window.location.port === '5173' ? 'http://127.0.0.1:8000' : '';

interface Item {
    id: number;
    name: string;
    amount: number;
    category: string;
    frequency?: string;
    subcategory?: string;
    description?: string;
}

const FinanceDashboard = () => {
    // --- STATE ---

    // 1. INKOMSTEN (Loon, Toeslagen, Teruggaven)
    const [incomes, setIncomes] = useState<Item[]>([]);

    // 2. VASTE MAANDELIJKSE LASTEN
    const [expenses, setExpenses] = useState<Item[]>([]);

    // 3. JAARLIJKSE KOSTEN (Lijst, geen sliders meer)
    const [annualExpenses, setAnnualExpenses] = useState<Item[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    // UI State
    const [showAddModal, setShowAddModal] = useState(false);
    const [modalType, setModalType] = useState('expense'); // 'income', 'expense', 'annual'
    const [newItem, setNewItem] = useState({ name: '', amount: '', category: 'Wonen' });

    // --- DATA FETCHING ---
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [expRes, incRes] = await Promise.all([
                fetch(`${API_URL}/expenses`),
                fetch(`${API_URL}/incomes`)
            ]);

            const expData = await expRes.json();
            const incData = await incRes.json();

            setIncomes(incData);

            // Split expenses into monthly and yearly
            setExpenses(expData.filter((e: any) => e.frequency === 'Monthly'));
            setAnnualExpenses(expData.filter((e: any) => e.frequency === 'Yearly'));

        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Heartbeat to keep backend alive
    useEffect(() => {
        const sendHeartbeat = () => {
            fetch(`${API_URL}/heartbeat`, { method: 'POST' }).catch((err) => {
                console.warn("Failed to send heartbeat:", err);
            });
        };

        // Send immediately
        sendHeartbeat();

        // Send every 3 seconds
        const interval = setInterval(sendHeartbeat, 3000);

        return () => clearInterval(interval);
    }, []);

    // --- BEREKENINGEN ---

    // Totalen
    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
    const totalMonthlyBills = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalAnnualCost = annualExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    // De cruciale berekening: Jaarbedrag / 12 = Reservering per maand
    const monthlyReservation = totalAnnualCost / 12;

    // Totale maandelijkse 'Outflow' (Rekeningen + Reservering)
    const totalOutflow = totalMonthlyBills + monthlyReservation;

    // Vrij te besteden (De "Bottom Line")
    const leftToSpend = totalIncome - totalOutflow;

    // Categorie Definities voor UI
    const expenseCategories: { [key: string]: { color: string, icon: React.ReactNode } } = {
        Wonen: { color: 'bg-blue-100 text-blue-600', icon: <Home size={18} /> },
        Verzekeringen: { color: 'bg-purple-100 text-purple-600', icon: <ShieldAlert size={18} /> },
        Vervoer: { color: 'bg-orange-100 text-orange-600', icon: <Car size={18} /> },
        Abonnementen: { color: 'bg-pink-100 text-pink-600', icon: <Wifi size={18} /> },
        // Fallback for others
        Other: { color: 'bg-gray-100 text-gray-600', icon: <Landmark size={18} /> }
    };

    // --- HANDLERS ---

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Replace comma with dot for international support
            const cleanAmount = newItem.amount.replace(',', '.');
            const amountValue = parseFloat(cleanAmount);

            if (isNaN(amountValue)) {
                alert("Voer een geldig bedrag in.");
                return;
            }

            let res;
            if (modalType === 'income') {
                res = await fetch(`${API_URL}/incomes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: newItem.name,
                        amount: amountValue,
                        category: newItem.category
                    })
                });
            } else {
                // Expenses (Monthly or Annual)
                const frequency = modalType === 'annual' ? 'Yearly' : 'Monthly';
                res = await fetch(`${API_URL}/expenses`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: newItem.name,
                        amount: amountValue,
                        category: newItem.category,
                        frequency: frequency,
                        subcategory: newItem.category // Simple default
                    })
                });
            }

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || "Er is iets misgegaan bij het opslaan.");
            }

            await fetchData(); // Refresh all
            setShowAddModal(false);
            setNewItem({ name: '', amount: '', category: 'Wonen' });

        } catch (error: any) {
            console.error("Error adding item:", error);
            alert("Fout bij toevoegen: " + error.message);
        }
    };

    const deleteItem = async (id: number, type: string) => {
        try {
            if (type === 'income') {
                await fetch(`${API_URL}/incomes/${id}`, { method: 'DELETE' });
            } else {
                // expense or annual (both are expenses in DB)
                await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' });
            }
            fetchData();
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    const openModal = (type: string) => {
        setModalType(type);
        setNewItem({ name: '', amount: '', category: type === 'income' ? 'Loon' : 'Wonen' });
        setShowAddModal(true);
    };

    if (isLoading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">

            {/* Top Nav */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
                    <span className="text-xl font-bold text-slate-800">Finance<span className="text-indigo-600">.Control</span></span>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">

                {/* --- KPI HEADER --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

                    {/* KPI 1: Income */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                            <ArrowUpCircle size={14} className="text-emerald-500" /> Totaal Inkomen
                        </span>
                        <div className="text-2xl font-bold text-slate-800 mt-2">€ {totalIncome.toLocaleString()}</div>
                    </div>

                    {/* KPI 2: Fixed Bills */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                            <ArrowDownCircle size={14} className="text-slate-400" /> Vaste Lasten
                        </span>
                        <div className="text-2xl font-bold text-slate-800 mt-2">€ {totalMonthlyBills.toLocaleString()}</div>
                    </div>

                    {/* KPI 3: Reservations */}
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm flex flex-col justify-between">
                        <span className="text-blue-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                            <PiggyBank size={14} /> Reservering (p/m)
                        </span>
                        <div className="text-2xl font-bold text-blue-900 mt-2">€ {Math.ceil(monthlyReservation).toLocaleString()}</div>
                        <div className="text-xs text-blue-400">Voor jaarlijkse kosten</div>
                    </div>

                    {/* KPI 4: Free to Spend (Big One) */}
                    <div className="bg-indigo-600 p-5 rounded-xl border border-indigo-500 shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute right-[-10px] top-[-10px] opacity-10"><Wallet size={80} /></div>
                        <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Vrij te Besteden</span>
                        <div className="text-3xl font-bold mt-2">€ {Math.floor(leftToSpend).toLocaleString()}</div>
                        <div className="text-xs text-indigo-300">Na alle rekeningen & reserveringen</div>
                    </div>
                </div>

                {/* --- MAIN GRID --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* COLUMN 1: INKOMSTEN (Green Theme) */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <ArrowUpCircle size={20} className="text-emerald-500" /> Inkomsten
                            </h2>
                            <button onClick={() => openModal('income')} className="p-1 hover:bg-slate-200 rounded text-slate-500"><Plus size={18} /></button>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            {incomes.map(item => (
                                <div key={item.id} className="flex items-center justify-between px-5 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 group">
                                    <div>
                                        <div className="font-medium text-slate-700">{item.name}</div>
                                        <div className="text-xs text-slate-400">{item.category}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-emerald-600">+ €{item.amount}</span>
                                        <button onClick={() => deleteItem(item.id, 'income')} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                            {incomes.length === 0 && <div className="p-4 text-sm text-slate-400 text-center">Nog geen inkomsten toegevoegd.</div>}
                        </div>
                    </div>

                    {/* COLUMN 2: MAANDELIJKSE LASTEN (Multi-Color Theme) */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <ArrowDownCircle size={20} className="text-slate-500" /> Maandelijkse Uitgaven
                            </h2>
                            <button onClick={() => openModal('expense')} className="p-1 hover:bg-slate-200 rounded text-slate-500"><Plus size={18} /></button>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
                            {/* We group them nicely just by mapping, sorting could be added here */}
                            {Object.keys(expenseCategories).map(catKey => {
                                const catItems = expenses.filter(e => e.category === catKey);
                                if (catItems.length === 0) return null;

                                return (
                                    <div key={catKey}>
                                        <div className="bg-slate-50/50 px-5 py-2 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                            {expenseCategories[catKey].icon} {catKey}
                                        </div>
                                        {catItems.map(item => (
                                            <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 group transition">
                                                <span className="text-sm font-medium text-slate-700">{item.name}</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-slate-800">€{item.amount}</span>
                                                    <button onClick={() => deleteItem(item.id, 'expense')} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            })}
                            {/* Items without specific category */}
                            {expenses.filter(e => !expenseCategories[e.category]).length > 0 && (
                                <div>
                                    <div className="bg-slate-50/50 px-5 py-2 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                        {expenseCategories['Other'].icon} Overig
                                    </div>
                                    {expenses.filter(e => !expenseCategories[e.category]).map(item => (
                                        <div key={item.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 group transition">
                                            <span className="text-sm font-medium text-slate-700">{item.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-slate-800">€{item.amount}</span>
                                                <button onClick={() => deleteItem(item.id, 'expense')} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLUMN 3: JAARLIJKSE KOSTEN (Blue/Reservation Theme) */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Calendar size={20} className="text-blue-500" /> Jaarlijkse Kosten
                            </h2>
                            <button onClick={() => openModal('annual')} className="p-1 hover:bg-slate-200 rounded text-slate-500"><Plus size={18} /></button>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full max-h-[500px]">
                            <div className="p-5 bg-blue-50 border-b border-blue-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-blue-800 text-sm font-medium">Totaal per jaar</span>
                                    <span className="text-blue-900 font-bold">€ {totalAnnualCost.toLocaleString()}</span>
                                </div>
                                <div className="text-xs text-blue-600">
                                    Dit betekent dat je <span className="font-bold underline">€{Math.ceil(monthlyReservation)}</span> per maand apart moet zetten om deze rekeningen te betalen wanneer ze komen.
                                </div>
                            </div>

                            <div className="overflow-y-auto flex-1">
                                {annualExpenses.map(item => (
                                    <div key={item.id} className="flex items-center justify-between px-5 py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 group">
                                        <div>
                                            <div className="font-medium text-slate-700">{item.name}</div>
                                            <div className="text-xs text-slate-400">Eén keer per jaar</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-slate-600">€{item.amount}</span>
                                            <button onClick={() => deleteItem(item.id, 'annual')} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                                {annualExpenses.length === 0 && <div className="p-6 text-sm text-slate-400 text-center">Geen jaarlijkse kosten. <br /> Voeg gemeentebelasting of eigen risico toe.</div>}
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* --- UNIFIED ADD MODAL --- */}
            {showAddModal && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                            {modalType === 'income' && <><ArrowUpCircle className="text-emerald-500" /> Inkomsten Toevoegen</>}
                            {modalType === 'expense' && <><ArrowDownCircle className="text-slate-500" /> Uitgave Toevoegen</>}
                            {modalType === 'annual' && <><Calendar className="text-blue-500" /> Jaarlijkse Kost Toevoegen</>}
                        </h3>

                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Omschrijving</label>
                                <input
                                    required
                                    type="text"
                                    placeholder={modalType === 'annual' ? "Bijv. Gemeentebelasting" : "Bijv. Salaris"}
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Bedrag (€) {modalType === 'annual' ? 'per jaar' : 'per maand'}
                                </label>
                                <input
                                    required
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0,00"
                                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={newItem.amount}
                                    onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
                                />
                            </div>

                            {/* Category Select - Only for Income/Expense */}
                            {modalType === 'expense' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Categorie</label>
                                    <select
                                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    >
                                        <option value="Wonen">🏠 Wonen & Energie</option>
                                        <option value="Verzekeringen">🛡️ Verzekeringen</option>
                                        <option value="Vervoer">🚗 Vervoer</option>
                                        <option value="Abonnementen">📱 Abonnementen</option>
                                        <option value="Overig">✨ Overig</option>
                                    </select>
                                </div>
                            )}

                            {modalType === 'income' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                    <select
                                        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    >
                                        <option value="Loon">💼 Loon</option>
                                        <option value="Toeslagen">🏛️ Toeslagen</option>
                                        <option value="Teruggaven">💰 Teruggaven</option>
                                        <option value="Overig">✨ Overig</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition"
                                >
                                    Annuleren
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                                >
                                    Toevoegen
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default FinanceDashboard;
