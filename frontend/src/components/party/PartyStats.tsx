'use client';

// PartyStats Component
// Logic:
// 1. Receives data from parent or fetches it?
// Plan says: "Reusable stats display".
// Page says: "Leaderboard (Live View)".
// Let's make this component take parsed stats and display them.

import { useMemo } from 'react';

interface GuestStats {
    drinks: number;
    water: number;
}

interface GlobalStats {
    total_bottles: number;
    games_played: number;
    total_spills: number;
}

interface PartyStatsData {
    guests: Record<string, GuestStats>;
    global: GlobalStats;
}

interface PartyStatsProps {
    data: PartyStatsData | null;
    loading: boolean;
}

export function PartyStats({ data, loading }: PartyStatsProps) {
    const sortedGuests = useMemo(() => {
        if (!data?.guests) return [];

        return Object.entries(data.guests)
            .map(([name, stats]) => ({ name, ...stats }))
            .sort((a, b) => b.drinks - a.drinks); // Descending by drinks
    }, [data]);

    if (loading) {
        return (
            <div className="flex flex-col space-y-4 animate-pulse p-4">
                <div className="h-10 bg-gray-800 rounded w-full"></div>
                <div className="h-10 bg-gray-800 rounded w-full"></div>
                <div className="h-10 bg-gray-800 rounded w-full"></div>
            </div>
        );
    }

    if (!data) return <div className="p-4 text-gray-500">No stats available.</div>;

    return (
        <div className="p-4 space-y-6">
            {/* Global Highlights */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
                    <div className="text-3xl font-bold text-yellow-500">{data.global.total_bottles}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Bottles</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
                    <div className="text-3xl font-bold text-purple-500">{data.global.games_played}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Games</div>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 text-center border border-gray-700">
                    <div className="text-3xl font-bold text-orange-500">{data.global.total_spills}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Spills</div>
                </div>
            </div>

            {/* Leaderboard */}
            <div>
                <h3 className="text-xl font-bold mb-4 text-white flex items-center">
                    <span className="mr-2">🏆</span> Leaderboard
                </h3>

                <div className="space-y-3">
                    {sortedGuests.map((guest, index) => (
                        <div
                            key={guest.name}
                            className={`flex items-center justify-between p-3 rounded-lg border ${index === 0 ? 'bg-yellow-900/20 border-yellow-700/50' : 'bg-gray-800 border-gray-700'
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                                    index === 1 ? 'bg-gray-400 text-black' :
                                        index === 2 ? 'bg-orange-700 text-white' : 'bg-gray-700 text-gray-400'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <div className="font-bold text-lg">{guest.name}</div>
                                    <div className="text-xs text-gray-400 flex items-center space-x-2">
                                        {/* Water Badge (Health Check) */}
                                        {guest.water > 0 && (
                                            <span className="flex items-center text-blue-400">
                                                💧 {guest.water}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-2xl font-black text-white">
                                {guest.drinks} <span className="text-sm font-normal text-gray-500">drinks</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
