"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, ArrowUpRight, Terminal, Radio, Activity } from "lucide-react";
import Link from "next/link";
import { TypingEffect } from "@/components/typing-effect";
import dynamic from "next/dynamic";

const LetterGlitch = dynamic(() => import("@/components/LetterGlitch"), {
    ssr: false,
});

export function Hero() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem("loadingDone")) {
            setReady(true);
            return;
        }

        const handler = () => {
            sessionStorage.setItem("loadingDone", "1");
            setReady(true);
        };
        window.addEventListener("loadingComplete", handler);

        const fallback = setTimeout(() => {
            sessionStorage.setItem("loadingDone", "1");
            setReady(true);
        }, 3200);

        return () => {
            window.removeEventListener("loadingComplete", handler);
            clearTimeout(fallback);
        };
    }, []);

    return (
        <section className="w-full py-4 sm:py-6 relative bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
            {/* LetterGlitch Immersive Background Perfectly Aligned to Hero Container */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
                <LetterGlitch
                    glitchSpeed={50}
                    centerVignette={true}
                    outerVignette={false}
                    smooth={true}
                    glitchColors={["#10b981", "#059669", "#34d399", "#28394f", "#86a887"]}
                />
            </div>

            <div className="w-full max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center text-center gap-2.5">

                {/* Top Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-foreground text-background font-mono text-[10px] sm:text-[11px] uppercase tracking-wider border border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
                    <span>SYSTEM ONLINE // BOOTING ARCH...</span>
                </motion.div>

                {/* Main Heading & Subtitle */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-1.5 max-w-lg w-full"
                >
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter font-manhattan uppercase leading-tight mb-1">
                        <span className="block text-foreground/60 text-[11px] sm:text-sm font-mono tracking-wider font-medium mb-0.5">
                            Hi, I&apos;m
                        </span>
                        <span className="text-foreground border-b-2 sm:border-b-3 border-foreground pb-0.5 inline-block font-manhattan">
                            {ready ? <TypingEffect text="Keshav Jindal" /> : "Keshav Jindal"}
                        </span>
                    </h1>

                    <p className="text-xs sm:text-base text-foreground/80 font-mono font-medium max-w-md mx-auto mt-1 pt-0.5 leading-relaxed">
                        Full Stack & AI Systems Engineer
                    </p>
                </motion.div>

                {/* Hero Showcase Row with 1 Small Square Box on Left & Right */}
                <div className="w-full flex items-center justify-center gap-3 sm:gap-4 my-1">

                    {/* Left Small Square Box (Flanking left) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="hidden xl:flex flex-col justify-between w-32 h-32 p-2 border-2 border-foreground bg-background shadow-[3px_3px_0px_0px_hsl(var(--foreground))] text-left font-mono text-[9px] select-none flex-shrink-0"
                    >
                        <div className="flex items-center justify-between border-b border-foreground/30 pb-0.5 font-bold uppercase">
                            <span className="flex items-center gap-1 text-foreground">
                                <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                                <span>SYSTEM</span>
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse" />
                        </div>

                        <div className="space-y-0.5 text-foreground/80">
                            <div><span className="font-bold text-foreground">ROLE:</span> FULL STACK</div>
                            <div><span className="font-bold text-foreground">LOC:</span> LB, CA</div>
                            <div><span className="font-bold text-emerald-500">OS:</span> ARCH LINUX</div>
                        </div>

                        <div className="text-[8px] text-emerald-500 font-bold bg-emerald-500/10 px-1 py-0.5 border border-emerald-500/30">
                            ● ACTIVE TELEMETRY
                        </div>
                    </motion.div>

                    {/* Main Image Frame */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 15 }}
                        animate={ready ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 15 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full max-w-lg flex-1"
                    >
                        <div className="border-2 sm:border-3 border-foreground bg-background shadow-[4px_4px_0px_0px_hsl(var(--foreground))] sm:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] transition-all duration-300 hover:shadow-[10px_10px_0px_0px_hsl(var(--foreground))]">
                            {/* Retro Window Header */}
                            <div className="bg-foreground text-background px-2.5 py-1 flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-wider border-b-2 border-foreground select-none">
                                <div className="flex items-center gap-1">
                                    <Terminal className="w-3 h-3 text-emerald-400" />
                                    <span>PROJECT .EXE</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse ml-0.5" />
                                </div>
                                <div className="flex items-center gap-1 font-mono text-[10px]">
                                    <span className="hover:text-amber-300 cursor-pointer">_</span>
                                    <span className="hover:text-amber-300 cursor-pointer">□</span>
                                    <span className="hover:text-rose-400 cursor-pointer">✕</span>
                                </div>
                            </div>

                            {/* Pixel Art Image Container */}
                            <div className="relative aspect-[16/9] w-full max-h-[240px] sm:max-h-[280px] overflow-hidden bg-black flex items-center justify-center">
                                <img
                                    src="/images/project-exe-hero.jpg"
                                    alt="Project.exe Hero"
                                    className="w-full h-full object-contain filter contrast-125 hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Small Square Box (Flanking right) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="hidden xl:flex flex-col justify-between w-32 h-32 p-2 border-2 border-foreground bg-background shadow-[3px_3px_0px_0px_hsl(var(--foreground))] text-right font-mono text-[9px] select-none flex-shrink-0"
                    >
                        <div className="flex items-center justify-between border-b border-foreground/30 pb-0.5 font-bold uppercase">
                            <span className="text-foreground/60 text-[8px]">LINKS</span>
                            <span className="flex items-center gap-0.5 text-emerald-500">
                                <Activity className="w-2.5 h-2.5" />
                                <span>9+ REPOS</span>
                            </span>
                        </div>

                        <div className="flex flex-col gap-0.5 pt-0.5">
                            <Link
                                href="https://github.com/bananatruck"
                                target="_blank"
                                className="inline-flex items-center justify-between px-1.5 py-0.5 bg-foreground text-background text-[9px] font-bold uppercase border border-foreground hover:bg-emerald-500 hover:text-black transition-colors"
                            >
                                <Github className="w-2.5 h-2.5" />
                                <span>GitHub</span>
                                <ArrowUpRight className="w-2.5 h-2.5" />
                            </Link>

                            <Link
                                href="https://www.linkedin.com/in/keshavjindal04/"
                                target="_blank"
                                className="inline-flex items-center justify-between px-1.5 py-0.5 bg-background text-foreground text-[9px] font-bold uppercase border border-foreground hover:border-emerald-500 hover:text-emerald-500 transition-colors"
                            >
                                <Linkedin className="w-2.5 h-2.5" />
                                <span>LinkedIn</span>
                                <ArrowUpRight className="w-2.5 h-2.5" />
                            </Link>
                        </div>

                        <div className="text-[8px] text-foreground/70 font-bold uppercase border-t border-foreground/30 pt-0.5 text-right">
                            CS UNDERGRAD
                        </div>
                    </motion.div>
                </div>

                {/* Action Buttons for Mobile/Tablet */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="flex xl:hidden items-center justify-center gap-3 pt-2"
                >
                    <Link
                        href="https://github.com/bananatruck"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-background font-mono text-xs font-bold uppercase tracking-wider border-2 border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] hover:bg-emerald-500 hover:text-black transition-all"
                    >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                        href="https://www.linkedin.com/in/keshavjindal04/"
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-background text-foreground font-mono text-xs font-bold uppercase tracking-wider border-2 border-foreground shadow-[3px_3px_0px_0px_hsl(var(--foreground))] hover:border-emerald-500 hover:text-emerald-500 transition-all"
                    >
                        <Linkedin className="w-3.5 h-3.5" />
                        <span>LinkedIn</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}





