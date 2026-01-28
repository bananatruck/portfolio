"use client";

import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalWindowProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

export function TerminalWindow({ children, className, title = "zsh" }: TerminalWindowProps) {
    return (
        <div className={cn("rounded-none overflow-hidden border-2 border-foreground bg-background shadow-[8px_8px_0px_0px_hsl(var(--foreground))]", className)}>
            {/* Terminal Header - Manga Style */}
            <div className="bg-background px-4 py-3 flex items-center justify-between border-b-2 border-foreground select-none">
                {/* Window Controls - Simple Outlines */}
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-foreground bg-transparent" />
                    <div className="w-3 h-3 rounded-full border-2 border-foreground bg-foreground" />
                    <div className="w-3 h-3 rounded-full border-2 border-foreground bg-transparent" />
                </div>

                {/* Title */}
                <div className="text-xs text-foreground font-mono flex items-center gap-2 font-bold uppercase tracking-widest">
                    <Terminal className="w-4 h-4" />
                    {title}
                </div>

                {/* Spacer */}
                <div className="w-16" />
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm md:text-base text-foreground bg-background">
                {children}
            </div>
        </div>
    );
}
