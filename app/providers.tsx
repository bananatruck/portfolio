"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        // storageKey is versioned so devices holding an older saved "light"
        // preference fall back to the dark default on their next visit.
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="theme-dark-default"
        >
            {children}
        </ThemeProvider>
    );
}

