'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Question {
    id: string;
    question: string;
    metric_key: string;
    line: number;
    created_at: string;
}

interface Guest {
    id: string;
    name: string;
    stats: Record<string, number>;
    is_bets_locked: boolean;
}

export default function AdminPage() {
    const [pin, setPin] = useState('');
    const [unlocked, setUnlocked] = useState(false);

    const [questions, setQuestions] = useState<Question[]>([]);
    const [guests, setGuests] = useState<Guest[]>([]);

    // New Question Form
    const [newQ, setNewQ] = useState({ question: '', metric_key: 'total_bottles', line: 5.5 });

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === '1234' || pin === '69420') {
            setUnlocked(true);
            fetchData();
        } else {
            alert('Try again.');
        }
    };

    const fetchData = async () => {
        const { data: qData } = await supabase.from('party_questions').select('*').order('created_at');
        if (qData) setQuestions(qData);

        const { data: gData } = await supabase.from('party_guests').select('*').order('name');
        if (gData) setGuests(gData);
    };

    const addQuestion = async () => {
        if (!newQ.question) return;
        await supabase.from('party_questions').insert(newQ);
        setNewQ({ question: '', metric_key: 'total_bottles', line: 5.5 });
        fetchData();
    };

    // Question Editing State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingLine, setEditingLine] = useState<number>(0);

    const startEditing = (q: Question) => {
        setEditingId(q.id);
        setEditingLine(q.line);
    };

    const saveEditing = async () => {
        if (!editingId) return;
        await supabase.from('party_questions').update({ line: editingLine }).eq('id', editingId);
        setEditingId(null);
        fetchData();
    };

    const cancelEditing = () => {
        setEditingId(null);
    };

    const deleteQuestion = async (id: string) => {
        if (!confirm('Delete question?')) return;
        await supabase.from('party_questions').delete().eq('id', id);
        fetchData();
    };

    // Quick stat edit (Increment/Decrement)
    const updateGuestStat = async (guestId: string, metric: string, delta: number) => {
        const guest = guests.find(g => g.id === guestId);
        if (!guest) return;

        const currentStats = guest.stats || {};
        const val = (currentStats[metric] || 0) + delta;
        const newStats = { ...currentStats, [metric]: Math.max(0, val) };

        const { error } = await supabase.from('party_guests').update({ stats: newStats }).eq('id', guestId);
        if (!error) {
            // local update
            setGuests(prev => prev.map(g => g.id === guestId ? { ...g, stats: newStats } : g));
        }
    };

    if (!unlocked) {
        // ... (unlock screen remains same)
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-indigo-50 to-white">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-indigo-50">
                    <h1 className="text-2xl font-black mb-6 text-center text-indigo-900">Admin Access</h1>
                    <form onSubmit={handlePinSubmit} className="flex flex-col space-y-4">
                        <input
                            type="password"
                            value={pin} onChange={e => setPin(e.target.value)}
                            placeholder="Enter PIN"
                            className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-center text-lg font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-900"
                            autoFocus
                        />
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95">
                            Unlock Panel
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 pb-20 max-w-4xl mx-auto">
            <h1 className="text-3xl font-black mb-8 text-indigo-900 tracking-tight">Manage Party</h1>

            {/* Questions Section */}
            <section className="mb-10">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2 text-indigo-900">Questions / Bets</h2>
                <div className="space-y-4">
                    {questions.map(q => (
                        <div key={q.id} className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            {editingId === q.id ? (
                                <div className="flex-1 w-full space-y-2">
                                    <div className="font-bold text-gray-800">{q.question}</div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-500 text-sm font-bold">Line:</span>
                                        <input
                                            type="number"
                                            step="0.5"
                                            value={editingLine}
                                            onChange={(e) => setEditingLine(parseFloat(e.target.value))}
                                            className="p-2 border border-indigo-300 rounded-lg w-24 font-bold text-indigo-700"
                                        />
                                        <button onClick={saveEditing} className="bg-green-500 text-white px-3 py-2 rounded-lg font-bold text-xs shadow-sm shadow-green-200">SAVE</button>
                                        <button onClick={cancelEditing} className="bg-gray-200 text-gray-600 px-3 py-2 rounded-lg font-bold text-xs">CANCEL</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <div className="font-bold text-gray-800">{q.question}</div>
                                        <div className="text-xs text-gray-500 font-medium bg-gray-50 inline-block px-2 py-1 rounded mt-1">
                                            Key: <span className="font-mono text-indigo-600">{q.metric_key}</span> | Line: <span className="font-bold text-indigo-600">{q.line}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => startEditing(q)} className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center font-bold transition-colors">✎</button>
                                        <button onClick={() => deleteQuestion(q.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center font-bold transition-colors">✕</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    {/* Add New Question Form ... (remains mostly same but ensured styling) */}
                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                        <h3 className="text-sm font-bold text-indigo-900 mb-3 uppercase tracking-wide">Add New Question</h3>
                        <input
                            className="w-full p-3 mb-3 bg-white border border-indigo-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-800 placeholder:text-gray-400"
                            placeholder="Question (e.g. Total Bottles?)"
                            value={newQ.question}
                            onChange={e => setNewQ({ ...newQ, question: e.target.value })}
                        />
                        <div className="flex space-x-3 mb-3">
                            <input
                                className="w-1/2 p-3 bg-white border border-indigo-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-800 placeholder:text-gray-400"
                                placeholder="Key (e.g. bottles)"
                                value={newQ.metric_key}
                                onChange={e => setNewQ({ ...newQ, metric_key: e.target.value })}
                            />
                            <input
                                className="w-1/2 p-3 bg-white border border-indigo-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all text-gray-800 placeholder:text-gray-400"
                                type="number"
                                step="0.5"
                                placeholder="Line (e.g. 5.5)"
                                value={newQ.line}
                                onChange={e => setNewQ({ ...newQ, line: parseFloat(e.target.value) })}
                            />
                        </div>
                        <button onClick={addQuestion} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold text-sm shadow-sm transition-all active:scale-95">Add Question</button>
                    </div>
                </div>
            </section>

            {/* Global Counters Section */}
            <section className="mb-10">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2 text-indigo-900">Global Counters</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Bottles (Jordan) */}
                    {guests.find(g => g.name === 'Jordan') && (
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex flex-col items-center">
                            <span className="text-xs font-bold text-yellow-800 uppercase tracking-widest mb-2">Total Bottles</span>
                            <div className="flex items-center space-x-4">
                                <button onClick={() => updateGuestStat(guests.find(g => g.name === 'Jordan')!.id, 'bottles', -1)} className="w-10 h-10 rounded-full bg-white border border-yellow-300 text-yellow-600 font-black shadow-sm flex items-center justify-center active:scale-95">-</button>
                                <span className="text-4xl font-black text-yellow-900">{guests.reduce((acc, g) => acc + (Number(g.stats?.bottles) || 0), 0)}</span>
                                <button onClick={() => updateGuestStat(guests.find(g => g.name === 'Jordan')!.id, 'bottles', 1)} className="w-10 h-10 rounded-full bg-yellow-400 text-yellow-900 font-black shadow-md flex items-center justify-center active:scale-95">+</button>
                            </div>
                        </div>
                    )}

                    {/* Games (Victoria) */}
                    {guests.find(g => g.name === 'Victoria') && (
                        <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl flex flex-col items-center">
                            <span className="text-xs font-bold text-purple-800 uppercase tracking-widest mb-2">Games Played</span>
                            <div className="flex items-center space-x-4">
                                <button onClick={() => updateGuestStat(guests.find(g => g.name === 'Victoria')!.id, 'games', -1)} className="w-10 h-10 rounded-full bg-white border border-purple-300 text-purple-600 font-black shadow-sm flex items-center justify-center active:scale-95">-</button>
                                <span className="text-4xl font-black text-purple-900">{guests.reduce((acc, g) => acc + (Number(g.stats?.games) || 0), 0)}</span>
                                <button onClick={() => updateGuestStat(guests.find(g => g.name === 'Victoria')!.id, 'games', 1)} className="w-10 h-10 rounded-full bg-purple-400 text-white font-black shadow-md flex items-center justify-center active:scale-95">+</button>
                            </div>
                        </div>
                    )}

                    {/* Bowls (Mando) */}
                    {guests.find(g => g.name === 'Mando') && (
                        <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex flex-col items-center">
                            <span className="text-xs font-bold text-green-800 uppercase tracking-widest mb-2">Bowls</span>
                            <div className="flex items-center space-x-4">
                                <button onClick={() => updateGuestStat(guests.find(g => g.name === 'Mando')!.id, 'bowls', -1)} className="w-10 h-10 rounded-full bg-white border border-green-300 text-green-600 font-black shadow-sm flex items-center justify-center active:scale-95">-</button>
                                <span className="text-4xl font-black text-green-900">{guests.reduce((acc, g) => acc + (Number(g.stats?.bowls) || 0), 0)}</span>
                                <button onClick={() => updateGuestStat(guests.find(g => g.name === 'Mando')!.id, 'bowls', 1)} className="w-10 h-10 rounded-full bg-green-400 text-white font-black shadow-md flex items-center justify-center active:scale-95">+</button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Guest Stats Section */}
            <section>
                <h2 className="text-xl font-bold mb-4 border-b border-gray-200 pb-2 text-indigo-900">Guest Quick Actions</h2>
                <div className="space-y-2">
                    {guests
                        .filter(g => !['Jordan', 'Victoria', 'Mando'].includes(g.name)) // Optional: Hide special roles from general list if desired, or keep them. Let's hide to declutter.
                        .map(g => (
                            <div key={g.id} className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm flex justify-between items-center">
                                <div className="flex items-center space-x-2 w-32">
                                    <span className="font-bold truncate text-gray-800">{g.name}</span>
                                    {g.is_bets_locked && (
                                        <span title="Bets Locked" className="text-xs">🔒</span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-4">
                                    {/* Drinks */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] text-gray-400 font-bold tracking-wider">DRINKS</span>
                                        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                            <button onClick={() => updateGuestStat(g.id, 'drinks', -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded border border-gray-300 text-red-500 shadow-sm active:scale-95">-</button>
                                            <span className="w-8 text-center font-mono font-bold text-gray-800">{g.stats?.drinks || 0}</span>
                                            <button onClick={() => updateGuestStat(g.id, 'drinks', 1)} className="w-6 h-6 flex items-center justify-center bg-indigo-100 rounded border border-indigo-200 text-indigo-600 shadow-sm active:scale-95">+</button>
                                        </div>
                                    </div>
                                    {/* Water */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] text-gray-400 font-bold tracking-wider">WATER</span>
                                        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                            <button onClick={() => updateGuestStat(g.id, 'water', -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded border border-gray-300 text-red-500 shadow-sm active:scale-95">-</button>
                                            <span className="w-8 text-center font-mono font-bold text-gray-800">{g.stats?.water || 0}</span>
                                            <button onClick={() => updateGuestStat(g.id, 'water', 1)} className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded border border-blue-200 text-blue-600 shadow-sm active:scale-95">+</button>
                                        </div>
                                    </div>
                                    {/* Spills */}
                                    <div className="flex flex-col items-center">
                                        <span className="text-[10px] text-gray-400 font-bold tracking-wider">SPILLS</span>
                                        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                            <button onClick={() => updateGuestStat(g.id, 'spills', -1)} className="w-6 h-6 flex items-center justify-center bg-white rounded border border-gray-300 text-red-500 shadow-sm active:scale-95">-</button>
                                            <span className="w-8 text-center font-mono font-bold text-gray-800">{g.stats?.spills || 0}</span>
                                            <button onClick={() => updateGuestStat(g.id, 'spills', 1)} className="w-6 h-6 flex items-center justify-center bg-orange-100 rounded border border-orange-200 text-orange-600 shadow-sm active:scale-95">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </section>
        </div>
    );
}
