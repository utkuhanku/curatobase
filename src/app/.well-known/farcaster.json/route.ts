import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic'; // Allow DB access
export const revalidate = 60; // Cache for 1 min

export async function GET() {
    // Default placeholder (fallback)
    const placeholder = {
        "header": "eyJmaWQiOjg4OTQ5MiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEQ2RDE4NDI4OEFhNzlBNWVBZDI1QjA2Y2JBNzE0MTk0NUQxM2U5NTcifQ",
        "payload": "eyJkb21haW4iOiJjdXJhdG9iYXNlLnZlcmNlbC5hcHAifQ",
        "signature": "MHg2ODFmZDY3ZjY0ZWEwM2FjMzI5ZGU0YTIxMzQ1NTI4NzRjN2Q4Y2Q2ZWI2OTJhYjIyYzU2N2U5NGQ4ZTZkNDY0NTI0NjQ4MzQ5Y2E2YjZkMjYxZTYxODQ5NzYzYjY4ZmM4YjY5YjYxN2I5YjY0ZTYxN2I5YjY0ZTYxN2I5YjY0ZTYxN2I5"
    };

    let accountAssociation = placeholder;

    try {
        // Try to fetch overwrite from DB
        const config = await prisma.signal.findFirst({
            where: { type: 'SYSTEM_CONFIG', source: 'MANIFEST' },
            orderBy: { createdAt: 'desc' } // Newest first
        });

        if (config?.metadata) {
            const meta = JSON.parse(config.metadata);
            if (meta.accountAssociation) {
                accountAssociation = meta.accountAssociation;
            }
        }
    } catch (e) {
        console.error("Manifest Config Load Error:", e);
        // Fallback to placeholder
    }

    const manifest = {
        "accountAssociation": accountAssociation,
        "frame": {
            "version": "1",
            "name": "CuratoBase",
            "iconUrl": "https://curatobase.vercel.app/icon.png",
            "homeUrl": "https://curatobase.vercel.app",
            "imageUrl": "https://curatobase.vercel.app/splash.png",
            "buttonTitle": "Launch",
            "splashImageUrl": "https://curatobase.vercel.app/splash.png",
            "splashBackgroundColor": "#000000",
            "webhookUrl": "https://curatobase.vercel.app/api/webhook"
        },
        "miniapp": {
            "version": "1",
            "name": "CuratoBase",
            "iconUrl": "https://curatobase.vercel.app/icon.png",
            "homeUrl": "https://curatobase.vercel.app"
        }
    };

    return NextResponse.json(manifest, {
        status: 200,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
}
