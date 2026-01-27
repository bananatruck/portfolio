"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";

const navItems = [
    { name: 'home', href: '/', isDownload: false },
    { name: 'projects', href: '/projects', isDownload: false },
    { name: 'resume', href: '/resume.pdf', isDownload: true },
    { name: 'contact', href: '/contact', isDownload: false },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/40">
            <nav className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
                {/* Logo/Name - Links to About */}
                <Link
                    href="/about"
                    className="font-mono text-base sm:text-lg font-bold text-black hover:text-black/70 transition-colors group shrink-0 mr-2"
                >
                    <span className="text-black font-black tracking-wider border-2 border-black px-2 py-1 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">KESH</span>
                </Link>

                {/* Terminal-style Navigation */}
                <div className="flex items-center gap-2 sm:gap-6 font-mono text-xs sm:text-sm">
                    {navItems.map((item) => {
                        if (item.isDownload) {
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    download
                                    className="relative font-bold transition-colors text-black hover:underline decoration-2 underline-offset-4 cursor-target flex items-center gap-1 uppercase"
                                >
                                    {item.name}
                                    <Download className="w-3 h-3" />
                                </a>
                            );
                        }
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative font-bold transition-colors hover:underline decoration-2 underline-offset-4 cursor-target uppercase",
                                    pathname === item.href ? "text-black underline" : "text-black/60"
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="md:hidden">
                {/* Mobile menu toggle would go here */}
            </div>
        </header>
    );
}
