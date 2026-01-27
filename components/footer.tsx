"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full py-12 border-t-2 border-black bg-white relative overflow-hidden">
            {/* Decorative manga mountain background */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none bg-bottom bg-no-repeat bg-cover"
                style={{ backgroundImage: 'url(/manga-mountains.jpg)' }}
            />
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                <p className="text-sm text-black font-mono font-bold">
                    © {new Date().getFullYear()} <span className="text-black border-b-2 border-black">KESH</span>. All rights reserved.
                </p>
                <div className="flex gap-6 items-center">
                    <a href="https://github.com/bananatruck" target="_blank" rel="noreferrer" className="text-black hover:underline decoration-2 underline-offset-4 cursor-target flex items-center gap-1 font-bold uppercase text-xs">
                        <Github className="h-4 w-4" />
                        GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/keshavjindal04/" target="_blank" rel="noreferrer" className="text-black hover:underline decoration-2 underline-offset-4 cursor-target flex items-center gap-1 font-bold uppercase text-xs">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                    </a>
                    <a href="mailto:keshav.jmgl@gmail.com" className="text-black hover:underline decoration-2 underline-offset-4 cursor-target flex items-center gap-1 font-bold uppercase text-xs">
                        <Mail className="h-4 w-4" />
                        Email
                    </a>
                </div>
            </div>
        </footer>
    );
}
