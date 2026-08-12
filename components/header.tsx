"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navItems = [
    { name: 'home', href: '#hero', isDownload: false },
    { name: 'projects', href: '#projects', isDownload: false },
    { name: 'research', href: '/research', isDownload: false },
    { name: 'resume', href: '/keshav-jindal-resume.pdf', isDownload: true },
    { name: 'contact', href: '#contact', isDownload: false },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
            <nav className="w-full max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

                {/* Logo/Name - Links to Hero */}
                <Link
                    href="#hero"
                    className="font-mono text-base sm:text-lg font-bold text-foreground hover:text-foreground/70 transition-colors group shrink-0 mr-2"
                >
                    <span className="text-foreground font-black tracking-wider border-2 border-border px-2 py-0.5 bg-background shadow-[2px_2px_0px_0px_hsl(var(--foreground))] hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-0.5 transition-all">KESH</span>
                </Link>

                {/* Terminal-style Navigation */}
                <div className="flex items-center gap-3 sm:gap-6 font-mono text-xs sm:text-sm">
                    {navItems.map((item) => {
                        if (item.isDownload) {
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    download
                                    className="relative font-bold transition-colors text-foreground hover:underline decoration-2 underline-offset-4 cursor-target flex items-center gap-1 uppercase"
                                >
                                    {item.name}
                                    <Download className="w-3 h-3" />
                                </a>
                            );
                        }
                        return (
                            <a
                                key={item.name}
                                href={item.href}
                                className="relative font-bold transition-colors text-foreground/80 hover:text-foreground hover:underline decoration-2 underline-offset-4 cursor-target uppercase"
                            >
                                {item.name}
                            </a>
                        );
                    })}

                    {/* Dark Mode Toggle */}
                    <ThemeToggle />
                </div>
            </nav>
        </header>
    );
}

