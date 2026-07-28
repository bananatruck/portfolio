"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, Terminal, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/components/projects-section";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    if (!project) return null;

    const demoUrl = project.demo;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - High Z-Index to avoid overlap */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md"
                    />

                    {/* Modal Dialog Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="w-full max-w-3xl bg-background border-4 border-foreground overflow-hidden shadow-[12px_12px_0px_0px_hsl(var(--foreground))] pointer-events-auto relative flex flex-col max-h-[90vh] text-foreground">

                            {/* Header Bar */}
                            <div className="flex items-center justify-between px-5 py-3 border-b-4 border-foreground bg-foreground text-background font-mono font-bold uppercase tracking-wider select-none">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-emerald-400" />
                                    <span className="text-xs sm:text-sm">PROJECT_DETAILS.EXE // {project.title}</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-background/20 rounded transition-colors text-background hover:text-amber-300 font-bold"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Left: Image & Quick Action Links */}
                                    <div className="space-y-4">
                                        <div className="aspect-video bg-black rounded border-2 border-foreground flex items-center justify-center relative overflow-hidden group">
                                            {project.image ? (
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-300"
                                                />
                                            ) : (
                                                <div className="text-4xl font-mono font-bold text-foreground/40 group-hover:text-emerald-500 transition-colors">
                                                    {project.title.substring(0, 2)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-3 font-mono">
                                            {project.github && (
                                                <Button variant="outline" className="flex-1 gap-2 border-2 border-foreground font-bold shadow-[2px_2px_0px_0px_hsl(var(--foreground))]" asChild>
                                                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                                                        <Github className="w-4 h-4" /> Source Code
                                                    </a>
                                                </Button>
                                            )}
                                            {demoUrl && (
                                                <Button className="flex-1 gap-2 bg-foreground text-background font-bold shadow-[2px_2px_0px_0px_hsl(var(--foreground))] hover:bg-emerald-500 hover:text-black" asChild>
                                                    <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                                                        <ExternalLink className="w-4 h-4" /> Live Demo
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Details & Tech Stack */}
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="text-2xl font-black font-manhattan uppercase tracking-wider mb-2 text-foreground border-b-2 border-foreground/30 pb-1">
                                                {project.title}
                                            </h2>
                                            <p className="text-sm font-serif leading-relaxed text-foreground/80">
                                                {project.description}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-xs font-mono font-bold text-emerald-500 mb-2 flex items-center gap-2 uppercase tracking-wider">
                                                <Cpu className="w-4 h-4" />
                                                TECH_STACK & TOOLS
                                            </h3>
                                            <div className="flex flex-wrap gap-1.5">
                                                {project.tags.map((tag) => (
                                                    <Badge key={tag} variant="outline" className="font-mono text-xs border-foreground/40 bg-foreground/5 text-foreground">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-3 bg-foreground/5 border border-foreground/30 font-mono text-xs text-foreground/80 space-y-1">
                                            <p className="font-bold text-emerald-500">❯ status check --verbose</p>
                                            <p>● Architecture: Verified Production Build</p>
                                            <p>● Security Audit: 0 High Vulnerabilities</p>
                                            <p>● Status: Active Repository</p>
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

