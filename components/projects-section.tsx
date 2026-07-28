"use client";

import { useState, useRef } from "react";
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from '@/components/project-card';
import { ProjectModal } from '@/components/project-modal';
import { TerminalWindow } from '@/components/terminal-window';

export interface Project {
    title: string;
    description: string;
    tags: string[];
    demo: string;
    github: string;
    image?: string;
}

const projects: Project[] = [
    {
        title: "LaunchGuard",
        description: "Local-first deployment intelligence platform. Audits security with Trivy/OSV-Scanner, simulates rootless Podman OCI sandboxes, & generates reviewable PRs. Verified 40/40 fixture suite.",
        tags: ["Rust", "Podman", "OCI", "Security", "Trivy", "Tauri"],
        demo: "https://github.com/bananatruck/launchguard",
        github: "https://github.com/bananatruck/launchguard",
        image: "https://picsum.photos/seed/launchguard/600/600?grayscale"
    },
    {
        title: "DevFlow Agent",
        description: "Agentic AI workflow automation turning feature requests into PR-ready code via a 4-step LangGraph cycle (Plan → Checklist → Execute → Summary) with AST tree-sitter parsing.",
        tags: ["Python", "FastAPI", "Next.js", "LangGraph", "DeepSeek", "Docker"],
        demo: "https://github.com/bananatruck/devflow-agent",
        github: "https://github.com/bananatruck/devflow-agent",
        image: "https://picsum.photos/seed/devflow/600/600?grayscale"
    },
    {
        title: "DocWeave",
        description: "Policy-aware, distributed documentation crawler in Go with PostgreSQL SKIP LOCKED lease work queues for crash recovery, host rate limiting, & Grafana observability.",
        tags: ["Go", "PostgreSQL", "Prometheus", "Grafana", "Docker", "SSE"],
        demo: "https://github.com/bananatruck/docweave",
        github: "https://github.com/bananatruck/docweave",
        image: "https://picsum.photos/seed/docweave/600/600?grayscale"
    },
    {
        title: "Employmentmaxxing",
        description: "Telemetry AI job command center scraping 100+ official tech company ATS APIs with active HTTP link verification, 7-factor Gemini resume match scoring, & Kanban tracking.",
        tags: ["Python", "FastAPI", "Gemini AI", "SQLite", "BeautifulSoup4"],
        demo: "https://github.com/bananatruck/employmentmaxxing",
        github: "https://github.com/bananatruck/employmentmaxxing",
        image: "https://picsum.photos/seed/employmentmaxxing/600/600?grayscale"
    },
    {
        title: "Hubris",
        description: "Local-first activity, habit, and goal tracking monorepo featuring 2-second quick logging, GitHub-style heatmaps, & frequency scoring across Mobile and Chrome extension.",
        tags: ["React Native", "Expo", "TypeScript", "SQLite", "Turborepo"],
        demo: "https://github.com/bananatruck/hubris",
        github: "https://github.com/bananatruck/hubris",
        image: "https://picsum.photos/seed/hubris/600/600?grayscale"
    },
    {
        title: "JM Global Logistics",
        description: "Full-stack corporate freight logistics platform featuring a 5-page interactive flow, shipment tracking simulator, and container spec filter with imperial/metric conversions.",
        tags: ["Next.js", "TypeScript", "Tailwind CSS", "Vite"],
        demo: "https://jmgloballogistics.com",
        github: "https://github.com/bananatruck/jmgloballogistics",
        image: "https://picsum.photos/seed/jmgloballogistics/600/600?grayscale"
    },
    {
        title: "Barter",
        description: "Skill exchange platform with real-time chat, AR navigation, and AI-enabled matching system. Built for seamless skill trading between users.",
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
        demo: "https://github.com/bananatruck/Cyno",
        github: "https://github.com/bananatruck/Cyno",
        image: "https://picsum.photos/seed/cyno/600/600?grayscale"
    }
];

interface LogEntry {
    cmd?: string;
    text?: string | React.ReactNode;
    type?: 'cmd' | 'output' | 'error' | 'success';
}

export function ProjectsSection() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [tagFilter, setTagFilter] = useState<string>("ALL");
    const [inputVal, setInputVal] = useState("");
    const [logs, setLogs] = useState<LogEntry[]>([
        { cmd: "ls -la --sort=date", type: 'cmd' },
        { text: "[System: Interactive zsh shell ready. Type 'help' for available commands]", type: 'success' }
    ]);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredProjects = tagFilter === "ALL" 
        ? projects 
        : projects.filter(p => p.tags.some(t => t.toLowerCase() === tagFilter.toLowerCase()));

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputVal.trim();
        if (!trimmed) return;

        const newLogs: LogEntry[] = [...logs, { cmd: trimmed, type: 'cmd' }];
        const parts = trimmed.split(" ");
        const action = parts[0].toLowerCase();
        const arg = parts.slice(1).join(" ").toLowerCase();

        switch (action) {
            case 'help':
                newLogs.push({
                    text: (
                        <div className="space-y-1 text-emerald-400 font-mono text-xs">
                            <div>AVAILABLE COMMANDS:</div>
                            <div>  <span className="font-bold text-foreground">help</span>                - Show this menu</div>
                            <div>  <span className="font-bold text-foreground">ls | projects</span>       - List all projects</div>
                            <div>  <span className="font-bold text-foreground">cat &lt;name&gt;</span>          - Inspect project details (e.g. cat launchguard)</div>
                            <div>  <span className="font-bold text-foreground">filter &lt;tag&gt;</span>       - Filter grid by tag (e.g. filter rust, filter python, filter all)</div>
                            <div>  <span className="font-bold text-foreground">arch | neofetch</span>     - Show Arch Linux system specs</div>
                            <div>  <span className="font-bold text-foreground">whoami</span>              - Show developer bio</div>
                            <div>  <span className="font-bold text-foreground">clear</span>               - Clear terminal history</div>
                        </div>
                    ),
                    type: 'output'
                });
                break;

            case 'ls':
            case 'projects':
                newLogs.push({
                    text: (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs font-mono text-foreground/90">
                            {projects.map(p => (
                                <div key={p.title} className="flex items-center gap-2">
                                    <span className="text-emerald-500 font-bold">❯</span>
                                    <span className="font-bold">{p.title}</span>
                                    <span className="text-foreground/50 text-[10px]">[{p.tags.slice(0, 3).join(", ")}]</span>
                                </div>
                            ))}
                        </div>
                    ),
                    type: 'output'
                });
                break;

            case 'cat':
                if (!arg) {
                    newLogs.push({ text: "Usage: cat <project-name> (e.g. cat launchguard)", type: 'error' });
                } else {
                    const match = projects.find(p => p.title.toLowerCase().includes(arg));
                    if (match) {
                        setSelectedProject(match);
                        newLogs.push({
                            text: (
                                <div className="p-2 border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-mono text-xs space-y-1">
                                    <div className="font-bold uppercase text-emerald-400">=== {match.title} ===</div>
                                    <div>{match.description}</div>
                                    <div className="text-[11px] text-foreground/70">TAGS: {match.tags.join(" | ")}</div>
                                    <div className="text-[10px] text-emerald-400 font-bold pt-1">Opened detailed project view modal ↗</div>
                                </div>
                            ),
                            type: 'output'
                        });
                    } else {
                        newLogs.push({ text: `Project '${arg}' not found. Type 'ls' to see list.`, type: 'error' });
                    }
                }
                break;

            case 'filter':
                if (!arg || arg === 'all') {
                    setTagFilter("ALL");
                    newLogs.push({ text: "Filter reset to show ALL projects.", type: 'success' });
                } else {
                    setTagFilter(arg.toUpperCase());
                    newLogs.push({ text: `Grid filtered by tag matching: '${arg.toUpperCase()}'.`, type: 'success' });
                }
                break;

            case 'arch':
            case 'neofetch':
                newLogs.push({
                    text: (
                        <pre className="text-[11px] text-emerald-400 font-mono leading-tight overflow-x-auto">
{`       /\\         kesh@arch-linux
      /  \\        ---------------
     / /\\ \\       OS: Arch Linux x86_64
    / /  \\ \\      Kernel: 6.8.9-arch1-1
   / /    \\ \\     Uptime: 14 days, 2 hours
  / /  /\\  \\ \\    Shell: zsh 5.9
 / /  /  \\  \\ \\   WM: Hyprland / Wayland
/ /__/    \\__\\ \\  Terminal: Alacritty
\\/____________\\/  CPU: Full Stack & AI Systems Engine`}
                        </pre>
                    ),
                    type: 'output'
                });
                break;

            case 'whoami':
                newLogs.push({
                    text: "Keshav Jindal // Full Stack & AI Systems Engineer // Long Beach, CA",
                    type: 'output'
                });
                break;

            case 'clear':
                setLogs([]);
                setInputVal("");
                return;

            default:
                newLogs.push({
                    text: `zsh: command not found: ${trimmed}. Type 'help' for commands list.`,
                    type: 'error'
                });
                break;
        }

        setLogs(newLogs);
        setInputVal("");
    };

    return (
        <div className="relative py-12 bg-background">
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

            <div className="max-w-4xl relative z-10 mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
                >
                    <div>
                        <Badge variant="default" className="mb-3 bg-foreground text-white border-foreground font-mono uppercase">
                            <span className="mr-2 text-emerald-400">●</span>
                            PROJECTS
                        </Badge>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 font-manhattan uppercase tracking-wider">
                            <span className="text-foreground border-b-3 border-foreground">Featured Work</span>
                        </h1>
                        <p className="text-muted-foreground text-xs sm:text-sm max-w-xl font-mono mt-2 mb-1">
                            A collection of systems, tools, and experiments I&apos;ve engineered.
                        </p>

                    </div>

                    {/* Tag Filter Quick Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                        {["ALL", "Rust", "Python", "Go", "Next.js"].map(tag => (
                            <button
                                key={tag}
                                onClick={() => setTagFilter(tag)}
                                className={`px-2.5 py-1 border transition-all ${
                                    tagFilter.toLowerCase() === tag.toLowerCase()
                                        ? "bg-foreground text-background font-bold border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]"
                                        : "border-foreground/40 text-foreground/70 hover:border-foreground hover:text-foreground"
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Interactive Terminal View */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <TerminalWindow title="zsh — interactive projects terminal">
                        
                        {/* Command Input Prompt Form - Clean Terminal Prompt */}
                        <form onSubmit={handleCommand} className="mb-4 flex items-center gap-2 font-mono text-xs sm:text-sm">
                            <span className="text-emerald-500 font-bold">user@portfolio</span>
                            <span className="text-foreground">:</span>
                            <span className="text-foreground/70">~/all-projects</span>
                            <span className="text-emerald-500 font-bold">❯</span>
                            
                            <div className="flex-1 flex items-center">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputVal}
                                    onChange={(e) => setInputVal(e.target.value)}
                                    placeholder="type command (e.g. 'help', 'cat launchguard', 'arch')..."
                                    className="w-full bg-transparent text-foreground placeholder-foreground/40 outline-none border-b border-emerald-500/60 focus:border-emerald-400 font-mono py-0.5"
                                />
                                <span className="w-2 h-4 bg-emerald-400 animate-pulse ml-1 inline-block flex-shrink-0" />
                            </div>
                        </form>


                        {/* Terminal History Log */}
                        <div className="space-y-3 mb-6 font-mono text-xs sm:text-sm">
                            {logs.map((entry, idx) => (
                                <div key={idx} className="space-y-1">
                                    {entry.cmd && (
                                        <div className="flex items-center gap-2 font-bold">
                                            <span className="text-emerald-500">user@portfolio</span>
                                            <span className="text-foreground">:</span>
                                            <span className="text-foreground/70">~/all-projects</span>
                                            <span className="text-emerald-500 font-bold">❯</span>
                                            <span className="text-foreground">{entry.cmd}</span>
                                        </div>
                                    )}
                                    {entry.text && (
                                        <div className={`pl-2 ${
                                            entry.type === 'error' ? 'text-rose-400 font-bold' :
                                            entry.type === 'success' ? 'text-emerald-400 font-bold' : 'text-foreground/90'
                                        }`}>
                                            {entry.text}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Interactive Grid Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
                            {filteredProjects.map((project, index) => (
                                <motion.div
                                    key={project.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.08 }}
                                    onClick={() => setSelectedProject(project)}
                                    className="cursor-pointer"
                                >
                                    <ProjectCard project={project} />
                                </motion.div>
                            ))}
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


