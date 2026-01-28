"use client";

import { useState } from "react";
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from '@/components/project-card';
import { ProjectModal } from '@/components/project-modal';
import Particles from '@/components/Particles';
import { TerminalWindow } from '@/components/terminal-window';


// Define the Project type locally since it's not exported from a shared types file yet
interface Project {
    title: string;
    description: string;
    tags: string[];
    demo: string;
    github: string;
    image?: string; // Added image for InfiniteMenu
}

const projects: Project[] = [
    {
        title: "Barter",
        description: "Skill exchange platform with real-time chat, AR navigation, and AI-enabled matching. Built for seamless skill trading between users.",
        tags: ["React", "Flask", "Firebase", "SocketIO", "AR"],
        demo: "https://devpost.com",
        github: "https://github.com/bananatruck/Barter",
        image: "https://picsum.photos/seed/barter/600/600?grayscale"
    },
    {
        title: "FableFrog",
        description: "Text-to-speech storytelling app built in 36h. Features RAFT prompts, kid-safe content filtering, and 20+ emotion parameters.",
        tags: ["Python", "React Native", "OpenAI", "ElevenLabs"],
        demo: "https://devpost.com",
        github: "https://github.com/bananatruck/FableFrog",
        image: "https://picsum.photos/seed/fablefrog/600/600?grayscale"
    },
    {
        title: "Cyno (Sitara)",
        description: "AI Astrobuddy - an intelligent space companion providing personalized astronomical insights, star charts, and celestial guidance.",
        tags: ["Python", "OpenAI", "React", "Astronomy API"],
        demo: "https://demo.com",
        github: "https://github.com/bananatruck/Cyno",
        image: "https://picsum.photos/seed/cyno/600/600?grayscale"
    },
    {
        title: "DevFlowAgent",
        description: "Agentic AI workflow automation tool that helps automate repetitive steps in coding projects and streamline developer workflows.",
        tags: ["Python", "LLMs", "Automation", "CLI"],
        demo: "https://demo.com",
        github: "https://github.com/bananatruck/DevFlow",
        image: "https://picsum.photos/seed/devflow/600/600?grayscale"
    },
    {
        title: "Portfolio Website",
        description: "Modern developer portfolio with terminal aesthetics, Three.js animations, and interactive UI components. You're looking at it!",
        tags: ["Next.js", "TypeScript", "Tailwind", "Three.js"],
        demo: "/",
        github: "https://github.com/bananatruck/portfolio-",
        image: "https://picsum.photos/seed/portfolio/600/600?grayscale"
    }
];



export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <div className="relative min-h-screen pt-24 pb-16 bg-background">
            {/* Background image layer */}
            <div
                className="absolute inset-0 z-0 opacity-20 dark:opacity-10 grayscale dark:invert"
                style={{
                    backgroundImage: 'url("/images/projects.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            ></div>
            {/* Subtle manga grid background */}
            <div className="absolute inset-0 z-1 opacity-10 pointer-events-none dark:hidden" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute inset-0 z-1 opacity-10 pointer-events-none hidden dark:block" style={{ backgroundImage: 'radial-gradient(#f5f5f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <Badge variant="default" className="mb-4 bg-foreground text-white border-foreground font-mono uppercase">
                        <span className="mr-2">●</span>
                        PROJECTS
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 font-serif uppercase tracking-wider">
                        <span className="text-foreground border-b-4 border-foreground">Featured Work</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl font-mono">
                        A collection of systems, tools, and experiments I've engineered.
                    </p>
                </motion.div>



                {/* Terminal View */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <TerminalWindow title="zsh — projects">
                        <div className="mb-6 text-foreground font-bold">
                            <span className="text-foreground">user@portfolio</span>
                            <span className="text-foreground">:</span>
                            <span className="text-foreground/60">~/all-projects</span>
                            <span className="text-foreground">$</span> ls -la --sort=date
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    onClick={() => setSelectedProject(project)}
                                    className="cursor-pointer"
                                >
                                    <ProjectCard project={project} />
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center gap-2">
                            <span className="text-foreground">user@portfolio</span>
                            <span className="text-foreground">:</span>
                            <span className="text-foreground/60">~/all-projects</span>
                            <span className="text-foreground">$</span>
                            <span className="w-2 h-5 bg-foreground animate-pulse" />
                        </div>
                    </TerminalWindow>
                </motion.div>
            </div>

            <ProjectModal
                project={selectedProject}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </div>
    );
}
