'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface PartyAuthContextType {
    guestId: string | null;
    login: (id: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const PartyAuthContext = createContext<PartyAuthContextType | undefined>(undefined);

export function PartyAuthProvider({ children }: { children: React.ReactNode }) {
    const [guestId, setGuestId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const storedId = localStorage.getItem('party_guest_id');
            if (storedId) {
                // Validation: Verify this user still exists in DB (in case of wipes)
                const { data, error } = await supabase
                    .from('party_guests')
                    .select('id')
                    .eq('id', storedId)
                    .maybeSingle();

                if (error || !data) {
                    console.warn('Session invalid, logging out.');
                    logout();
                } else {
                    setGuestId(storedId);
                }
            }
            setIsLoading(false);
        };

        checkSession();
    }, []);

    const login = (id: string) => {
        localStorage.setItem('party_guest_id', id);
        setGuestId(id);
    };

    const logout = () => {
        localStorage.removeItem('party_guest_id');
        setGuestId(null);
    };

    return (
        <PartyAuthContext.Provider
            value={{
                guestId,
                login,
                logout,
                isAuthenticated: !!guestId,
                isLoading
            }}
        >
            {children}
        </PartyAuthContext.Provider>
    );
}

export function usePartyAuth() {
    const context = useContext(PartyAuthContext);
    if (context === undefined) {
        throw new Error('usePartyAuth must be used within a PartyAuthProvider');
    }
    return context;
}
