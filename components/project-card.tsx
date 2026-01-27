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

export function ProjectCard({ project }: { project: Project }) {
    return (
        <div className="group relative flex flex-col justify-between h-full manga-panel p-6 min-h-[220px]">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-black">
                        <Terminal className="w-5 h-5" />
                        <span className="text-xs font-mono font-bold">./src</span>
                    </div>
                    <div className="flex gap-3">
                        {project.github && (
                            <Link
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-black hover:scale-110 transition-transform cursor-target"
                            >
                                <Github className="w-5 h-5" />
                            </Link>
                        )}
                        {project.link && (
                            <Link
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-black hover:scale-110 transition-transform cursor-target"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </Link>
                        )}
                    </div>
                </div>

                <h3 className="text-xl font-black mb-3 text-black group-hover:underline decoration-2 underline-offset-4 transition-all font-mono uppercase">
                    {project.title}
                </h3>
                <p className="text-sm text-black/80 mb-4 line-clamp-3 font-serif leading-relaxed font-medium">
                    {project.description}
                </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                    <span key={tag} className="text-xs font-mono font-bold text-black border border-black px-2 py-1 bg-transparent">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
