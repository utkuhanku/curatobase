import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, verdict, notes } = body;

        // Create a "Report" using the Signal model
        const report = await prisma.signal.create({
            data: {
                type: 'TRUST_REPORT',
                source: 'CURATO_SYSTEM',
                rawText: `MANUAL_REPORT: ${title}`,
                authorHandle: 'admin',
                timestamp: new Date(),
                metadata: JSON.stringify({
                    verdict: verdict || 'MANUAL_VERIFICATION',
                    notes: notes || 'Created via Admin Console',
                    manual: true
                }),
                urls: '[]' // Required field, empty JSON array for manual report
                // We could link to an app if we had an ID, but for test, we leave null
            }
        });

        return NextResponse.json({
            success: true,
            reportId: report.id,
            createdAt: report.createdAt
        });

    } catch (error: any) {
        console.error("Failed to create report:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
