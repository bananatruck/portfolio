
"use client";

import { motion } from "framer-motion";
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

export function TechStack() {
    const midPoint = Math.ceil(techItems.length / 2);
    const row1 = techItems.slice(0, midPoint);
    const row2 = techItems.slice(midPoint);

    const createLogoItems = (items: TechItem[]): LogoItem[] => items.map(item => ({
        node: (
            <div className="flex items-center gap-2 px-4 py-2 bg-background border-2 border-foreground rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-300 cursor-default group">
                <item.icon
                    className="w-5 h-5 text-foreground group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-sm font-mono font-bold text-foreground uppercase">
                    {item.name}
                </span>
            </div>
        ),
        title: item.name
    }));

    const row1Items = createLogoItems(row1);
    const row2Items = createLogoItems(row2);

    return (
        <section className="w-full py-6" style={{ backgroundColor: '#f5f5f0' }}>
            <div className="mb-4 text-center">
                <h2 className="text-xl md:text-2xl font-black mb-2 font-mono uppercase tracking-widest">
                    <span className="text-foreground border-b-2 border-foreground">Stack</span>
                </h2>
            </div>

            <div className="relative w-full overflow-hidden flex flex-col gap-4">
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #f5f5f0, transparent)' }} />
                <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #f5f5f0, transparent)' }} />

                <LogoLoop
                    logos={row1Items}
                    direction="left"
                    speed={4}
                    gap={20}
                    logoHeight={40}
                    pauseOnHover={true}
                />
                <LogoLoop
                    logos={row2Items}
                    direction="right"
                    speed={4}
                    gap={20}
                    logoHeight={40}
                    pauseOnHover={true}
                />
            </div>
        </section>
    );
}

