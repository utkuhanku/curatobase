import './globals.css';
import { JetBrains_Mono } from 'next/font/google';
import Uptime from '@/components/Uptime';
import NotificationToggle from '@/components/NotificationToggle';
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
        <html lang="en" className={`${mono.variable}`}>
            <body className="min-h-screen flex flex-col p-4 md:p-8 max-w-3xl mx-auto selection:bg-[#001133] selection:text-white relative">
                <div className="cyber-grid" />
                <FarcasterProvider>
                    {/* HEADER */}
                    <header className="mb-8 border-b border-white/5 pb-4 sticky top-0 z-50 bg-[#050607]/80 backdrop-blur-md -mx-4 px-4 md:-mx-8 md:px-8 pt-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
                                    <div className="w-4 h-4 border-2 border-white rounded-sm" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                        CURATO<span className="text-blue-500">BASE</span>
                                    </h1>
                                    <div className="text-[10px] font-mono text-gray-500 tracking-widest flex gap-2">
                                        <span className="text-green-500">● ONLINE</span>
                                        <span>v2.1.0</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <nav className="hidden md:flex gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                                    <Link href="/reports" className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-all">LOGS</Link>
                                    <Link href="/prestige" className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-all">PRESTIGE</Link>
                                    <Link href="/about" className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-all">SYSTEM</Link>
                                </nav>
                                <div className="pl-4 border-l border-white/10">
                                    <NotificationToggle />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Nav (Simple Row) */}
                        <nav className="flex md:hidden justify-between mt-4 pt-4 border-t border-white/5 text-xs font-medium text-gray-500">
                            <Link href="/reports" className="hover:text-blue-400">LOGS</Link>
                            <Link href="/prestige" className="hover:text-blue-400">PRESTIGE</Link>
                            <Link href="/about" className="hover:text-blue-400">SYSTEM</Link>
                            <Link href="/status" className="hover:text-blue-400">STATUS</Link>
                        </nav>
                    </header>

                    {/* MAIN */}
                    <main className="flex-grow relative z-10">
                        {children}
                    </main>

                    {/* FOOTER */}
                    <footer className="mt-12 text-[10px] text-gray-600 border-t border-white/5 pt-6 pb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p>ID: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()} // ENCRYPTED</p>
                        <div className="flex gap-4">
                            <span>TERMS</span>
                            <span>PRIVACY</span>
                            <span>SOURCE</span>
                        </div>
                    </footer>
                </FarcasterProvider>
            </body>
        </html>
    );
}
