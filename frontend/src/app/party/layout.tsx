import { PartyAuthProvider } from '@/context/PartyAuthContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Party Tracker',
    description: 'Track drinks, water, and bets!',
};

export default function PartyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PartyAuthProvider>
            <div className="min-h-screen font-sans selection:bg-blue-500 selection:text-white">
                <main className="max-w-md mx-auto min-h-screen shadow-2xl overflow-x-hidden pb-safe">
                    {children}
                </main>
            </div>
        </PartyAuthProvider>
    );
}
