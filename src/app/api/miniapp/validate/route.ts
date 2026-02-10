import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const domain = 'https://curatobase.vercel.app';
    const manifestUrl = `${domain}/.well-known/farcaster.json`;

    const results = {
        manifestUrl,
        checks: [] as any[],
        overall: 'PENDING',
        manifestBody: null as any
    };

    try {
        // 1. Reachability
        const start = Date.now();
        const res = await fetch(manifestUrl, { cache: 'no-store' });
        const latency = Date.now() - start;

        results.checks.push({
            id: 'reachable',
            label: 'Manifest Reachable',
            status: res.status === 200 ? 'PASS' : 'FAIL',
            details: `Status: ${res.status}, Latency: ${latency}ms`
        });

        // 2. Headers
        const contentType = res.headers.get('content-type');
        results.checks.push({
            id: 'content-type',
            label: 'Content-Type JSON',
            status: contentType?.includes('application/json') ? 'PASS' : 'FAIL',
            details: contentType || 'Missing'
        });

        if (res.status === 200) {
            const body = await res.json();
            results.manifestBody = body;

            // 3. Miniapp Object
            results.checks.push({
                id: 'miniapp-key',
                label: 'Has "miniapp" key',
                status: body.miniapp ? 'PASS' : 'FAIL',
                details: body.miniapp ? 'Version: ' + body.miniapp.version : 'Missing'
            });

            // 4. Home URL
            const homeUrl = body.miniapp?.homeUrl || body.frame?.homeUrl;
            results.checks.push({
                id: 'home-url',
                label: 'Home URL Match',
                status: homeUrl === domain ? 'PASS' : 'FAIL',
                details: `Expected: ${domain}, Got: ${homeUrl}`
            });

            // 5. Account Association (Signature)
            const aa = body.accountAssociation;
            const isPlaceholder = aa?.signature && aa.signature.startsWith("MHg2ODFmZDY3ZjY0ZWEwM2FjMzI5ZGU0YTIxMzQ1NTI4NzRjN2Q4Y2Q2ZWI2OTJhYjIyYzU2N2U5NGQ4ZTZkNDY0NTI0NjQ4MzQ5Y2E2YjZkMjYxZTYxODQ5NzYzYjY4ZmM4YjY5YjYxN2I5YjY0ZTYxN2I5YjY0ZTYxN2I5YjY0ZTYxN2I5");

            results.checks.push({
                id: 'signature',
                label: 'Account Association',
                status: (aa && !isPlaceholder) ? 'PASS' : 'FAIL',
                details: isPlaceholder ? '⚠️ USING PLACEHOLDER SIGNATURE' : (aa ? 'Signature Present' : 'Missing')
            });

            // 6. Icon Reachability
            const iconUrl = body.miniapp?.iconUrl || body.frame?.iconUrl;
            if (iconUrl) {
                try {
                    const iconRes = await fetch(iconUrl, { method: 'HEAD' });
                    results.checks.push({
                        id: 'icon-reachable',
                        label: 'Icon Reachable',
                        status: iconRes.status === 200 ? 'PASS' : 'WARN',
                        details: `Status: ${iconRes.status} for ${iconUrl}`
                    });
                } catch (e) {
                    results.checks.push({ id: 'icon-reachable', label: 'Icon Reachable', status: 'FAIL', details: 'Network Error' });
                }
            }
        }

        // Determine Overall
        const failures = results.checks.filter(c => c.status === 'FAIL');
        results.overall = failures.length === 0 ? 'READY' : 'BLOCKING';

    } catch (error: any) {
        results.checks.push({
            id: 'system',
            label: 'System Check',
            status: 'FAIL',
            details: error.message
        });
        results.overall = 'ERROR';
    }

    return NextResponse.json(results);
}
