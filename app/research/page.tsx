import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Github, FileText, ExternalLink, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CausalChain, GateCheck, GatePipeline, ResearchToc, TruncationDemo, type Gate } from "@/components/research-demos";

export const metadata: Metadata = {
    title: "Research - Kesh",
    description:
        "Research Assistant at California State University, Long Beach. Execution-grounded validation for autonomous research agents, and G.A.T.E.S., the validity layer that came out of it.",
};

type Stat = {
    value: string;
    label: string;
};

const STATS: Stat[] = [
    { value: "15", label: "reproducible agent-generated papers" },
    { value: "90%+", label: "causal chain integrity" },
    { value: "25–35%", label: "lift in unsupported claim detection" },
    { value: "98%+", label: "fewer repeated undetected failures" },
    { value: "<10%", label: "false positive flag rate" },
    { value: "3 / 4", label: "arXiv baselines / reported research metrics" },
];

const GATES: Gate[] = [
    {
        id: "Gate 1",
        name: "Execution validity",
        question:
            "Did this code actually run, and were the reported numbers produced by this run rather than inherited, hardcoded, or invented?",
        status: "implemented",
    },
    {
        id: "Gate 2",
        name: "Source ↔ result coherence",
        question:
            "Are the measured results consistent with what the cited literature actually reports?",
        status: "designed",
    },
    {
        id: "Gate 3",
        name: "Report validity",
        question:
            "Does every number and citation in the finished manuscript trace back to something that exists?",
        status: "designed",
    },
];

const SECTIONS: [string, string][] = [["problem", "The problem"], ["gates", "G.A.T.E.S."], ["results", "Results"], ["how", "How it works"]];

const panel = "border border-foreground bg-background shadow-[3px_3px_0px_0px_hsl(var(--foreground))]";

function SectionHead({ title, tag }: { title: string; tag: string }) {
    return (
        <div className="flex items-center justify-between mb-6 border-b-2 border-foreground pb-2">
            <h2 className="text-2xl font-black font-display uppercase tracking-widest">
                <span className="text-emerald-500 mr-2">❯</span>
                {title}
            </h2>
            <span className="font-mono text-xs font-bold text-foreground/60">--{tag}</span>
        </div>
    );
}

export default function ResearchPage() {
    return (
        <article className="relative pt-24 pb-20 sm:pt-28 bg-background text-foreground">
            {/* The same dot grid as the home page sections */}
            <div aria-hidden className="absolute inset-0 opacity-10 pointer-events-none dark:hidden" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div aria-hidden className="absolute inset-0 opacity-10 pointer-events-none hidden dark:block" style={{ backgroundImage: "radial-gradient(#f5f5f0 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-8 lg:grid lg:grid-cols-[170px_minmax(0,1fr)] lg:gap-14">
                <ResearchToc items={SECTIONS} />
                <div className="min-w-0 max-w-3xl">
                    <Link
                        href="/#projects"
                        className="inline-flex items-center gap-2 mb-8 font-mono text-xs font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </Link>

                    {/* Header, in the same voice as the home page sections */}
                    <header className="mb-10">
                        <Badge variant="default" className="mb-3 bg-foreground text-background hover:bg-foreground border-foreground font-mono uppercase">
                            <span className="mr-2 text-emerald-400 animate-pulse">●</span>
                            Research · currently active
                        </Badge>
                        <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tighter leading-none mb-4">
                            <span className="border-b-3 border-foreground">Autonomous Research Agents</span>
                        </h1>
                        <div className={`${panel} p-5 sm:p-6 mt-6`}>
                            <div className="flex items-center gap-1.5 mb-3">
                                <Terminal className="w-4 h-4 text-emerald-500" />
                                <span className="text-[11px] font-mono font-bold text-foreground/70">~/research/gates</span>
                            </div>
                            <div className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wide text-foreground/70 space-y-1 mb-4">
                                <p>Research Assistant · June 2026 - Present</p>
                                <p>California State University, Long Beach · Long Beach, CA</p>
                            </div>
                            <p className="font-read text-sm sm:text-base leading-relaxed text-foreground/85">
                                I build execution-grounded pipelines for autonomous research agents:
                                systems that plan their own experiments, run the code, and draft the
                                LaTeX paper at the end. The interesting part is not getting them to
                                write. It is making sure that every number they write down was actually
                                measured.
                            </p>
                        </div>
                    </header>

                    {/* Publication status, the thing people come here for */}
                    <div className="border border-foreground bg-foreground text-background p-6 sm:p-7 shadow-[4px_4px_0px_0px_hsl(var(--foreground)/.35)] mb-14">
                        <p className="font-mono text-[11px] font-bold uppercase tracking-widest opacity-70 mb-3">
                            <span className="text-emerald-400">❯</span> cat publication.status
                        </p>
                        <p className="font-display text-xl sm:text-2xl font-black uppercase tracking-wide leading-tight mb-3">
                            Coming soon, pending peer review
                        </p>
                        <p className="font-read text-sm sm:text-base leading-relaxed opacity-90">
                            The paper is under review. This page is the interim home for it, and the
                            link will land here the moment it clears. Until then, the system it
                            describes is public and readable in full.
                        </p>
                        <a
                            href="https://github.com/bananatruck/gates"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-background text-foreground font-mono text-xs font-bold uppercase tracking-widest border border-background hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-colors"
                        >
                            <Github className="w-3.5 h-3.5" />
                            github.com/bananatruck/gates
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    {/* The problem */}
                    <section id="problem" className="mb-14 scroll-mt-28">
                        <SectionHead title="The Problem" tag="why-this-exists" />
                        <div className="space-y-5 font-read text-sm sm:text-base leading-relaxed text-foreground/85 mb-6">
                            <p>
                                Autonomous research scaffolds regularly publish numbers their
                                experiments never produced. The usual explanation is that the model
                                fabricates. In the scaffold we audited, the mechanism turned out to be
                                mundane and mechanical: experiment output was truncated to 1,000
                                characters before any agent could read it, and the crash marker was
                                appended <em>after</em> the program&apos;s own output, so it fell off
                                the end of the same slice.
                            </p>
                            <p>
                                The writing agent could not see the real numbers. The failure detector
                                could not see the crash. A run that raised{" "}
                                <code className="font-mono text-xs">NameError</code> on every attempt
                                was scored a perfect 1.0 by the reward model and written up with a full
                                results table to two decimal places. None of it was measured.
                            </p>
                        </div>
                        <TruncationDemo />
                        <p className="mt-6 font-read text-sm sm:text-base leading-relaxed text-foreground/85">
                            That reframes the whole thing. It is an information-flow defect, not a
                            model tendency, which means it can be closed with plumbing rather than
                            prompting.
                        </p>
                    </section>

                    {/* GATES */}
                    <section id="gates" className="mb-14 scroll-mt-28">
                        <SectionHead title="G.A.T.E.S." tag="validity-layer" />
                        <p className="font-read text-sm sm:text-base leading-relaxed text-foreground/85 mb-6">
                            A portable validity layer that closes the channel at three points. Every
                            reported metric has to trace back to a hashed execution run before it is
                            allowed into a manuscript. Zero runtime dependencies, no host scaffold
                            imports: it drops into whatever environment the agent already runs in.
                        </p>
                        <GatePipeline gates={GATES} />
                    </section>

                    {/* Results */}
                    <section id="results" className="mb-14 scroll-mt-28">
                        <SectionHead title="Results" tag="measured" />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
                            {STATS.map((stat) => (
                                <div key={stat.label} className="manga-panel p-4">
                                    <p className="font-display text-2xl sm:text-3xl font-black tracking-tighter leading-none mb-1.5">
                                        {stat.value}
                                    </p>
                                    <p className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wide leading-snug text-foreground/60">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-5 font-read text-sm sm:text-base leading-relaxed text-foreground/85 mb-6">
                            <p>
                                Unsupported claim detection went up 25–35% against a live agent
                                scaffold, benchmarked against three published arXiv baselines and four
                                reported research metrics. Repeated undetected failures, the same
                                crash sailing through run after run, dropped by over 98%, while false
                                positive flags stayed under 10%, because a false flag costs the agent a
                                rewrite for nothing.
                            </p>
                            <p>
                                The pipeline delivered 15 reproducible agent-generated papers at over
                                90% causal chain integrity, where a chain is the full link from{" "}
                                <span className="font-mono text-xs">task → command → log → value</span>
                                . Each link is marked resolved or not, so a broken chain gets reported
                                rather than papered over. That distinction is the point: a number that
                                merely matches something in a log is not the same as a number causally
                                attributable to a recorded run.
                            </p>
                        </div>
                        <CausalChain />
                    </section>

                    {/* How it works */}
                    <section id="how" className="mb-14 scroll-mt-28">
                        <SectionHead title="How It Works" tag="mechanism" />
                        <div className="space-y-5 font-read text-sm sm:text-base leading-relaxed text-foreground/85">
                            <p>
                                Experiments declare their results through an API injected straight into
                                the namespace, so there is nothing to import and nothing for the agent to get wrong:
                            </p>
                            <pre className="border border-foreground bg-foreground/5 p-4 overflow-x-auto font-mono text-xs sm:text-sm">
<span className="text-emerald-500">❯ </span>{`record_result("exp1.K2.test_acc", test_acc, unit="ratio")`}
                            </pre>
                            <p>
                                You pass the <em>variable</em>. A number typed into the call is
                                rejected: the gate re-parses the source, finds the call site, and
                                fails any value that is a literal rather than the result of a
                                computation. Constant folding does not launder a typed number either.
                            </p>
                            <GateCheck />
                            <p>
                                Around that sits a static tier that rejects broken code before it costs
                                any compute, and a runtime tier that runs the experiment in a fresh
                                process with an empty namespace and hashes the source the child
                                actually executed against the source that was submitted. That hash is
                                what turns &quot;this value came from this code&quot; from an
                                assumption into something checkable.
                            </p>
                        </div>
                    </section>

                    {/* Footer links */}
                    <div className="grid gap-3 sm:grid-cols-2">
                        <a
                            href="https://github.com/bananatruck/gates"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group manga-panel p-5"
                        >
                            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-1.5">
                                Source
                            </p>
                            <p className="font-display font-black uppercase tracking-wide text-lg leading-none flex items-center gap-2 group-hover:underline decoration-2 underline-offset-4">
                                <Github className="w-4 h-4" /> G.A.T.E.S. repo
                            </p>
                        </a>

                        <div className={`${panel} p-5`}>
                            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-1.5">
                                Paper
                            </p>
                            <p className="font-display font-black uppercase tracking-wide text-lg leading-none flex items-center gap-2 text-foreground/50">
                                <FileText className="w-4 h-4" /> Pending review
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
