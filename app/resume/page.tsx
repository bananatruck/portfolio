"use client";

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Briefcase, GraduationCap, Code, Terminal } from 'lucide-react';
import { CenteredContainer } from '@/components/centered-container';

export default function Resume() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const experience = [
        {
            role: "Research Assistant",
            company: "California State University, Long Beach",
            period: "Aug 2025 - Present",
            description: "Developing AI/ML models on time-series sensor data, improving prediction accuracy by 20% through optimized feature engineering and model selection. Conducting simulation-driven data analysis on 100GB+ of sensor and experimental data, applying NumPy, Pandas, and GPU-accelerated training pipelines to increase predictive sensitivity by 25%. Designing experiments, co-authoring research papers, and presenting complex findings at academic conferences.",
            tech: ["Python", "NumPy", "Pandas", "PyTorch", "GPU Computing"]
        },
        {
            role: "Founder and Lead",
            company: "Project Starbound",
            period: "May 2025 - Present",
            description: "Leading five squads to ship 5 full-stack products adopted by 250+ users each in 8-week cycles by driving roadmaps, Jira sprints, and code reviews. Architecting a prod platform, cutting deploy lead time to 1 day by unifying CI/CD (GitHub Actions, Docker, Terraform), typed APIs, and OAuth2/JWT. Instituting trunk-based dev with CI/CD, test gates, ADR/RFCs, and OIDC secretless pipelines.",
            tech: ["GitHub Actions", "Docker", "Terraform", "OAuth2", "Jira"]
        },
        {
            role: "Software Development Intern",
            company: "Chhabra Home Concepts Pvt. Ltd.",
            period: "May 2022 - June 2022",
            description: "Developed a Python-based computer vision system that reduced fabric inspection time by 40% by automating image capture, preprocessing, and defect detection using a CNN model served through a Flask web interface. Enhanced detection accuracy to 92% and improved efficiency 80% by leveraging TensorFlow for model training, OpenCV for image enhancement and segmentation.",
            tech: ["Python", "OpenCV", "TensorFlow", "Flask", "NumPy"]
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-12">
            <CenteredContainer maxWidth="default">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-12"
                >
                    {/* Header */}
                    <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-8">
                        <div>
                            <h1 className="text-4xl font-bold font-mono mb-2">
                                <span className="text-primary">./</span>resume
                            </h1>
                            <p className="text-muted-foreground">
                                Professional experience & technical capabilities
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            className="group border-primary/50 hover:bg-primary/10 hover:text-primary transition-all duration-300 cursor-target"
                        >
                            <Download className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                            Download PDF
                        </Button>
                    </motion.div>

                    {/* Experience Section */}
                    <motion.div variants={item} className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Briefcase className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold font-mono">Work Experience</h2>
                        </div>

                        <div className="relative border-l border-border ml-3 pl-8 space-y-8">
                            {experience.map((job, index) => (
                                <motion.div
                                    key={index}
                                    variants={item}
                                    className="relative group"
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[39px] top-0 w-5 h-5 rounded-full border-4 border-background bg-muted-foreground group-hover:bg-primary transition-colors duration-300" />

                                    <div className="p-6 rounded-xl bg-secondary/10 border border-border/50 hover:bg-secondary/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                {job.role}
                                            </h3>
                                            <span className="text-sm font-mono text-muted-foreground bg-background/50 px-2 py-1 rounded">
                                                {job.period}
                                            </span>
                                        </div>
                                        <div className="text-lg text-muted-foreground mb-4 font-medium">
                                            {job.company}
                                        </div>
                                        <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                                            {job.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {job.tech.map((t) => (
                                                <Badge key={t} variant="outline" className="bg-background/50 border-border/50 text-xs">
                                                    {t}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Skills & Education Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Skills */}
                        <motion.div variants={item} className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Code className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold font-mono">Technical Skills</h2>
                            </div>
                            <div className="p-6 rounded-xl bg-secondary/10 border border-border/50 hover:border-primary/30 transition-colors h-full">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Languages</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {["Python", "Java", "C", "C++", "TypeScript", "JavaScript", "SQL", "Rust", "Go"].map(s => (
                                                <Badge key={s} className="bg-primary/20 text-primary hover:bg-primary/30 border-none">{s}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Backend & Distributed</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {["Microservices", "REST", "WebSockets", "Flask", "OAuth2", "JWT"].map(s => (
                                                <Badge key={s} variant="secondary">{s}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Cloud & DevOps</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Linux"].map(s => (
                                                <Badge key={s} variant="outline">{s}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">AI/ML</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {["TensorFlow", "PyTorch", "OpenCV", "LLMs", "OpenAI API", "RAG"].map(s => (
                                                <Badge key={s} variant="secondary">{s}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Education */}
                        <motion.div variants={item} className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold font-mono">Education</h2>
                            </div>
                            <div className="p-6 rounded-xl bg-secondary/10 border border-border/50 hover:border-primary/30 transition-colors h-full">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold">California State University, Long Beach</h3>
                                    <p className="text-muted-foreground">Bachelor’s degree in Computer Science (Honors Program)</p>
                                    <p className="text-sm text-muted-foreground mt-1">Graduating May 2027</p>
                                </div>
                                <div className="text-sm text-muted-foreground space-y-2">
                                    <p>• (Dean's List) </p>
                                    <p className="leading-relaxed">
                                        <span className="font-bold">Coursework:</span> Digital Logic, Data Structures, Distributed Computing, Statistical Computing, Discrete Structures, Systems Programming, Algorithms, Computer Architecture, Software Engineering, Computer Security, OOP, Machine Learning & AI.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Terminal Footer */}
                    <motion.div variants={item} className="pt-8">
                        <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-muted-foreground border border-border/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Terminal className="w-4 h-4" />
                                <span>terminal — zsh</span>
                            </div>
                            <div className="space-y-1">
                                <p><span className="text-green-500">➜</span> <span className="text-blue-400">~</span> cat contact_info.json</p>
                                <p className="text-foreground">{`{`}</p>
                                <p className="pl-4">"email": "keshav.jmgl@gmail.com",</p>
                                <p className="pl-4">"github": "github.com/bananatruck",</p>
                                <p className="pl-4">"location": "Long Beach, CA"</p>
                                <p className="text-foreground">{`}`}</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </CenteredContainer>
        </div>
    );
}
