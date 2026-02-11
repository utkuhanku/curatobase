import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CyberCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'scanner' | 'alert' | 'success';
}

export function CyberCard({ children, className, title, icon, variant = 'default' }: CyberCardProps) {
    const borderColors = {
        default: 'border-white/10 group-hover:border-electric-blue/30',
        scanner: 'border-electric-blue/30 bg-electric-blue/5',
        alert: 'border-amber-500/30',
        success: 'border-green-500/30'
    };

    return (
        <div className={cn(
            "relative group rounded-lg border backdrop-blur-sm transition-all duration-500",
            "bg-[#0a0a0a]/80", // Darker background to pop against the grid
            borderColors[variant],
            className
        )}>
            {/* Corner Accents - Robotic Feel */}
            <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-electric-blue/50 rounded-tl-lg" />
            <div className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-electric-blue/50 rounded-br-lg" />

            {/* Scanner Line Effect for "Scanner" variant */}
            {variant === 'scanner' && (
                <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-electric-blue/50 shadow-[0_0_10px_#1652F0] animate-scanline-fast opacity-50" />
                </div>
            )}

            <div className="p-6">
                {title && (
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
                        {icon && <span className={cn(
                            "p-1.5 rounded bg-white/5",
                            variant === 'scanner' && "text-electric-blue animate-pulse",
                            variant === 'success' && "text-green-500"
                        )}>{icon}</span>}
                        <h3 className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-gray-400 group-hover:text-white transition-colors">
                            {title}
                        </h3>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
