// Detectors for various signal types

export interface BaseAppSignal {
    isBaseApp: boolean;
    appSlug?: string;
    appUrl?: string;
}

export class BaseAppDetector {
    static detect(text: string, embeds: any[] = []): BaseAppSignal {
        // Regex for base.app URLs, handles both base.app/app/slug and just base.app
        const regex = /https?:\/\/(?:www\.)?base\.app(?:\/?(?:app\/)?([a-zA-Z0-9_-]+))?/i;

        // Check Text
        const textMatch = text.match(regex);
        if (textMatch) {
            return { isBaseApp: true, appSlug: textMatch[1] || 'unknown-app', appUrl: textMatch[0] };
        }

        // Check Quotes for App Name (e.g. mini app called "Base Me")
        const nameMatch = text.match(/(?:mini\s?app|project).*?(?:called|named|\bis\b)?\s*["“'”]([^"“'”]{3,20})["“'”]/i);
        if (nameMatch) {
            const slug = nameMatch[1].toLowerCase().replace(/\s+/g, '-');
            return { isBaseApp: true, appSlug: slug, appUrl: undefined };
        }

        // Catch generic but strong announcements (e.g., "Base Me mini app")
        if (/(mini\s?app|base\s?app)/i.test(text)) {
            return { isBaseApp: true, appSlug: undefined, appUrl: undefined };
        }

        // Check Embeds (Cast Embeds are usually { url: ... })
        for (const embed of embeds) {
            if (embed.url) {
                const embedMatch = embed.url.match(regex);
                if (embedMatch) {
                    return { isBaseApp: true, appSlug: embedMatch[1] || 'unknown-app', appUrl: embed.url };
                }
            }
        }

        return { isBaseApp: false };
    }
}

export class RepoDetector {
    static detect(text: string, embeds: any[] = []): boolean {
        const keywords = ['github.com', 'gitlab.com', 'radicle.xyz'];
        const check = (s: string) => keywords.some(k => s.includes(k));

        if (check(text)) return true;

        for (const embed of embeds) {
            if (embed.url && check(embed.url)) return true;
        }
        return false;
    }
}

export class DemoDetector {
    static detect(text: string, embeds: any[] = []): boolean {
        // Generic "App" hosting or explicit textual claims
        const keywords = ['vercel.app', 'netlify.app', 'replit.com', 'fly.dev', 'railway.app', 'mini app', 'miniapp', 'base app'];
        const check = (s: string) => keywords.some(k => s.toLowerCase().includes(k));

        if (check(text)) return true;
        for (const embed of embeds) {
            if (embed.url && check(embed.url)) return true;
        }
        return false;
    }
}
