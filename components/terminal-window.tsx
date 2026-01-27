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
        <div className={cn("rounded-none overflow-hidden border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]", className)}>
            {/* Terminal Header - Manga Style */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-b-2 border-black select-none">
                {/* Window Controls - Simple Outlines */}
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full border-2 border-black bg-transparent" />
                    <div className="w-3 h-3 rounded-full border-2 border-black bg-black" />
                    <div className="w-3 h-3 rounded-full border-2 border-black bg-transparent" />
                </div>

                {/* Title */}
                <div className="text-xs text-black font-mono flex items-center gap-2 font-bold uppercase tracking-widest">
                    <Terminal className="w-4 h-4" />
                    {title}
                </div>

                {/* Spacer */}
                <div className="w-16" />
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm md:text-base text-black bg-white">
                {children}
            </div>
        </div>
    );
}
