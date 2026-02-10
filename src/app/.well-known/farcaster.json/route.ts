import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
    // Default placeholder
    const placeholder = {
        "header": "eyJmaWQiOjg4OTQ5MiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEQ2RDE4NDI4OEFhNzlBNWVBZDI1QjA2Y2JBNzE0MTk0NUQxM2U5NTcifQ",
        "payload": "eyJkb21haW4iOiJjdXJhdG9iYXNlLnZlcmNlbC5hcHAifQ",
        "signature": "MHg2ODFmZDY3ZjY0ZWEwM2FjMzI5ZGU0YTIxMzQ1NTI4NzRjN2Q4Y2Q2ZWI2OTJhYjIyYzU2N2U5NGQ4ZTZkNDY0NTI0NjQ4MzQ5Y2E2YjZkMjYxZTYxODQ5NzYzYjY4ZmM4YjY5YjYxN2I5YjY0ZTYxN2I5YjY0ZTYxN2I5YjY0ZTYxN2I5"
    };

    let accountAssociation = placeholder;

    try {
        const assoc = await prisma.accountAssociation.findUnique({
            where: { id: 1 }
        });

        if (assoc) {
            accountAssociation = {
                header: assoc.header,
                payload: assoc.payload,
                signature: assoc.signature
            };
        }
    } catch (e) {
        console.error("Manifest Config Load Error:", e);
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
