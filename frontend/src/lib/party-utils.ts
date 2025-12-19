import { SupabaseClient } from '@supabase/supabase-js';

// Types for better type safety
export interface PartySession {
    start_time: string; // ISO string
    end_time: string;   // ISO string
}


/**
 * Calculates the current "Party Session" based on the 8 AM rule.
 * - If current time < 8 AM: Session is Yesterday 8 AM -> Today 7:59:59 AM
 * - If current time >= 8 AM: Session is Today 8 AM -> Tomorrow 7:59:59 AM
 * 
 * @param now Optional date object for testing, defaults to new Date()
 * @returns PartySession object with start_time and end_time
 */
export function getCurrentPartySession(now: Date = new Date()): PartySession {
    const currentHour = now.getHours();

    const start = new Date(now);
    const end = new Date(now);

    if (currentHour < 8) {
        // Session started yesterday at 8 AM
        start.setDate(start.getDate() - 1);
        start.setHours(8, 0, 0, 0);

        // Session ends today at 7:59:59 AM
        end.setHours(7, 59, 59, 999);
    } else {
        // Session started today at 8 AM
        start.setHours(8, 0, 0, 0);

        // Session ends tomorrow at 7:59:59 AM
        end.setDate(end.getDate() + 1);
        end.setHours(7, 59, 59, 999);
    }

    return {
        start_time: start.toISOString(),
        end_time: end.toISOString()
    };
}

/**
 * Helper to fetch aggregation counts based on the betting key.
 * 
 * @param supabase Supabase Client
 * @param key The betting key (e.g., 'total_bottles', 'eesha_drinks')
 * @returns The count for that metric (fetched from party_guests stats)
 */
export async function getMetricCount(
    supabase: SupabaseClient,
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    startTime?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endTime?: string
): Promise<number> {
    // NOTE: 'startTime' and 'endTime' are unused because we read running totals 
    // directly from the 'party_guests' table, which acts as the single source of truth.

    // 1. Handle Global Aggregates (Sum of all guests)
    // Keys: total_bottles/bottles, games_played/games, total_spills/spills, bowls
    if (['total_bottles', 'bottles', 'games_played', 'games', 'total_spills', 'spills', 'bowls', 'total_bowls'].includes(key)) {
        const { data: guests, error } = await supabase
            .from('party_guests')
            .select('stats');

        if (error) throw error;
        if (!guests) return 0;

        let prop = '';
        if (key.includes('bottle')) prop = 'bottles';
        else if (key.includes('game')) prop = 'games';
        else if (key.includes('spill')) prop = 'spills';
        else if (key.includes('bowl')) prop = 'bowls';

        return guests.reduce((acc, g) => acc + (Number(g.stats?.[prop]) || 0), 0);
    }

    // 2. Handle Individual Stats ({name}_drinks, {name}_water)
    if (key.endsWith('_drinks') || key.endsWith('_water')) {
        const isWater = key.endsWith('_water');
        const namePart = key.replace(isWater ? '_water' : '_drinks', '');

        // Find guest by name (case-insensitive ILIKE)
        const { data: guests, error: guestError } = await supabase
            .from('party_guests')
            .select('stats')
            .ilike('name', `%${namePart}%`)
            .limit(1);

        if (guestError) throw guestError;
        if (!guests || guests.length === 0) {
            console.warn(`Guest not found for bet key: ${key}`);
            return 0;
        }

        return Number(guests[0].stats?.[isWater ? 'water' : 'drinks']) || 0;
    }

    console.warn(`Unknown bet key: ${key}`);
    return 0;
}

/**
 * determines if a bet is a win or loss.
 * 
 * @param prediction 'OVER' | 'UNDER'
 * @param lineValue The target line (e.g., 4.5)
 * @param actualTotal The actual count
 * @returns boolean true if win
 */
export function determineBetOutcome(prediction: 'OVER' | 'UNDER', lineValue: number, actualTotal: number): boolean {
    if (prediction === 'OVER') {
        return actualTotal > lineValue;
    } else {
        return actualTotal < lineValue;
    }
}

