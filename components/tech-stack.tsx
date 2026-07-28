
"use client";

import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import {
    SiPython, SiC, SiCplusplus, SiTypescript, SiJavascript, SiRust, SiGo,
    SiFlask, SiJsonwebtokens, SiAmazonwebservices, SiAmazonec2, SiAmazons3,
    SiAmazondynamodb, SiAmazonrds, SiAwslambda, SiPostgresql, SiMongodb, SiRedis,
    SiTensorflow, SiPytorch, SiOpencv, SiOpenai, SiDocker, SiGithubactions,
    SiTerraform, SiLinux, SiGnubash
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { TbSql, TbServerCog, TbApi, TbPlugConnected, TbLock, TbContainer, TbInfinity, TbCloudComputing } from "react-icons/tb";
import { IconType } from "react-icons";
import LogoLoop, { LogoItem } from "./LogoLoop";

interface TechItem {
    name: string;
    icon: IconType;
    color: string;
}

const techItems: TechItem[] = [
    // Languages
    { name: "Python", icon: SiPython, color: "#3776AB" },
    { name: "Java", icon: FaJava, color: "#007396" },
    { name: "C", icon: SiC, color: "#A8B9CC" },
    { name: "C++", icon: SiCplusplus, color: "#00599C" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { name: "SQL", icon: TbSql, color: "#4479A1" },
    { name: "Rust", icon: SiRust, color: "#DEA584" },
    { name: "Go", icon: SiGo, color: "#00ADD8" },
    // Backend
    { name: "Microservices", icon: TbServerCog, color: "#22c55e" },
    { name: "REST", icon: TbApi, color: "#22c55e" },
    { name: "WebSockets", icon: TbPlugConnected, color: "#22c55e" },
    { name: "Flask", icon: SiFlask, color: "#ffffff" },
    { name: "OAuth2", icon: TbLock, color: "#22c55e" },
    { name: "JWT", icon: SiJsonwebtokens, color: "#D63AFF" },
    // Cloud
    { name: "AWS", icon: SiAmazonwebservices, color: "#FF9900" },
    { name: "EC2", icon: SiAmazonec2, color: "#FF9900" },
    { name: "S3", icon: SiAmazons3, color: "#569A31" },
    { name: "DynamoDB", icon: SiAmazondynamodb, color: "#4053D6" },
    { name: "RDS", icon: SiAmazonrds, color: "#527FFF" },
    { name: "Lambda", icon: SiAwslambda, color: "#FF9900" },
    { name: "ECS", icon: TbContainer, color: "#FF9900" },
    { name: "Fargate", icon: TbCloudComputing, color: "#FF9900" },
    // Data & AI
    { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    { name: "Redis", icon: SiRedis, color: "#DC382D" },
    { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
    { name: "PyTorch", icon: SiPytorch, color: "#EE4C2C" },
    { name: "OpenCV", icon: SiOpencv, color: "#5C3EE8" },
    { name: "LLMs", icon: SiOpenai, color: "#412991" },
    // DevOps
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    { name: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
    { name: "Terraform", icon: SiTerraform, color: "#7B42BC" },
    { name: "Linux", icon: SiLinux, color: "#FCC624" },
    { name: "CI/CD", icon: TbInfinity, color: "#22c55e" },
];

// Split into 4 rows
const rowCount = 4;
const itemsPerRow = Math.ceil(techItems.length / rowCount);
const rows = Array.from({ length: rowCount }, (_, i) =>
    techItems.slice(i * itemsPerRow, (i + 1) * itemsPerRow)
);

const createLogoItem = (item: TechItem): LogoItem => ({
    node: (
        <div className="tech-chip">
            <item.icon className="w-4 h-4 text-foreground group-hover:scale-110 transition-transform duration-300" />
            <span className="text-xs font-mono font-bold text-foreground uppercase">
                {item.name}
            </span>
        </div>
    ),
    title: item.name
});

export function TechStack() {
    const rowLogos = useMemo(() => rows.map(row => row.map(createLogoItem)), []);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragState = useRef({ startX: 0, scrollLeft: 0, velocityX: 0, lastX: 0, lastTime: 0 });
    const rafRef = useRef<number | null>(null);

    // Drag handlers for manual scrolling
    const onPointerDown = useCallback((e: React.PointerEvent) => {
        const el = containerRef.current;
        if (!el) return;
        setIsDragging(true);
        el.setPointerCapture(e.pointerId);
        dragState.current.startX = e.clientX;
        dragState.current.scrollLeft = el.scrollLeft;
        dragState.current.lastX = e.clientX;
        dragState.current.lastTime = Date.now();
        dragState.current.velocityX = 0;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }, []);

    const onPointerMove = useCallback((e: React.PointerEvent) => {
        if (!isDragging) return;
        const el = containerRef.current;
        if (!el) return;
        const dx = e.clientX - dragState.current.startX;
        el.scrollLeft = dragState.current.scrollLeft - dx;

        const now = Date.now();
        const dt = now - dragState.current.lastTime;
        if (dt > 0) {
            dragState.current.velocityX = (e.clientX - dragState.current.lastX) / dt;
        }
        dragState.current.lastX = e.clientX;
        dragState.current.lastTime = now;
    }, [isDragging]);

    const onPointerUp = useCallback((e: React.PointerEvent) => {
        if (!isDragging) return;
        setIsDragging(false);
        const el = containerRef.current;
        if (!el) return;
        el.releasePointerCapture(e.pointerId);

        // Momentum scroll
        let velocity = dragState.current.velocityX * 16; // scale up
        const decelerate = () => {
            velocity *= 0.95;
            if (Math.abs(velocity) < 0.5) return;
            el.scrollLeft -= velocity;
            rafRef.current = requestAnimationFrame(decelerate);
        };
        decelerate();
    }, [isDragging]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const directions: Array<"left" | "right"> = ["left", "right", "left", "right"];

    return (
        <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 bg-background relative overflow-hidden">
            {/* Left Edge Disappearing Blur Fade */}
            <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-background via-background/80 to-transparent z-20 pointer-events-none backdrop-blur-[1px]" />
            
            {/* Right Edge Disappearing Blur Fade */}
            <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-background via-background/80 to-transparent z-20 pointer-events-none backdrop-blur-[1px]" />

            <div className="mb-6 text-center">
                <h2 className="text-xl md:text-2xl font-black mb-2 font-mono uppercase tracking-widest">
                    <span className="text-foreground border-b-2 border-foreground">Stack</span>
                </h2>
            </div>

            <div
                ref={containerRef}
                className={`tech-stack-container w-full ${isDragging ? "tech-stack-dragging" : ""}`}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
            >
                <div className="flex flex-col gap-2.5">
                    {rowLogos.map((logos, i) => (
                        <LogoLoop
                            key={i}
                            logos={logos}
                            direction={directions[i]}
                            speed={25}
                            gap={12}
                            logoHeight={34}
                            pauseOnHover={true}
                        />
                    ))}
                </div>
            </div>


            <style jsx>{`
                .tech-stack-container {
                    position: relative;
                    width: 100%;
                    overflow: hidden;
                    padding: 4px 0;
                    cursor: grab;
                    -webkit-overflow-scrolling: touch;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }

                .tech-stack-container::-webkit-scrollbar {
                    display: none;
                }

                .tech-stack-dragging {
                    cursor: grabbing;
                    user-select: none;
                }

                :global(.tech-chip) {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 10px;
                    background: hsl(var(--background));
                    border: 2px solid hsl(var(--foreground));
                    box-shadow: 2px 2px 0px 0px hsl(var(--foreground));
                    transition: all 0.2s ease;
                    cursor: default;
                    white-space: nowrap;
                }

                :global(.tech-chip:hover) {
                    box-shadow: 4px 4px 0px 0px hsl(var(--foreground));
                    transform: translateY(-2px);
                }

                /* Ensure hover effects aren't clipped */
                :global(.logoloop) {
                    overflow: visible !important;
                }
                :global(.logoloop__list) {
                    overflow: visible !important;
                }
                :global(.logoloop__item) {
                    overflow: visible !important;
                }
                :global(.logoloop__track) {
                    overflow: visible !important;
                }
            `}</style>
        </section>
    );
}
