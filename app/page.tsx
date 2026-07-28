"use client";

import { Hero } from '@/components/hero';
import { TechStack } from '@/components/tech-stack';
import { ProjectsSection } from '@/components/projects-section';
import { AboutSection } from '@/components/about-section';
import { ContactSection } from '@/components/contact-section';

export default function Home() {
    return (
        <main className="min-h-screen relative overflow-x-hidden bg-background">
            {/* Subtle grid background for manga aesthetic */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none dark:hidden" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none hidden dark:block" style={{ backgroundImage: 'radial-gradient(#f5f5f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            {/* 1. Hero Section */}
            <section id="hero" className="relative z-10 pt-16">
                <Hero />
            </section>

            {/* 2. Projects Section */}
            <section id="projects" className="relative z-10">
                <ProjectsSection />
            </section>

            {/* 3. Tech Stack Section */}
            <section id="stack" className="relative z-10 py-8 w-full">
                <TechStack />
            </section>


            {/* 4. Contact Section (Moved above About) */}
            <section id="contact" className="relative z-10">
                <ContactSection />
            </section>

            {/* 5. About Section */}
            <section id="about" className="relative z-10">
                <AboutSection />
            </section>
        </main>
    );
}



