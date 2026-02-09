import { NextRequest, NextResponse } from 'next/server';
import { TrustReportRunner } from '@/lib/agent/TrustReportRunner';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('mode');

    if (mode !== 'dry' && mode !== 'live') {
        return NextResponse.json({ error: 'Invalid mode. Use ?mode=dry or ?mode=live' }, { status: 400 });
    }

    const isDryRun = mode === 'dry';

    // In LIVE mode, we respect the global switch. In DRY mode, we check logic but don't publish unless force enabled?
    // User request: "Canary (Dry Run) ... Must NOT publish".
    // TrustReportRunner handles dryRun=true by skipping publish.

    // Safety: If mode is live, we require TRUST_REPORT_ENABLED=true in env.
    const isEnabled = process.env.TRUST_REPORT_ENABLED === 'true';

    try {
        const result = await TrustReportRunner.run({
            dryRun: isDryRun,
            enabled: isEnabled
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Cron Job Failed:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
