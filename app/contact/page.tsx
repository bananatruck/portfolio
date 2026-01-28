"use client";

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import { CenteredContainer } from '@/components/centered-container';

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

import Squares from '@/components/Squares';

export default function ContactPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 relative overflow-hidden bg-background">
            {/* Background image layer */}
            <div
                className="absolute inset-0 z-0 opacity-20 dark:opacity-10 grayscale dark:invert"
                style={{
                    backgroundImage: 'url("/images/contact.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            ></div>
            {/* Subtle manga grid background */}
            <div className="absolute inset-0 z-1 opacity-10 pointer-events-none dark:hidden" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute inset-0 z-1 opacity-10 pointer-events-none hidden dark:block" style={{ backgroundImage: 'radial-gradient(#f5f5f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <CenteredContainer maxWidth="narrow" className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-black mb-4 font-serif uppercase tracking-widest text-foreground">
                        <span className="text-foreground border-b-4 border-foreground">Contact</span>
                    </h1>
                    <p className="text-foreground/70 text-lg font-mono">
                        Let's connect
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {socialLinks.map((link, index) => {
                        const Icon = link.icon;
                        return (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                target={link.name !== 'Email' ? '_blank' : undefined}
                                rel={link.name !== 'Email' ? 'noopener noreferrer' : undefined}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="group relative p-8 manga-panel hover:bg-foreground hover:text-white transition-all duration-300 overflow-hidden cursor-target flex flex-col items-center text-center gap-4"
                            >
                                <div className="p-4 border-2 border-foreground rounded-full group-hover:border-white group-hover:bg-background/10 transition-colors">
                                    <Icon className="w-8 h-8 text-foreground group-hover:text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-mono font-bold text-foreground group-hover:text-white transition-colors uppercase">
                                        {link.name}
                                    </h3>
                                    <p className="text-sm text-foreground/60 mt-1 group-hover:text-white/80 font-serif">
                                        {link.description}
                                    </p>
                                </div>
                            </motion.a>
                        );
                    })}
                </div>
            </CenteredContainer>
        </div>
    );
}
