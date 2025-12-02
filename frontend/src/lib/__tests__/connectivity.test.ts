import { createClient } from '@supabase/supabase-js';

describe('Connectivity Tests', () => {
    it('should have Supabase environment variables', () => {
        expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBeDefined();
        expect(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBeDefined();
    });

    it('should connect to Supabase and fetch one photo (read-only)', async () => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
            .from('photos')
            .select('id')
            .limit(1);

        expect(error).toBeNull();
        expect(Array.isArray(data)).toBe(true);
    });

    it('should have Vercel Blob environment variables', () => {
        expect(process.env.BLOB_READ_WRITE_TOKEN).toBeDefined();
    });

    it('should be able to fetch a public asset from Vercel Blob (if URL provided)', async () => {
        // This is a loose check. If we have a known public URL, we can test it.
        // Otherwise, we just verify the token is present (checked above).
        // We can try to fetch the root or a known placeholder if one exists.
        // For now, we'll just log a warning if no specific asset to test.
        if (process.env.NEXT_PUBLIC_TEST_BLOB_URL) {
            const response = await fetch(process.env.NEXT_PUBLIC_TEST_BLOB_URL);
            expect(response.ok).toBe(true);
        }
    });
});
