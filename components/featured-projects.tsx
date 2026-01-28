"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import { TerminalWindow } from "@/components/terminal-window";
import DecryptedText from "@/components/DecryptedText";

export type Project = {
    title: string;
    description: string;
    tags: string[];
    link?: string;
    github?: string;
    featured?: boolean;
};

const projects: Project[] = [
    {
        title: "Barter",
        description: "Skill exchange platform with real-time chat, AR navigation, and AI-enabled matching system.",
        tags: ["React", "Flask", "Firebase", "SocketIO", "AR"],
        link: "https://devpost.com",
        github: "https://github.com/bananatruck/Barter",
        featured: true
    },
    {
        title: "FableFrog",
        description: "Text-to-speech storytelling app built in 36h. Features RAFT prompts, kid-safe content filtering, and 20+ emotion parameters.",
        tags: ["Python", "React Native", "OpenAI", "ElevenLabs"],
        link: "https://devpost.com",
        github: "https://github.com/bananatruck/FableFrog",
        featured: true
    },
    {
        title: "Cyno (Sitara)",
        description: "AI Astrobuddy - an intelligent space companion that provides personalized astronomical insights and guidance.",
        tags: ["Python", "OpenAI", "React", "Astronomy API"],
        github: "https://github.com/bananatruck/Cyno",
        featured: true
    },
    {
        title: "DevFlowAgent",
        description: "Agentic AI workflow automation tool that helps automate steps in coding projects and streamline developer workflows.",
        tags: ["Python", "LLMs", "Automation", "CLI"],
        github: "https://github.com/bananatruck/DevFlow",
        featured: true
    },
    {
        title: "JM Global Logistics",
        description: "Full-stack company website for a logistics company with modern design and comprehensive service showcase.",
        tags: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
        link: "https://jmgloballogistics.com",
        featured: true
    }
];

export function FeaturedProjects() {
    return (
        <section className="py-24 relative overflow-hidden" style={{ backgroundColor: '#f5f5f0' }}>
            <div className="container px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="space-y-8">
                        <div className="mb-8">
                            <h2 className="text-3xl md:text-4xl font-black mb-2 font-mono uppercase tracking-wider">
                                <span className="text-foreground border-b-4 border-foreground">
                                    <DecryptedText
                                        text="Built Apps"
                                        animateOn="view"
                                        revealDirection="center"
                                        sequential={true}
                                        speed={30}
                                        className="text-foreground"
                                        encryptedClassName="text-foreground/50"
                                    />
                                </span>
                            </h2>
                            <p className="text-foreground/70">
                                A selection of my recent work
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="max-w-5xl mx-auto">
                    {/* Terminal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <TerminalWindow title="zsh — 80x24">
                            <div className="mb-6 text-foreground font-bold">
                                <span className="text-foreground">bananatruck</span>
                                <span className="text-foreground">:</span>
                                <span className="text-foreground/60">~/projects</span>
                                <span className="text-foreground">$</span> ls -la
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {projects.map((project, index) => (
                                    <motion.div
                                        key={project.title}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <ProjectCard project={project} />
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-6 flex items-center gap-2">
                                <span className="text-foreground">user@portfolio</span>
                                <span className="text-foreground">:</span>
                                <span className="text-foreground/60">~/projects</span>
                                <span className="text-foreground">$</span>
                                <span className="w-2 h-5 bg-foreground animate-pulse" />
                            </div>
                        </TerminalWindow>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
