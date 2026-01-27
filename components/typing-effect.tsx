"use client";

import { useState, useEffect } from "react";

interface TypingEffectProps {
    text: string;
    className?: string;
    cursor?: boolean;
}

export function TypingEffect({ text, className = "", cursor = true }: TypingEffectProps) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let i = 0;
        const intervalId = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1));
            i++;
            if (i > text.length) {
                clearInterval(intervalId);
            }
        }, 50 + Math.random() * 50); // Random typing speed

        return () => clearInterval(intervalId);
    }, [text]);

    return (
        <span className={className}>
            {displayedText}
            {cursor && <span className="animate-pulse text-primary">_</span>}
        </span>
    );
}
