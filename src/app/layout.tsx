import './globals.css';
import { JetBrains_Mono } from 'next/font/google';
import Uptime from '@/components/Uptime';
import Link from 'next/link';

const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
    title: 'CuratoBase Terminal',
    description: 'Editorial Trust Logs for Base Miniapps',
    other: {
        "base:app_id": "698b1100abdd1887a89d98a0",
    }
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

import FarcasterProvider from '@/components/FarcasterProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${mono.variable} font-mono bg-black text-[#00FF7A]`}>
            <body className="min-h-screen flex flex-col p-4 md:p-8 max-w-3xl mx-auto selection:bg-[#003300] selection:text-white">
                <FarcasterProvider>
                    {/* HEADER */}
                    <header className="mb-8 border-b border-[#0A2A1A] pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-sm font-bold tracking-wider">CURATOBASE TERMINAL v1.0</h1>
                                <div className="text-xs opacity-70 mt-1 space-y-0.5">
                                    <p>MODE: READ_ONLY</p>
                                    <p>NETWORK: BASE</p>
                                    <p>AGENT: CURATOR_V1</p>
                                </div>
                            </div>
                            <div className="text-xs opacity-50 font-mono text-right">
                                <Uptime />
                            </div>
                        </div>

                        {/* NAV */}
                        <nav className="mt-6 flex gap-6 text-sm">
                            <Link href="/reports" className="hover:text-white hover:underline decoration-green-500 underline-offset-4">[ TRUST_LOGS ]</Link>
                            <Link href="/prestige" className="hover:text-white hover:underline decoration-green-500 underline-offset-4">[ PRESTIGE ]</Link>
                            <Link href="/about" className="hover:text-white hover:underline decoration-green-500 underline-offset-4">[ ABOUT ]</Link>
                            <Link href="/status" className="hover:text-white hover:underline decoration-green-500 underline-offset-4 text-green-700">[ STATUS ]</Link>
                        </nav>
                        {/* Hidden Admin Link Area - Bottom Right fixed maybe? No, keep it clean. User can type /admin manually */}
                    </header>

                    {/* MAIN */}
                    <main className="flex-grow">
                        {children}
                    </main>

                    {/* FOOTER */}
                    <footer className="mt-12 text-xs opacity-50 border-t border-[#0A2A1A] pt-4 pb-8 flex justify-between">
                        <p>&gt; SYSTEM_ID: E2EE-VERIFIED</p>
                        <p>CuratoBase © 2026</p>
                    </footer>
                </FarcasterProvider>
            </body>
        </html>
    );
}
