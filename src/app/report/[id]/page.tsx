import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReportViewer from './ReportViewer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ReportPage({ params }: { params: { id: string } }) {
    const signal = await prisma.signal.findUnique({
        where: { id: params.id }
    });

    if (!signal) return notFound();

    const date = new Date(signal.createdAt).toISOString().split('T')[0];
    const meta = signal.metadata ? JSON.parse(signal.metadata) : {};
    const urls = signal.urls ? JSON.parse(signal.urls) : {};

    // Note: We use rawText for immutable log rendering.
    // Apps are not fetched to preserve historical state of the report text.

    return (
        <div className="space-y-8 font-mono">
            {/* HEADER */}
            <div className="border-b border-[#0A2A1A] pb-4">
                <Link href="/reports" className="text-xs opacity-50 hover:underline mb-2 block">&lt; BACK_TO_INDEX</Link>
                <h2 className="text-xl font-bold tracking-wider">TRUST REPORT · {date}</h2>
                <div className="text-sm opacity-70 mt-1">
                    METHOD: deterministic + onchain verification<br />
                    SOURCE: live Base activity
                </div>
            </div>

            <ReportViewer reportText={signal.rawText} date={date} meta={meta} />

            {/* AUDIT FOOTER */}
            <div className="pt-8 border-t border-[#0A2A1A] text-xs opacity-50">
                <p>BLOCK_ID: {signal.id}</p>
                <p>HASH: {urls.publishedHash || 'PENDING'}</p>
            </div>
        </div>
    );
}
