"use client";

import React from 'react';

// Simple SVG icons for tech stack
// In a real production app, you might use a library like `react-icons` or `simple-icons`
// Here we define a few key ones or use text fallbacks with style

export const TechIcon = ({ name, className }: { name: string; className?: string }) => {
    const iconMap: Record<string, React.ReactNode> = {
        React: (
            <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                <path d="M12 21.3c-1.4 0-2.7-.3-3.8-.8-1.1-.6-2-1.3-2.6-2.2-.6-.9-1-2-1-3.3 0-1.3.4-2.4 1-3.3.6-.9 1.5-1.6 2.6-2.2 1.1-.5 2.4-.8 3.8-.8 1.4 0 2.7.3 3.8.8 1.1.6 2 1.3 2.6 2.2.6.9 1 2 1 3.3 0 1.3-.4 2.4-1 3.3-.6.9-1.5 1.6-2.6 2.2-1.1.5-2.4.8-3.8.8z" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
        ),
        // Add more specific SVGs here if needed, or default to a styled text badge
    };

    if (iconMap[name]) {
        return <>{iconMap[name]}</>;
    }

    // Default fallback: First 2 letters in a box
    return (
        <div className={`flex items-center justify-center w-6 h-6 rounded bg-primary/20 text-[10px] font-bold text-primary ${className}`}>
            {name.substring(0, 2).toUpperCase()}
        </div>
    );
};
