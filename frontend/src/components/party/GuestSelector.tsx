'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Guest {
    id: string;
    name: string;
    avatar_url: string | null;
}

interface GuestSelectorProps {
    onSelect: (guest: Guest) => void;
}

export function GuestSelector({ onSelect }: GuestSelectorProps) {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchGuests() {
            try {
                const { data, error } = await supabase
                    .from('party_guests')
                    .select('id, name, avatar_url')
                    .order('name');

                if (error) throw error;
                setGuests(data || []);
            } catch (err: unknown) {
                console.error('Error fetching guests:', err);
                const msg = err instanceof Error ? err.message : 'Unknown error';
                setError(msg);
            } finally {
                setLoading(false);
            }
        }

        fetchGuests();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400 py-10">
                <p>Failed to load guest list.</p>
                <p className="text-sm opacity-75">{error}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {guests.map((guest) => (
                <button
                    key={guest.id}
                    onClick={() => onSelect(guest)}
                    className="flex flex-col items-center p-4 bg-white rounded-xl hover:bg-gray-50 transition-all border border-gray-100 shadow-sm hover:shadow-md active:scale-95"
                >
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-3 border-2 border-transparent hover:border-indigo-500 transition-colors shadow-sm">
                        {guest.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={guest.avatar_url}
                                alt={guest.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-indigo-300 bg-indigo-50">
                                {guest.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <span className="text-gray-800 font-bold text-lg">{guest.name}</span>
                </button>
            ))}
        </div>
    );
}
