"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, Terminal, Cpu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/components/project-card";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-foreground/80 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="w-full max-w-3xl bg-zinc-900 border border-primary/30 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.1)] pointer-events-auto relative flex flex-col max-h-[90vh]">

                            {/* Header / Title Bar */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-950/50">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-primary" />
                                    <span className="font-mono text-sm text-muted-foreground">PROJECT_DETAILS.EXE</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-background/10 rounded transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                    {/* Left: Image / Visuals */}
                                    <div className="space-y-4">
                                        <div className="aspect-video bg-zinc-800 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                                            <div className="text-4xl font-mono font-bold text-zinc-700 group-hover:text-primary/50 transition-colors">
                                                {project.title.substring(0, 2)}
                                            </div>
                                            {/* Placeholder for actual screenshot */}
                                            <div className="absolute bottom-4 left-4 right-4 h-1 bg-zinc-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary w-2/3 animate-pulse" />
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {project.github && (
                                                <Button variant="outline" className="flex-1 gap-2" asChild>
                                                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                                                        <Github className="w-4 h-4" /> Source
                                                    </a>
                                                </Button>
                                            )}
                                            {project.link && (
                                                <Button className="flex-1 gap-2" asChild>
                                                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="w-4 h-4" /> Live Demo
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Details */}
                                    <div className="space-y-6">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {project.description}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-mono font-bold text-primary mb-3 flex items-center gap-2">
                                                <Cpu className="w-4 h-4" />
                                                TECH_STACK
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags.map((tag) => (
                                                    <Badge key={tag} variant="secondary" className="font-mono">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-zinc-950/50 rounded-lg border border-white/5 font-mono text-xs text-muted-foreground">
                                            <p className="mb-2 text-primary">$ status check</p>
                                            <p>✓ Deployment: Active</p>
                                            <p>✓ Last Commit: 2 days ago</p>
                                            <p>✓ Performance: 98/100</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
