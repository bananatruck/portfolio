"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Terminal } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export interface Project {
    title: string;
    description: string;
    tags: string[];
    link?: string;
    github?: string;
    featured?: boolean;
}

export function ProjectCard({ project, slug }: { project: Project; slug?: string }) {
    return (
        <div className="group relative flex flex-col justify-between h-full manga-panel p-5 sm:p-6 min-h-[210px]">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-foreground">
                        <Terminal className="w-4 h-4 text-emerald-500" />
                        <span className="text-[11px] font-mono font-bold text-foreground/70">~/projects/{slug ?? 'src'}</span>
                    </div>
                    <div className="flex gap-2.5">
                        {project.github && (
                            <Link
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-foreground hover:scale-110 transition-transform"
                            >
                                <Github className="w-4 h-4" />
                            </Link>
                        )}
                        {project.link && (
                            <Link
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-foreground hover:scale-110 transition-transform"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>

                <h3 className="text-lg font-black mb-2 text-foreground font-mono uppercase flex items-center gap-2">
                    <span className="text-emerald-500 transition-transform duration-300 group-hover:translate-x-0.5">❯</span>
                    <span className="group-hover:underline decoration-2 underline-offset-4">{project.title}</span>
                </h3>
                <p className="text-xs text-foreground/80 mb-3 line-clamp-3 font-serif leading-relaxed font-medium">
                    {project.description}
                </p>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                {project.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-mono text-foreground/70 border border-foreground/40 px-1.5 py-0.5 bg-transparent group-hover:border-foreground/70 transition-colors">
                        --{tag.toLowerCase().replace(/\s+/g, '-')}
                    </span>
                ))}
            </div>
        </div>
    );
}
