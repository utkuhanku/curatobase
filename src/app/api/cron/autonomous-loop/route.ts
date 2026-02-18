import { NextResponse } from 'next/server';
import { runAutonomousCycle } from '@/lib/agent/autonomous-loop';

export async function GET(req: Request) {
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await runAutonomousCycle();
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Cycle failed' }, { status: 500 });
    }
}
