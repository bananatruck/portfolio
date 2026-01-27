"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { TypingEffect } from "@/components/typing-effect";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="container mx-auto px-6 py-12 lg:py-24 relative overflow-hidden" style={{ backgroundColor: '#f5f5f0' }}>
            <div className="max-w-5xl flex flex-col lg:flex-row items-center gap-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8 relative z-10"
                >
                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter whitespace-nowrap">
                        <span className="block text-black/60 text-2xl sm:text-3xl lg:text-4xl font-normal mb-4 tracking-normal font-mono">
                            Hi, I&apos;m
                        </span>
                        <span className="text-black font-black">
                            <TypingEffect text="Keshav Jindal" />
                        </span>
                    </h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-4"
                    >
                        <p className="text-xl sm:text-3xl text-black/70 font-light max-w-3xl leading-relaxed">
                            I am a full stack developer focused on <span className="text-black font-bold border-b-2 border-black">thoughtful systems</span> and <span className="text-black font-bold border-b-2 border-black">user customisability</span>.
                        </p>
                        <p className="text-lg sm:text-2xl text-black/60 font-light">
                            Full stack and AI Developer based in Long Beach.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="flex flex-col gap-2 text-sm font-mono text-black/70 pt-4"
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                            <span>Currently: Co-President @ ACM</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-wrap gap-6 pt-8"
                    >
                        <div className="flex gap-4">
                            <Link href="https://github.com/bananatruck" target="_blank" className="text-black/60 hover:text-black transition-colors cursor-target">
                                <Github className="w-6 h-6" />
                            </Link>
                            <Link href="https://www.linkedin.com/in/keshavjindal04/" target="_blank" className="text-black/60 hover:text-black transition-colors cursor-target">
                                <Linkedin className="w-6 h-6" />
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="pt-12 border-t-2 border-black"
                    >
                        <div>
                            <h3 className="text-sm font-mono text-black/70 mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                                Currently
                            </h3>
                            <p className="text-lg font-medium text-black">Co-President</p>
                            <p className="text-black/70">@ ACM</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Manga Portrait Background */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="hidden lg:flex flex-shrink-0 relative"
                >
                    <div className="relative w-80 h-80 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        <img
                            src="/images/pfp hero.jpg"
                            alt="Keshav Jindal"
                            className="w-full h-full object-cover grayscale contrast-125"
                        />
                        {/* Overlay gradient for better text contrast nearby */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-transparent" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
