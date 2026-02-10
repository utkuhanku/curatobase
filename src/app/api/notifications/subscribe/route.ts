import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fid, url, token } = body;

        if (!fid || !url || !token) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const sub = await prisma.notificationSubscription.upsert({
            where: { fid: String(fid) },
            update: { url, token },
            create: { fid: String(fid), url, token }
        });

        return NextResponse.json({ success: true, subscription: sub });
    } catch (e: any) {
        console.error("Subscription Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
