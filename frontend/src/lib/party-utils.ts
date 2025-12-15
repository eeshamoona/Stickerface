import { SupabaseClient } from '@supabase/supabase-js';

// Types for better type safety
export interface PartySession {
    start_time: string; // ISO string
    end_time: string;   // ISO string
}

export interface BetResult {
    bet_id: string;
    is_win: boolean;
    actual_value: number;
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
 * @param startTime Session start time
 * @param endTime Session end time
 * @returns The count for that metric
 */
async function getMetricCount(
    supabase: SupabaseClient,
    key: string,
    startTime: string,
    endTime: string
): Promise<number> {
    // 1. Handle "total_bottles"
    if (key === 'total_bottles') {
        const { count, error } = await supabase
            .from('party_actions')
            .select('*', { count: 'exact', head: true })
            .eq('action_type', 'BOTTLE')
            .gte('created_at', startTime)
            .lte('created_at', endTime);

        if (error) throw error;
        return count || 0;
    }

    // 2. Handle "games_played"
    if (key === 'games_played') {
        const { count, error } = await supabase
            .from('party_actions')
            .select('*', { count: 'exact', head: true })
            .eq('action_type', 'GAME')
            .gte('created_at', startTime)
            .lte('created_at', endTime);

        if (error) throw error;
        return count || 0;
    }

    // 3. Handle "{name}_drinks"
    if (key.endsWith('_drinks')) {
        const namePart = key.replace('_drinks', '');

        // Find guest by name (case-insensitive ILIKE)
        // Note: We need to search for the guest first to get their ID.
        // Ideally, we'd cache this or join, but for MVP this is fine.
        const { data: guests, error: guestError } = await supabase
            .from('party_guests')
            .select('id')
            .ilike('name', `%${namePart}%`)
            .limit(1);

        if (guestError) throw guestError;
        if (!guests || guests.length === 0) {
            console.warn(`Guest not found for bet key: ${key}`);
            return 0; // Or throw? For betting settlement, 0 implies loss usually.
        }

        const guestId = guests[0].id;

        const { count, error } = await supabase
            .from('party_actions')
            .select('*', { count: 'exact', head: true })
            .eq('action_type', 'DRINK')
            .eq('guest_id', guestId)
            .gte('created_at', startTime)
            .lte('created_at', endTime);

        if (error) throw error;
        return count || 0;
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

/**
 * Main function to settle bets for a session.
 * WARNING: This is expensive if there are many bets.
 */
export async function settleBetsForSession(
    supabase: SupabaseClient,
    startTime: string,
    endTime: string,
    bettingLines: Record<string, number>
): Promise<BetResult[]> {

    // Fetch all bets for this session (or generic 'OPEN' bets if tracking by status, 
    // but plan implies we settle based on what happened in the timeframe)
    // Actually, 'party_bets' has a created_at. We should probably settle bets created 
    // generally? Or just ALL bets that haven't been settled? 
    // For MVP: Fetch ALL bets created within the session wrapper? 
    // Or just "current active bets". The prompt implies specific party_config for the night.
    // Let's assume we fetch all bets created in this timeframe for simplicity, or just ALL bets in the table 
    // if we truncate/clear table. 
    // Let's filter by created_at between session start/end to be safe.

    const { data: bets, error } = await supabase
        .from('party_bets')
        .select('*')
        .gte('created_at', startTime)
        .lte('created_at', endTime);

    if (error) throw error;
    if (!bets) return [];

    const results: BetResult[] = [];

    // Cache metric counts to avoid re-querying for every bet
    const metricCache: Record<string, number> = {};

    for (const bet of bets) {
        const key = bet.bet_target;
        let actualValue = metricCache[key];

        if (actualValue === undefined) {
            actualValue = await getMetricCount(supabase, key, startTime, endTime);
            metricCache[key] = actualValue;
        }

        const line = bettingLines[key];
        // If no line exists for this target, we can't settle it. Mark as loss or ignore?
        // Let's assume line exists.
        if (line !== undefined) {
            const isWin = determineBetOutcome(bet.prediction, line, actualValue);
            results.push({
                bet_id: bet.id,
                is_win: isWin,
                actual_value: actualValue
            });
        }
    }

    return results;
}
