'use client';

import { useEffect, useState } from 'react';

export default function Uptime() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        // Random start for "flavor" or 0
        setSeconds(Math.floor(Math.random() * 1000));
        const interval = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return <span>UPTIME: {seconds}s</span>;
}
