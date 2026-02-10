"use client";

import { useEffect, useState, useCallback } from "react";
import sdk from "@farcaster/frame-sdk";
import { Bell, BellRing } from "lucide-react";

export default function NotificationToggle() {
    const [isAdded, setIsAdded] = useState(false);
    const [notificationDetails, setNotificationDetails] = useState<{ url: string, token: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const checkContext = useCallback(async () => {
        const context = await sdk.context;
        if (context?.client?.notificationDetails) {
            setNotificationDetails(context.client.notificationDetails);
            setIsAdded(true);
            // Auto-subscribe if we have details but haven't synced with backend? 
            // For now, reliance on the button action or initial load sync is better.
            syncSubscription(context.client.notificationDetails);
        } else if (context?.client?.added) {
            setIsAdded(true);
        }
    }, []);

    useEffect(() => {
        checkContext();
    }, [checkContext]);

    const syncSubscription = async (details: { url: string, token: string }) => {
        const context = await sdk.context;
        const fid = context?.user?.fid;
        if (!fid) return;

        try {
            await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fid: fid,
                    url: details.url,
                    token: details.token
                })
            });
            console.log("Subscription synced");
        } catch (e) {
            console.error("Sync failed", e);
        }
    };

    const toggleNotification = async () => {
        setLoading(true);
        try {
            if (!isAdded) {
                const result = await sdk.actions.addFrame();
                if (result.notificationDetails) {
                    setNotificationDetails(result.notificationDetails);
                    setIsAdded(true);
                    await syncSubscription(result.notificationDetails);
                }
            } else {
                // Currently no "remove frame" action in SDK exposed simply, 
                // but usually this toggle is just for adding/enabling.
                // If already added, maybe show "Enabled".
            }
        } catch (e) {
            console.error("Failed to add frame:", e);
        }
        setLoading(false);
    };

    if (isAdded) {
        return (
            <div className="flex items-center gap-2 text-green-400 text-xs font-mono opacity-50 cursor-default">
                <BellRing size={14} />
                <span>ON</span>
            </div>
        );
    }

    return (
        <button
            onClick={toggleNotification}
            disabled={loading}
            className="flex items-center gap-2 hover:text-white text-gray-500 transition-colors"
        >
            <Bell size={16} />
            {loading ? "..." : ""}
        </button>
    );
}
