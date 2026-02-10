import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, targetUrl, notificationId } = body;

        if (!title || !targetUrl || !notificationId) {
            return NextResponse.json({ error: 'Missing title, targetUrl, or notificationId' }, { status: 400 });
        }

        const subs = await prisma.notificationSubscription.findMany();
        const results = [];

        for (const sub of subs) {
            try {
                const res = await fetch(sub.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        notificationId,
                        title,
                        targetUrl,
                        tokens: [sub.token]
                    })
                });
                const data = await res.json();
                results.push({ fid: sub.fid, success: res.ok, data });
            } catch (e: any) {
                results.push({ fid: sub.fid, success: false, error: e.message });
            }
        }

        return NextResponse.json({ success: true, results });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
