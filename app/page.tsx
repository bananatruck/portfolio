"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { Hero } from '@/components/hero';
import { FeaturedProjects } from '@/components/featured-projects';
import { TechStack } from '@/components/tech-stack';
import { CenteredContainer } from '@/components/centered-container';

import Squares from '@/components/Squares';

export default function Home() {
    return (
        <main className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#f5f5f0' }}>
            {/* Subtle grid background for manga aesthetic */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            {/* Hero Section - Full width with centered content */}
            <section className="min-h-screen flex items-center justify-center py-12 relative z-10">
                <CenteredContainer>
                    <Hero />
                </CenteredContainer>
            </section>

            {/* Featured Projects */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="py-12"
            >
                <CenteredContainer>
                    <FeaturedProjects />
                </CenteredContainer>
            </motion.div>

            {/* Tech Stack */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="py-12"
            >
                <CenteredContainer>
                    <TechStack />
                </CenteredContainer>
            </motion.div>
        </main>
    );
}
