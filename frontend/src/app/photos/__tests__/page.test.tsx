import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PhotosPage from '../page';
import { getPhotos } from '../../../lib/storage';

// Mock storage
jest.mock('../../../lib/storage', () => ({
    getPhotos: jest.fn(),
}));

// Mock supabase
jest.mock('../../../lib/supabase', () => ({
    supabase: {
        channel: jest.fn().mockReturnValue({
            on: jest.fn().mockReturnThis(),
            subscribe: jest.fn(),
        }),
        removeChannel: jest.fn(),
    },
}));

const mockPhotos = [
    {
        id: '1',
        title: 'Photo 1',
        slug: 'photo-1',
        date: '2023-01-01',
        images: { original: '/photo1.jpg', artStyles: [] },
        aspectRatio: '16/9',
    },
    {
        id: '2',
        title: 'Photo 2',
        slug: 'photo-2',
        date: '2023-01-02',
        images: { original: '/photo2.jpg', artStyles: [] },
        aspectRatio: '4/3',
    },
];

describe('PhotosPage (Gallery)', () => {
    it('renders loading state initially', async () => {
        let resolvePromise: (value: unknown) => void;
        const promise = new Promise((resolve) => { resolvePromise = resolve; });
        (getPhotos as jest.Mock).mockReturnValue(promise);

        render(<PhotosPage />);
        // Check for loading spinner
        expect(document.querySelector('.animate-spin')).toBeInTheDocument();

        // Resolve promise to clean up
        resolvePromise!([]);
        await waitFor(() => {
            expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
        });
    });

    it('renders photos after loading', async () => {
        (getPhotos as jest.Mock).mockResolvedValue(mockPhotos);
        render(<PhotosPage />);

        await waitFor(() => {
            expect(screen.getByText('Photo 1')).toBeInTheDocument();
            expect(screen.getByText('Photo 2')).toBeInTheDocument();
        });
    });

    it('renders empty state when no photos', async () => {
        (getPhotos as jest.Mock).mockResolvedValue([]);
        render(<PhotosPage />);

        await waitFor(() => {
            expect(screen.getByText('No photos found.')).toBeInTheDocument();
            expect(screen.getByText('Create your first photo')).toBeInTheDocument();
        });
    });
});
