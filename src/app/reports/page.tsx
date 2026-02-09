import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ReportsPage() {
    const reports = await prisma.signal.findMany({
        where: {
            type: 'TRUST_REPORT',
            source: 'CURATO_SYSTEM'
        },
        orderBy: { createdAt: 'desc' },
        take: 20
    });

    return (
        <div className="space-y-6">
            <div className="border-b border-[#0A2A1A] pb-2 mb-4">
                <h2 className="text-xl font-bold tracking-wider">[ TRUST_LOGS ]</h2>
            </div>

            {reports.length === 0 ? (
                <p className="opacity-50 text-sm">NO_LOGS_FOUND_IN_ARCHIVE.</p>
            ) : (
                <div className="space-y-1 font-mono text-sm">
                    {reports.map(report => {
                        // Format date: YYYY-MM-DD
                        const date = new Date(report.createdAt).toISOString().split('T')[0];

                        // Determine status
                        let status = 'SIGNAL_CONFIRMED';
                        let count = '?';
                        try {
                            // Parse rawText or metadata if available to get count?
                            // Or try to parse metadata.count? No field there.
                            // But rawText has "counts".
                            const meta = report.metadata ? JSON.parse(report.metadata) : {};
                            if (report.type === 'TRUST_REPORT_SKIPPED') status = 'LOW_SIGNAL';
                        } catch (e) { }

                        return (
                            <Link key={report.id} href={`/report/${report.id}`} className="block group">
                                <div className="flex justify-between items-center border border-transparent hover:border-[#00FF7A] hover:bg-[#001100] p-2 transition-all cursor-pointer">
                                    <div className="flex gap-6">
                                        <span className="opacity-70">LOG · {date}</span>
                                        <span className={`font-bold ${status === 'LOW_SIGNAL' ? 'text-[#FFD166]' : 'text-[#00FF7A]'}`}>
                                            {status}
                                        </span>
                                    </div>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">&gt; ACCESS_REPORT</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
