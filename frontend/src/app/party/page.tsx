'use client';

import { useEffect, useState } from 'react';
import { usePartyAuth } from '@/context/PartyAuthContext';
import { GuestSelector } from '@/components/party/GuestSelector';
import { supabase } from '@/lib/supabase';

interface PartyGuest {
    id: string;
    name: string;
    avatar_url: string | null;
    is_admin: boolean;
    is_bets_locked: boolean;
    stats: Record<string, number>; // JSONB
    my_bets: Record<string, 'OVER' | 'UNDER'>; // JSONB
}

interface PartyQuestion {
    id: string;
    question: string;
    metric_key: string;
    line: number;
}

export default function PartyPage() {
    const { guestId, login, isLoading: authLoading } = usePartyAuth();
    const [activeTab, setActiveTab] = useState<'LEADERBOARD' | 'HYDRATION' | 'BETS'>('LEADERBOARD');
    const [guests, setGuests] = useState<PartyGuest[]>([]);
    const [questions, setQuestions] = useState<PartyQuestion[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const { data: guestsData } = await supabase.from('party_guests').select('*');
            if (guestsData) setGuests(guestsData);

            const { data: questionsData } = await supabase.from('party_questions').select('*');
            if (questionsData) setQuestions(questionsData);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // Initial Fetch & Realtime Subscription
    useEffect(() => {
        // Only fetch if auth is done and we have a user
        if (!authLoading && guestId) {
            console.log('Fetching party data for guest:', guestId);
            fetchData();

            // Subscribe to ALL changes in party_guests to get live stat updates
            const guestChannel = supabase
                .channel('party_guests_live')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'party_guests' },
                    (payload) => {
                        console.log('Update received:', payload);
                        if (payload.eventType === 'UPDATE') {
                            setGuests(prev => prev.map(g =>
                                g.id === payload.new.id ? { ...g, ...payload.new } : g
                            ));
                        } else {
                            fetchData();
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(guestChannel);
            };
        }
    }, [guestId, authLoading]);

    const handleBetToggle = async (questionId: string, choice: 'OVER' | 'UNDER') => {
        const myGuest = guests.find(g => g.id === guestId);
        if (!myGuest) return;
        if (myGuest.is_bets_locked) {
            alert('Your bets are locked!');
            return;
        }

        const newBets = { ...myGuest.my_bets, [questionId]: choice };

        // Update Local State
        setGuests(prev => prev.map(g =>
            g.id === guestId ? { ...g, my_bets: newBets } : g
        ));

        // Persist to DB
        const { error } = await supabase
            .from('party_guests')
            .update({ my_bets: newBets })
            .eq('id', guestId);

        if (error) {
            console.error('Failed to save bet', error);
            alert('Failed to save bet!');
        }
    };

    const handleLockBets = async () => {
        console.log('Locking bets for guest:', guestId);

        const myGuest = guests.find(g => g.id === guestId);
        if (!myGuest) return;

        // Optimistic update
        setGuests(prev => prev.map(g => g.id === guestId ? { ...g, is_bets_locked: true } : g));

        const { error } = await supabase.from('party_guests').update({ is_bets_locked: true }).eq('id', guestId);
        if (error) {
            console.error('LOCK ERROR DETAILED:', JSON.stringify(error, null, 2));
            alert('Error locking bets');
            // Revert on error would be ideal, but for MVP simple alert is okay.
        }
    };

    // Derived State
    const myUser = guests.find(g => g.id === guestId);

    // Sorts
    const sortedByDrinks = [...guests].sort((a, b) => (Number(b.stats?.drinks) || 0) - (Number(a.stats?.drinks) || 0));
    const sortedByWater = [...guests].sort((a, b) => (Number(b.stats?.water) || 0) - (Number(a.stats?.water) || 0));

    // Global Stats (Aggregated from ALL Guests)
    const bottlesCount = guests.reduce((acc, g) => acc + (Number(g.stats?.bottles) || 0), 0);
    const gamesCount = guests.reduce((acc, g) => acc + (Number(g.stats?.games) || 0), 0);
    const bowlsCount = guests.reduce((acc, g) => acc + (Number(g.stats?.bowls) || 0), 0);
    const spillsCount = guests.reduce((acc, g) => acc + (Number(g.stats?.spills) || 0), 0);

    if (authLoading) return null;

    if (!guestId) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-indigo-50 to-white">
                <h1 className="text-3xl font-black text-center mb-2 text-indigo-900 tracking-tight">WHO ARE YOU?</h1>
                <p className="text-gray-500 mb-8">Tap your face to join the party.</p>
                <GuestSelector onSelect={(guest) => login(guest.id)} />
            </div>
        );
    }

    return (
        <div className="pb-24 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 border-b border-gray-100 p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold tracking-tight text-indigo-900">Party Tracker</h1>
                    <div className="text-[10px] text-green-600 font-bold px-2 py-1 rounded-full bg-green-100 uppercase tracking-wide animate-pulse">
                        Live Sync
                    </div>
                </div>

                {/* Global Stats Ticker */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="bg-yellow-50 border border-yellow-100 p-2 rounded-lg text-center">
                        <span className="text-xl font-black text-yellow-900">{bottlesCount}</span>
                        <div className="text-[9px] font-bold text-yellow-700 uppercase tracking-wider">Bottles</div>
                    </div>
                    <div className="bg-purple-50 border border-purple-100 p-2 rounded-lg text-center">
                        <span className="text-xl font-black text-purple-900">{gamesCount}</span>
                        <div className="text-[9px] font-bold text-purple-700 uppercase tracking-wider">Games</div>
                    </div>
                    <div className="bg-green-50 border border-green-100 p-2 rounded-lg text-center">
                        <span className="text-xl font-black text-green-900">{bowlsCount}</span>
                        <div className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Bowls</div>
                    </div>
                    <div className="bg-orange-50 border border-orange-100 p-2 rounded-lg text-center">
                        <span className="text-xl font-black text-orange-900">{spillsCount}</span>
                        <div className="text-[9px] font-bold text-orange-700 uppercase tracking-wider">Spills</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-3 bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => setActiveTab('LEADERBOARD')} className={`py-2 text-[10px] sm:text-xs font-bold rounded-md transition-all ${activeTab === 'LEADERBOARD' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        DRINKS
                    </button>
                    <button onClick={() => setActiveTab('HYDRATION')} className={`py-2 text-[10px] sm:text-xs font-bold rounded-md transition-all ${activeTab === 'HYDRATION' ? 'bg-white text-blue-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        WATER
                    </button>
                    <button onClick={() => setActiveTab('BETS')} className={`py-2 text-[10px] sm:text-xs font-bold rounded-md transition-all ${activeTab === 'BETS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        MY BETS
                    </button>
                </div>
            </div>

            <div className="p-4 max-w-lg mx-auto">
                {loading ? (
                    <div className="text-center text-gray-400 py-10 font-bold text-sm uppercase tracking-wider">Loading data...</div>
                ) : activeTab === 'LEADERBOARD' ? (
                    <div className="space-y-3">
                        {sortedByDrinks
                            .map((guest, index) => (
                                <div key={guest.id} className={`flex items-center justify-between p-4 rounded-xl shadow-sm border transition-shadow ${guest.id === guestId ? 'bg-white border-indigo-200 ring-4 ring-indigo-50/50' : 'bg-white border-transparent'}`}>
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shadow-sm ${index === 0 ? 'bg-yellow-400 text-yellow-900' : index === 1 ? 'bg-gray-300 text-gray-800' : index === 2 ? 'bg-orange-300 text-orange-900' : 'bg-gray-100 text-gray-500'}`}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className={`font-bold text-lg leading-none mb-1 ${guest.id === guestId ? 'text-indigo-900' : 'text-gray-800'}`}>
                                                {guest.name}
                                                {guest.id === guestId && <span className="ml-2 text-[10px] text-indigo-400 font-normal align-top">YOU</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-3xl font-black ${guest.stats?.drinks > 0 ? 'text-indigo-600' : 'text-gray-200'}`}>{guest.stats?.drinks || 0}</span>
                                        <div className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mt-[-4px]">Drinks</div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : activeTab === 'HYDRATION' ? (
                    <div className="space-y-3">
                        {sortedByWater
                            .map((guest, index) => (
                                <div key={guest.id} className={`flex items-center justify-between p-4 rounded-xl shadow-sm border transition-shadow ${guest.id === guestId ? 'bg-white border-blue-200 ring-4 ring-blue-50/50' : 'bg-white border-transparent'}`}>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm bg-blue-100 text-blue-600">
                                            {index + 1}
                                        </div>
                                        <div className={`font-bold text-lg leading-none mb-1 ${guest.id === guestId ? 'text-blue-900' : 'text-gray-800'}`}>
                                            {guest.name}
                                            {guest.id === guestId && <span className="ml-2 text-[10px] text-indigo-400 font-normal align-top">YOU</span>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-3xl font-black ${guest.stats?.water > 0 ? 'text-blue-500' : 'text-gray-200'}`}>{guest.stats?.water || 0}</span>
                                        <div className="text-[9px] text-gray-400 uppercase font-bold tracking-wider mt-[-4px]">Water</div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Status Header */}
                        <div className={`p-4 rounded-xl border flex justify-between items-center ${myUser?.is_bets_locked ? 'bg-indigo-50 border-indigo-200' : 'bg-yellow-50 border-yellow-200'}`}>
                            <div className="flex items-center space-x-3">
                                <div className={`text-2xl ${myUser?.is_bets_locked ? 'grayscale-0' : 'grayscale'}`}>🔒</div>
                                <div className="leading-tight">
                                    <div className="font-bold text-sm uppercase tracking-wide text-gray-900">
                                        {myUser?.is_bets_locked ? 'Bets Locked' : 'Bets Open'}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {myUser?.is_bets_locked ? 'Good luck! No more changes.' : 'Make your picks before locking.'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {questions.length === 0 ? (
                                <div className="text-center text-gray-400 py-10">No active bets yet.</div>
                            ) : (
                                questions.map(q => {
                                    const currentChoice = myUser?.my_bets?.[q.id];
                                    const locked = myUser?.is_bets_locked;

                                    return (
                                        <div key={q.id} className={`bg-white border shadow-sm p-4 rounded-xl transition-opacity ${locked ? 'opacity-80 border-gray-200' : 'border-gray-100'}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="font-bold text-lg leading-tight text-gray-800 pr-4">{q.question}</h3>
                                                <div className="flex flex-col items-center pl-4 border-l border-gray-100">
                                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Line</span>
                                                    <span className="text-xl font-black text-indigo-600">{q.line}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    disabled={locked}
                                                    onClick={() => handleBetToggle(q.id, 'OVER')}
                                                    className={`py-3 rounded-lg font-bold text-sm tracking-wide transition-all ${currentChoice === 'OVER'
                                                        ? 'bg-green-500 text-white shadow-md ring-2 ring-green-200'
                                                        : locked ? 'bg-gray-100 text-gray-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-400'
                                                        }`}
                                                >
                                                    OVER
                                                </button>
                                                <button
                                                    disabled={locked}
                                                    onClick={() => handleBetToggle(q.id, 'UNDER')}
                                                    className={`py-3 rounded-lg font-bold text-sm tracking-wide transition-all ${currentChoice === 'UNDER'
                                                        ? 'bg-red-500 text-white shadow-md ring-2 ring-red-200'
                                                        : locked ? 'bg-gray-100 text-gray-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-400'
                                                        }`}
                                                >
                                                    UNDER
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Lock Action */}
                        {!myUser?.is_bets_locked && (
                            <div className="sticky bottom-6">
                                <button
                                    onClick={handleLockBets}
                                    className="w-full py-4 rounded-xl bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center space-x-2 ring-blue-200"
                                >
                                    <span>🔒</span>
                                    <span>LOCK MY BETS</span>
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-2">Cannot be undone.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
