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
        title: "LaunchGuard",
        description: "Local-first deployment intelligence platform. Audits security with Trivy/OSV-Scanner, simulates rootless Podman OCI sandboxes, and generates reviewable PRs. Verified 40/40 fixture suite.",
        tags: ["Rust", "Podman", "OCI", "Security", "Trivy", "Tauri"],
        github: "https://github.com/bananatruck/launchguard",
        featured: true
    },
    {
        title: "DevFlow Agent",
        description: "Agentic AI workflow automation turning feature requests into PR-ready code via a 4-step LangGraph cycle (Plan → Checklist → Execute → Summary) with AST tree-sitter parsing.",
        tags: ["Python", "FastAPI", "Next.js", "LangGraph", "DeepSeek", "Docker"],
        github: "https://github.com/bananatruck/devflow-agent",
        featured: true
    },
    {
        title: "DocWeave",
        description: "Policy-aware, distributed documentation crawler in Go with PostgreSQL SKIP LOCKED lease work queues for crash recovery, host rate limiting, & Grafana observability.",
        tags: ["Go", "PostgreSQL", "Prometheus", "Grafana", "Docker", "SSE"],
        github: "https://github.com/bananatruck/docweave",
        featured: true
    },
    {
        title: "Employmentmaxxing",
        description: "Telemetry AI job command center scraping 100+ official tech company ATS APIs with active HTTP link verification, 7-factor Gemini resume match scoring, & Kanban tracking.",
        tags: ["Python", "FastAPI", "Gemini AI", "SQLite", "BeautifulSoup4"],
        github: "https://github.com/bananatruck/employmentmaxxing",
        featured: true
    },
    {
        title: "Hubris",
        description: "Local-first activity, habit, and goal tracking monorepo featuring 2-second quick logging, GitHub-style heatmaps, & frequency scoring across Mobile and Chrome extension.",
        tags: ["React Native", "Expo", "TypeScript", "SQLite", "Turborepo"],
        github: "https://github.com/bananatruck/hubris",
        featured: true
    },
    {
        title: "JM Global Logistics",
        description: "Full-stack corporate freight logistics platform featuring a 5-page interactive flow, shipment tracking simulator, and container spec filter with imperial/metric conversions.",
        tags: ["Next.js", "TypeScript", "Tailwind CSS", "Vite"],
        link: "https://jmgloballogistics.com",
        featured: true
    }
];

export function FeaturedProjects() {
    return (
        <section className="py-24 relative overflow-hidden bg-background">
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
