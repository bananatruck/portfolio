"use client";

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Radio, ShieldCheck, MapPin, Smartphone } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';

const socialLinks = [
    {
        name: 'LinkedIn',
        href: 'https://linkedin.com/in/keshavjindal04/',
        icon: Linkedin,
        description: 'Professional network'
    },
    {
        name: 'GitHub',
        href: 'https://github.com/bananatruck',
        icon: Github,
        description: 'Code repositories'
    },
    {
        name: 'Discord',
        href: '#',
        icon: FaDiscord,
        description: 'banana.truck'
    },
    {
        name: 'Email',
        href: 'mailto:keshav.jmgl@gmail.com',
        icon: Mail,
        description: 'Direct contact'
    },
];

export function ContactSection() {
    return (
        <div className="py-12 sm:py-16 relative overflow-hidden bg-background">
            {/* Background image layer cropped from bottom */}
            <div
                className="absolute inset-0 z-0 opacity-15 dark:opacity-10 grayscale dark:invert"
                style={{
                    backgroundImage: 'url("/images/contact.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center'
                }}
            ></div>
            {/* Subtle manga grid background */}
            <div className="absolute inset-0 z-1 opacity-10 pointer-events-none dark:hidden" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute inset-0 z-1 opacity-10 pointer-events-none hidden dark:block" style={{ backgroundImage: 'radial-gradient(#f5f5f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-10 py-2">
                
                {/* Clean Heading without Subheading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center my-4 sm:my-6"
                >
                    <h1 className="text-2xl md:text-4xl font-black font-display uppercase tracking-widest text-foreground">
                        <span className="text-foreground border-b-3 border-foreground pb-1.5">Contacts</span>
                    </h1>
                </motion.div>


                {/* 4 Spaced Social Action Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {socialLinks.map((link, index) => {
                        const Icon = link.icon;
                        return (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                target={link.name !== 'Email' ? '_blank' : undefined}
                                rel={link.name !== 'Email' ? 'noopener noreferrer' : undefined}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.03, y: -4 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ duration: 0.3, delay: index * 0.08 }}
                                className="group relative p-4 sm:p-5 manga-panel hover:bg-foreground transition-all duration-300 overflow-hidden cursor-target flex flex-col items-center text-center gap-3 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]"
                            >
                                <div className="p-2.5 border-2 border-foreground rounded-full group-hover:border-background group-hover:bg-background/10 transition-colors">
                                    <Icon className="w-5 h-5 text-foreground group-hover:text-background" />
                                </div>
                                <div>
                                    <h3 className="text-sm sm:text-base font-mono font-bold text-foreground group-hover:text-background transition-colors uppercase">
                                        {link.name}
                                    </h3>
                                    <p className="text-[11px] text-foreground/60 mt-0.5 group-hover:text-background/80 font-serif">
                                        {link.description}
                                    </p>
                                </div>
                            </motion.a>
                        );
                    })}
                </div>

                {/* Decluttered System & Telemetry Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono pt-2">
                    
                    {/* Custom Android ROM Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="p-4 sm:p-5 border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_hsl(var(--foreground))] space-y-3"
                    >
                        <div className="flex items-center justify-between border-b-2 border-foreground/30 pb-2.5">
                            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-xs">
                                <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Custom Android OS & ROM Tuning</span>
                            </div>
                            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 border border-emerald-500/30">
                                ROOTED // KERNEL TUNED
                            </span>
                        </div>

                        <p className="text-xs font-serif leading-relaxed text-foreground/80">
                            Building custom Android OS configurations, kernel tuning, and LineageOS / Magisk setups for ultra-low latency mobile performance.
                        </p>

                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-0.5">
                            <span className="px-1.5 py-0.5 border border-foreground/40 bg-foreground/5 font-bold">Magisk / KernelSU</span>
                            <span className="px-1.5 py-0.5 border border-foreground/40 bg-foreground/5 font-bold">LineageOS</span>
                            <span className="px-1.5 py-0.5 border border-foreground/40 bg-foreground/5 font-bold">Android ROM Ricing</span>
                        </div>
                    </motion.div>

                    {/* Location & Status Telemetry Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="p-4 sm:p-5 border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_hsl(var(--foreground))] space-y-3 flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between border-b-2 border-foreground/30 pb-3">
                            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs sm:text-sm">
                                <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                                <span>Direct Telemetry</span>
                            </div>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                        </div>

                        <div className="space-y-2 text-xs sm:text-sm">
                            <div className="flex items-center justify-between border-b border-foreground/10 pb-1.5">
                                <span className="text-foreground/60">LOCATION:</span>
                                <span className="font-bold flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                    Long Beach, CA
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-foreground/10 pb-1.5">
                                <span className="text-foreground/60">AVAILABILITY:</span>
                                <span className="text-emerald-500 font-bold">OPEN FOR OPPORTUNITIES</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-foreground/60">EST. RESPONSE:</span>
                                <span className="font-bold">&lt; 24 HOURS</span>
                            </div>
                        </div>

                        <div className="text-[10px] text-foreground/50 text-right pt-2 border-t border-foreground/20 flex items-center justify-between">
                            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> SECURE CHANNEL</span>
                            <span>33.7701° N, 118.1937° W</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}



