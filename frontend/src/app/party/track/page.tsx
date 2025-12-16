'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePartyAuth } from '@/context/PartyAuthContext';
import { GuestSelector } from '@/components/party/GuestSelector';
import { supabase } from '@/lib/supabase';

export default function TrackPage() {
    return (
        <Suspense fallback={<div className="text-center p-10">Loading tracker...</div>}>
            <TrackContent />
        </Suspense>
    );
}

function TrackContent() {
    const searchParams = useSearchParams();
    const metric = searchParams.get('metric'); // e.g. 'drinks'
    const { guestId, login, isLoading: authLoading } = usePartyAuth();

    const [status, setStatus] = useState<'IDLE' | 'SAVING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errorMessage, setErrorMessage] = useState('');

    const handleConfirm = async () => {
        if (!guestId || !metric) return;

        // 1. Debounce Check
        const lastTrackTime = sessionStorage.getItem(`last_track_${metric}`);
        const now = Date.now();
        if (lastTrackTime && (now - parseInt(lastTrackTime) < 5000)) {
            const secondsLeft = 5 - Math.floor((now - parseInt(lastTrackTime)) / 1000);
            setErrorMessage(`Whoa! You just tracked ${metric}. Wait ${secondsLeft}s.`);
            return;
        }

        setStatus('SAVING');

        try {
            // 2. Atomic Increment via RPC
            const { error } = await supabase.rpc('increment_stat', {
                row_id: guestId,
                key_name: metric
            });

            if (error) throw error;

            // Success
            sessionStorage.setItem(`last_track_${metric}`, now.toString());
            setStatus('SUCCESS');

        } catch (err: unknown) {
            console.error('Tracking error:', err);
            setStatus('ERROR');
            const msg = err instanceof Error ? err.message : 'Failed to save.';
            setErrorMessage(msg);
        }
    };

    const handleClose = () => {
        try { window.close(); } catch { }
        const btn = document.getElementById('close-btn');
        if (btn) btn.innerText = "Done! You can close this tab now.";
    };

    const handleTrackAgain = () => {
        setStatus('IDLE');
        setErrorMessage('');
        // Optional: clear debounce so they can track immediately if they click "Track Again"
        // sessionStorage.removeItem(`last_track_${metric}`); 
    };

    const router = useRouter();

    if (authLoading) return null;

    // Onboarding
    if (!guestId) {
        return (
            <div className="p-6 flex flex-col items-center justify-center min-h-screen text-center">
                <h1 className="text-2xl font-bold mb-4">Who is tracking {metric}?</h1>
                <GuestSelector onSelect={(guest) => login(guest.id)} />
            </div>
        );
    }

    // Invalid Metric
    const ALLOWED_METRICS = ['drinks', 'water', 'bottles', 'games', 'bowls', 'spills'];

    // Invalid Metric
    if (!metric || !ALLOWED_METRICS.includes(metric)) {
        return (
            <div className="p-10 text-center flex flex-col items-center justify-center min-h-screen">
                <div className="text-6xl mb-4">🤔</div>
                <h1 className="text-indigo-900 text-2xl font-black mb-2">Metric Not Found!</h1>
                <p className="text-gray-500 mb-8 max-w-xs">
                    This tracking link seems a bit wonky. We couldn&apos;t find the metric you&apos;re looking for.
                </p>
                <button
                    onClick={() => router.push('/party')}
                    className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
                >
                    Back to Party Hub
                </button>
            </div>
        );
    }

    // Success
    if (status === 'SUCCESS') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="text-8xl mb-6">✅</div>
                <h1 className="text-4xl font-black text-green-800 italic uppercase mb-2">
                    +1 {metric}
                </h1>
                <p className="text-green-600 mb-10 text-lg">Recorded!</p>

                <div className="w-full space-y-4">
                    <button
                        id="close-btn"
                        onClick={handleClose}
                        className="w-full py-4 bg-white text-black font-black text-xl rounded-xl shadow-lg active:scale-95 transition-transform border border-gray-100"
                    >
                        CLOSE TAB
                    </button>

                    <button
                        onClick={handleTrackAgain}
                        className="w-full py-3 text-green-700 font-bold hover:bg-green-100 rounded-xl transition-colors"
                    >
                        Track Another +1
                    </button>
                </div>

                <div className="mt-6 text-sm text-gray-400">
                    Redirecting to hub...
                </div>
            </div>
        );
    }

    // Confirm UI
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 relative bg-gradient-to-br from-indigo-50 via-purple-50 to-white text-gray-900">
            <div className="absolute top-4 right-4 text-xs text-gray-400 font-mono">
                User: {guestId.slice(0, 4)}...
            </div>

            <div className="text-8xl mb-8 animate-bounce">
                {metric === 'drinks' ? '🍺' : metric === 'water' ? '💧' : metric === 'bottles' ? '🍾' : metric === 'games' ? '🃏' : metric === 'bowls' ? '🍃' : metric === 'spills' ? '⚠️' : '📈'}
            </div>

            <h1 className="text-3xl font-bold mb-2 text-center capitalize text-indigo-900">
                Confirm +1 {metric}?
            </h1>

            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 w-full text-center text-sm font-bold">
                    {errorMessage}
                </div>
            )}

            <button
                onClick={handleConfirm}
                disabled={status === 'SAVING'}
                className={`w-full py-6 mt-4 rounded-2xl font-black text-2xl shadow-xl transition-all active:scale-95 text-white ${metric === 'water' ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-200' :
                    metric === 'bottles' ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200 text-black' :
                        metric === 'spills' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' :
                            'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                    }`}
            >
                {status === 'SAVING' ? 'SAVING...' : 'YES, COUNT IT!'}
            </button>

            <button
                onClick={() => router.push('/party')}
                className="mt-6 text-gray-400 hover:text-gray-600 underline text-sm"
            >
                Cancel
            </button>
        </div>
    );
}
