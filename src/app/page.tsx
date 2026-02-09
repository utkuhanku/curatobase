import { DiscoveryFeed } from "@/components/DiscoveryFeed";
import Link from "next/link";
import { Zap } from "lucide-react";

import { redirect } from "next/navigation";

export default async function Home({ searchParams }: { searchParams: Promise<{ start?: string }> }) {
    const { start } = await searchParams;
    if (start) {
        redirect(`/report/${start}`);
    } else {
        redirect('/reports');
    }

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between pb-6 border-b border-white/10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
                        <span className="text-electric-blue">Curato</span>Base
                    </h1>
                    <p className="text-gray-500 font-mono text-sm mt-1">Autonomous Builder Discovery</p>
                </div>
                <nav className="flex gap-4 text-sm font-bold font-mono">
                    <Link href="/" className="text-white border-b-2 border-electric-blue pb-1">Sup Builders</Link>
                    <Link href="/reports" className="text-gray-500 hover:text-white transition-colors pb-1">Trust Logs</Link>
                </nav>
            </header>

            <div className="bg-electric-blue/5 border border-electric-blue/20 p-4 rounded-lg flex items-start gap-3">
                <Zap className="text-electric-blue shrink-0" />
                <p className="text-sm text-gray-300">
                    This feed is populated 100% autonomously by the Curato Agent.
                    There is no way to submit your app. Just ship on Base and talk about it.
                </p>
            </div>

            <DiscoveryFeed />
        </div>
    );
}
