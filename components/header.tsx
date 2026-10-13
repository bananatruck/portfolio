"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { OsSwitch } from "./os-switch";

const navItems = [
    { name: 'projects', href: '#projects', isDownload: false },
    { name: 'research', href: '/research', isDownload: false },
    { name: 'resume', href: '/keshav-jindal-resume.pdf', isDownload: true },
    { name: 'contact', href: '#contact', isDownload: false },
];

export function Header() {
    const pathname = usePathname();
    // Section anchors only exist on the home page; elsewhere they have to lead back to it.
    const resolve = (href: string) => (href.startsWith('#') && pathname !== '/' ? `/${href}` : href);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 border-b border-border/40">
            <nav className="w-full max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

                {/* K. is the logo; it turns the site into KESH_OS. Home lives in the nav. */}
                <div className="shrink-0 mr-2">
                    <OsSwitch />
                </div>

                {/* Terminal-style Navigation */}
                <div className="flex items-center gap-2.5 sm:gap-6 font-mono text-[11px] sm:text-sm min-w-0">
                    {navItems.map((item) => {
                        if (item.isDownload) {
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    download
                                    className="relative font-bold transition-colors text-foreground hover:underline decoration-2 underline-offset-4 flex items-center gap-1 uppercase"
                                >
                                    {item.name}
                                    <Download className="w-3 h-3" />
                                </a>
                            );
                        }
                        return (
                            <a
                                key={item.name}
                                href={resolve(item.href)}
                                className={`relative font-bold transition-colors text-foreground/80 hover:text-foreground hover:underline decoration-2 underline-offset-4 uppercase`}
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

