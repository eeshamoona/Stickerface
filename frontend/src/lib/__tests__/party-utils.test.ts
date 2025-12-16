import { getCurrentPartySession, determineBetOutcome } from '../party-utils';

describe('getCurrentPartySession', () => {
    it('should return session starting Yesterday 8 AM if current time is before 8 AM', () => {
        // Mock Date: Dec 15th, 4:00 AM
        const mockNow = new Date('2025-12-15T04:00:00');
        const { start_time, end_time } = getCurrentPartySession(mockNow);

        // Expected: Start Dec 14th 8:00 AM, End Dec 15th 7:59:59 AM

        // We can rely on exact string matching if we constructed it carefully
        // Adjusting for local time zone execution: The function uses local time methods (getHours).
        // The test inputs should be timezone aware or consistent. 
        // Since the function uses `currentHour = now.getHours()`, that's local time.
        // We should be careful. `new Date('...').toISOString()` is UTC.
        // But `getCurrentPartySession` modifies the date object using `setHours`, which sets LOCAL hours.

        // Let's check logic by parsing the output back to Check Dates.
        const start = new Date(start_time);
        const end = new Date(end_time);

        expect(start.getDate()).toBe(14);
        expect(start.getHours()).toBe(8);
        expect(end.getDate()).toBe(15);
        expect(end.getHours()).toBe(7);
    });

    it('should return session starting Today 8 AM if current time is after 8 AM', () => {
        // Mock Date: Dec 15th, 2:00 PM (14:00)
        const mockNow = new Date('2025-12-15T14:00:00');
        const { start_time, end_time } = getCurrentPartySession(mockNow);

        const start = new Date(start_time);
        const end = new Date(end_time);

        expect(start.getDate()).toBe(15);
        expect(start.getHours()).toBe(8);
        expect(end.getDate()).toBe(16);
        expect(end.getHours()).toBe(7);
    });
});

describe('determineBetOutcome', () => {
    it('should win OVER bet if actual > line', () => {
        expect(determineBetOutcome('OVER', 4.5, 5)).toBe(true);
    });

    it('should lose OVER bet if actual < line', () => {
        expect(determineBetOutcome('OVER', 4.5, 4)).toBe(false);
    });

    it('should win UNDER bet if actual < line', () => {
        expect(determineBetOutcome('UNDER', 4.5, 4)).toBe(true);
    });

    it('should lose UNDER bet if actual > line', () => {
        expect(determineBetOutcome('UNDER', 4.5, 5)).toBe(false);
    });
});
