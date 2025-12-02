import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PhotoForm from '../PhotoForm';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock browser-image-compression
jest.mock('browser-image-compression', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation((file) => Promise.resolve(file)),
}));

// Mock storage functions
jest.mock('@/lib/storage', () => ({
    uploadImage: jest.fn().mockResolvedValue('https://example.com/image.jpg'),
    addPhoto: jest.fn().mockResolvedValue(undefined),
}));

describe('PhotoForm', () => {
    it('renders the form with default fields', () => {
        render(<PhotoForm />);

        expect(screen.getByText(/Create Photo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Slug/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    });

    it('updates title and slug fields', () => {
        render(<PhotoForm />);

        const titleInput = screen.getByLabelText(/Title/i) as HTMLInputElement;
        fireEvent.change(titleInput, { target: { value: 'Test Photo' } });
        expect(titleInput.value).toBe('Test Photo');

        const slugInput = screen.getByLabelText(/Slug/i) as HTMLInputElement;
        fireEvent.change(slugInput, { target: { value: 'test-photo' } });
        expect(slugInput.value).toBe('test-photo');
    });

    it('shows validation error if submitting without required fields', async () => {
        render(<PhotoForm />);

        const submitButton = screen.getByRole('button', { name: /Save Photo/i });
        fireEvent.click(submitButton);

        const titleInputs = screen.getAllByLabelText(/Title/i);
        const titleInput = titleInputs[0] as HTMLInputElement;
        expect(titleInput.checkValidity()).toBe(false);
    });
});
