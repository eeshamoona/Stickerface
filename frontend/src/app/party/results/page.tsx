'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ResultsPage() {
    const [betResults, setBetResults] = useState<any[]>([]);
    const [globalStats, setGlobalStats] = useState<any>({});
    const [awards, setAwards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchResults() {
            // 1. Fetch Data
            const { data: guests } = await supabase.from('party_guests').select('*');
            const { data: questions } = await supabase.from('party_questions').select('*');

            if (!guests || !questions) {
                setLoading(false);
                return;
            }

            // 2. Global Aggregates
            const actuals: Record<string, number> = {};
            actuals['bottles'] = guests.reduce((sum, g) => sum + (Number(g.stats?.bottles) || 0), 0);
            actuals['games'] = guests.reduce((sum, g) => sum + (Number(g.stats?.games) || 0), 0);
            actuals['bowls'] = guests.reduce((sum, g) => sum + (Number(g.stats?.bowls) || 0), 0);
            actuals['total_bottles'] = actuals['bottles'];
            actuals['games_played'] = actuals['games'];
            actuals['total_bowls'] = actuals['bowls'];

            setGlobalStats(actuals);

            // 3. Calculate Awards
            // Helper to find max stat guest
            const findWinner = (statKey: string) => {
                const sorted = [...guests].sort((a, b) => (b.stats?.[statKey] || 0) - (a.stats?.[statKey] || 0));
                if (sorted[0]?.stats?.[statKey] > 0) return sorted[0];
                return null;
            };

            const awardsData = [
                { title: 'Water Winner', icon: '💧', guest: findWinner('water'), stat: 'water', color: 'bg-blue-100 text-blue-600' },
                { title: 'Heavyweight Champ', icon: '🍺', guest: findWinner('drinks'), stat: 'drinks', color: 'bg-yellow-100 text-yellow-800' },
            ].filter(a => a.guest); // Only show if there is a winner

            setAwards(awardsData);

            // 4. Calculate Bets
            const results: any[] = [];
            guests.forEach(guest => {
                if (!guest.my_bets) return;
                questions.forEach(q => {
                    const bet = guest.my_bets[q.id];
                    if (!bet) return;
                    const actualValue = actuals[q.metric_key] || 0;

                    let isWin = false;
                    if (bet === 'OVER' && actualValue > q.line) isWin = true;
                    if (bet === 'UNDER' && actualValue < q.line) isWin = true;

                    results.push({
                        id: `${guest.id}-${q.id}`,
                        guestName: guest.name,
                        question: q.question,
                        prediction: bet,
                        actual: actualValue,
                        line: q.line,
                        isWin
                    });
                });
            });

            setBetResults(results);
            setLoading(false);
        }

        fetchResults();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="text-4xl mb-4">🎉</div>
                    <div className="text-gray-400 font-bold uppercase tracking-widest text-sm">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-100 p-4 shadow-sm mb-6">
                <h1 className="text-2xl font-black tracking-tighter">
                    THE RESULTS
                </h1>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Official Post-Game Report</p>
            </div>

            <div className="px-4 max-w-lg mx-auto space-y-8">

                {/* 1. Global Ticker */}
                <section>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white border border-yellow-100 p-4 rounded-2xl shadow-sm text-center">
                            <span className="text-4xl font-black text-yellow-400 block mb-1">{globalStats.bottles}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-400">Bottles Emptied</span>
                        </div>
                        <div className="bg-white border border-purple-100 p-4 rounded-2xl shadow-sm text-center">
                            <span className="text-4xl font-black text-purple-400 block mb-1">{globalStats.games}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-400">Games Played</span>
                        </div>
                        <div className="bg-white border border-green-100 p-4 rounded-2xl shadow-sm text-center">
                            <span className="text-4xl font-black text-green-400 block mb-1">{globalStats.bowls}</span>
                            <span className="text-[10px] uppercase font-bold text-gray-400">Bowls Smoked</span>
                        </div>
                    </div>
                </section>

                {/* 2. Awards Podium */}
                {awards.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold text-gray-800 mb-4 px-1">🏆 Hall of Fame</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {awards.map((award, i) => (
                                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 ${award.color} font-black`}>
                                        {award.icon}
                                    </div>
                                    <div className="font-bold text-gray-900 leading-tight mb-1">{award.guest.name}</div>
                                    <div className="text-xs text-gray-500 font-medium mb-2">{award.title}</div>
                                    <div className="text-xs font-black bg-gray-50 px-2 py-1 rounded text-gray-600">
                                        {award.guest.stats[award.stat]} {award.stat}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 3. Betting Results */}
                <section>
                    <h2 className="text-lg font-bold text-gray-800 mb-4 px-1">Your Bets</h2>
                    {betResults.length === 0 ? (
                        <div className="p-8 bg-white rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
                            No bets were settled.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {betResults.sort((a, b) => a.guestName.localeCompare(b.guestName)).map((res) => (
                                <div
                                    key={res.id}
                                    className={`bg-white p-4 rounded-2xl shadow-sm border ${res.isWin ? 'border-green-200' : 'border-red-200'} flex items-center justify-between`}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-bold text-gray-900">{res.question}</span>
                                            {res.isWin ? (
                                                <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full">WIN</span>
                                            ) : (
                                                <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full">LOSS</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500 leading-snug pr-2">
                                            <span className="font-medium">Bet:</span> <strong className="text-gray-700">{res.prediction} {res.line}</strong>
                                            <br />
                                            <span className="font-medium">Actual:</span> <strong className="text-gray-700">{res.actual}</strong>
                                        </div>
                                    </div>
                                    <div className="text-2xl ml-4">
                                        {res.isWin ? '✅' : '❌'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
