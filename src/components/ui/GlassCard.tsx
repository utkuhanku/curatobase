import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'scanner' | 'alert' | 'success';
    onClick?: () => void;
}

export function GlassCard({ children, className, variant = 'default', onClick }: GlassCardProps) {
    const variants = {
        default: 'bg-[#1c1c1e]/60 border-white/10 hover:bg-[#1c1c1e]/80',
        scanner: 'bg-blue-500/5 border-blue-500/20',
        alert: 'bg-amber-500/5 border-amber-500/20',
        success: 'bg-green-500/5 border-green-500/20'
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "relative rounded-2xl border backdrop-blur-xl transition-all duration-300 shadow-lg",
                variants[variant],
                onClick && "cursor-pointer hover:scale-[1.01] active:scale-[0.99]",
                className
            )}
        >
            {children}
        </div>
    );
}
