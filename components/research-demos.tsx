"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";

// Small, honest illustrations of what the research page describes. None of them run G.A.T.E.S.;
// each says so, and each only acts out a rule the page states in words.

const panel = "border border-foreground bg-background shadow-[3px_3px_0px_0px_hsl(var(--foreground))]";
const label = "font-mono text-[10px] font-bold uppercase tracking-widest text-foreground/50";

/* ---------- Section index with the current section lit ---------- */
export function ResearchToc({ items }: { items: [string, string][] }) {
    const [active, setActive] = useState(items[0][0]);
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                const shown = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (shown[0]) setActive(shown[0].target.id);
            },
            { rootMargin: "-20% 0px -65% 0px" },
        );
        for (const [id] of items) {
            const el = document.getElementById(id);
            if (el) io.observe(el);
        }
        return () => io.disconnect();
    }, [items]);
    return (
        <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28 font-mono text-[11px] font-bold uppercase tracking-widest space-y-2.5">
                <p className="text-foreground/40 mb-3">~/research</p>
                {items.map(([id, text]) => (
                    <a
                        key={id}
                        href={`#${id}`}
                        aria-current={active === id ? "location" : undefined}
                        className={`flex items-center transition-colors ${active === id ? "text-foreground" : "text-foreground/50 hover:text-emerald-500"}`}
                    >
                        <span className={`mr-1.5 transition-transform ${active === id ? "text-emerald-500 translate-x-0.5" : "text-emerald-500/40"}`}>❯</span>
                        {text}
                    </a>
                ))}
            </div>
        </nav>
    );
}

/* ---------- The defect: a 1,000 character slice, with the crash marker appended last ---------- */
const LIMIT = 1000;
const MARKER = "[crash marker]";

export function TruncationDemo() {
    const [out, setOut] = useState(640);
    const total = out + MARKER.length;
    const seen = total <= LIMIT;
    const scale = 2400 + MARKER.length;
    return (
        <div className={`${panel} p-4 sm:p-5`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                <p className={label}>Try it: the slice the agents read</p>
                <p className="font-mono text-[10px] text-foreground/50">illustration of the defect above</p>
            </div>

            <label className="block font-mono text-xs font-bold mb-2" htmlFor="out-len">
                program output: <span className="text-emerald-500">{out.toLocaleString()}</span> characters
            </label>
            <input
                id="out-len"
                type="range"
                min={100}
                max={2400}
                step={20}
                value={out}
                onChange={(e) => setOut(Number(e.target.value))}
                className="w-full accent-emerald-500 mb-5"
            />

            {/* The run's text as a bar: output, then the marker, against the 1,000 character cut. */}
            <div className="relative h-9 border border-foreground bg-foreground/5" aria-hidden>
                <div className="absolute inset-y-0 left-0 bg-foreground/25" style={{ width: `${(out / scale) * 100}%` }} />
                <div
                    className={`absolute inset-y-0 transition-colors ${seen ? "bg-emerald-500" : "bg-red-500"}`}
                    style={{ left: `${(out / scale) * 100}%`, width: `${Math.max(1.2, (MARKER.length / scale) * 100)}%` }}
                />
                <div className="absolute inset-y-0 right-0 bg-[repeating-linear-gradient(135deg,transparent_0_5px,hsl(var(--foreground)/.12)_5px_7px)]" style={{ left: `${(LIMIT / scale) * 100}%` }} />
                <div className="absolute -top-5 -bottom-1 w-0.5 bg-foreground" style={{ left: `${(LIMIT / scale) * 100}%` }}>
                    <span className="absolute -top-0.5 left-1.5 font-mono text-[9px] font-bold whitespace-nowrap">CUT AT {LIMIT.toLocaleString()}</span>
                </div>
            </div>
            <div className="flex justify-between font-mono text-[9px] text-foreground/50 mt-1.5">
                <span>0</span>
                <span>agents read only the left of the cut</span>
            </div>

            <pre className="mt-4 border border-foreground bg-foreground/5 p-3 font-mono text-[11px] sm:text-xs overflow-x-auto">
                <span className="text-emerald-500">❯ </span>
                {`visible = (stdout + "${MARKER}")[:${LIMIT}]   # ${total.toLocaleString()} chars in, ${Math.min(total, LIMIT).toLocaleString()} read`}
            </pre>

            <p className={`mt-3 flex items-start gap-2 font-mono text-xs font-bold ${seen ? "text-emerald-500" : "text-red-500"}`} aria-live="polite">
                {seen ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                {seen
                    ? "The marker is inside the slice. The writer and the failure detector can both see the crash."
                    : "The marker fell past the cut. To every agent downstream, this crashed run reads as clean."}
            </p>
        </div>
    );
}

/* ---------- The literal check on record_result ---------- */
const PRESETS: [string, string][] = [
    ["computed variable", 'record_result("exp1.K2.test_acc", test_acc, unit="ratio")'],
    ["typed number", 'record_result("exp1.K2.test_acc", 0.93, unit="ratio")'],
    ["folded constant", 'record_result("exp1.K2.test_acc", 0.9 + 0.03, unit="ratio")'],
];

// Splits a call's arguments on top-level commas, ignoring commas inside brackets and strings.
function args(src: string): string[] | null {
    const m = src.trim().match(/^record_result\s*\(([\s\S]*)\)\s*$/);
    if (!m) return null;
    const out: string[] = [];
    let depth = 0, quote = "", cur = "";
    for (const ch of m[1]) {
        if (quote) { cur += ch; if (ch === quote) quote = ""; continue; }
        if (ch === '"' || ch === "'") { quote = ch; cur += ch; continue; }
        if ("([{".includes(ch)) depth++;
        if (")]}".includes(ch)) depth--;
        if (ch === "," && depth === 0) { out.push(cur.trim()); cur = ""; continue; }
        cur += ch;
    }
    if (cur.trim()) out.push(cur.trim());
    return out;
}

function verdict(src: string): { ok: boolean; text: string } {
    const a = args(src);
    if (!a) return { ok: false, text: "Not a record_result(...) call." };
    if (a.length < 2) return { ok: false, text: "record_result needs a name and a value." };
    const value = a[1];
    if (/^[\d\s.+\-*/()eE_]+$/.test(value) && /\d/.test(value))
        return { ok: false, text: `Rejected: ${value} is a literal. Arithmetic on typed numbers is still a typed number.` };
    if (/^["']/.test(value)) return { ok: false, text: "Rejected: the value is a string literal." };
    if (/[A-Za-z_]/.test(value)) return { ok: true, text: `Accepted: ${value} is the result of a computation, so the gate can trace it to the run.` };
    return { ok: false, text: "Could not read the value argument." };
}

export function GateCheck() {
    const [src, setSrc] = useState(PRESETS[0][1]);
    const v = useMemo(() => verdict(src), [src]);
    return (
        <div className={`${panel} p-4 sm:p-5`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <p className={label}>Try it: pass the variable, not the number</p>
                <p className="font-mono text-[10px] text-foreground/50">a browser sketch of the literal check</p>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3 font-mono text-[11px]">
                {PRESETS.map(([name, code]) => (
                    <button
                        key={name}
                        type="button"
                        onClick={() => setSrc(code)}
                        aria-pressed={src === code}
                        className={`px-2.5 py-1 border transition-all ${src === code ? "bg-foreground text-background font-bold border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]" : "border-foreground/40 text-foreground/70 hover:border-foreground hover:text-foreground"}`}
                    >
                        {name}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-2 border border-foreground bg-foreground/5 px-3 py-2.5 font-mono text-xs sm:text-sm">
                <span className="text-emerald-500 shrink-0">❯</span>
                <input
                    value={src}
                    onChange={(e) => setSrc(e.target.value)}
                    spellCheck={false}
                    aria-label="A record_result call to check"
                    className="flex-1 min-w-0 bg-transparent outline-none"
                />
            </div>
            <p className={`mt-3 flex items-start gap-2 font-mono text-xs font-bold ${v.ok ? "text-emerald-500" : "text-red-500"}`} aria-live="polite">
                {v.ok ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                {v.text}
            </p>
            <p className="mt-2 font-read text-xs text-foreground/60">
                The real gate re-parses the Python source and finds the call site; this page only mimics the rule.
            </p>
        </div>
    );
}

/* ---------- The three gates as a pipeline ---------- */
export type Gate = { id: string; name: string; question: string; status: "implemented" | "designed" };

export function GatePipeline({ gates }: { gates: Gate[] }) {
    const [open, setOpen] = useState(0);
    const g = gates[open];
    return (
        <div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3" role="tablist" aria-label="The three gates">
                {gates.map((gate, i) => (
                    <button
                        key={gate.id}
                        type="button"
                        role="tab"
                        aria-selected={open === i}
                        onClick={() => setOpen(i)}
                        className={`relative text-left p-3 sm:p-4 border border-foreground transition-all ${open === i ? "bg-foreground text-background shadow-[3px_3px_0px_0px_hsl(var(--foreground)/.5)] -translate-y-0.5" : "bg-background hover:shadow-[3px_3px_0px_0px_hsl(var(--foreground))] hover:-translate-y-0.5"}`}
                    >
                        <span className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-widest">
                            <span className={`w-1.5 h-1.5 rounded-full ${gate.status === "implemented" ? "bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" : "border border-current opacity-60"}`} />
                            {gate.id}
                        </span>
                        <span className="block mt-1.5 font-display font-bold uppercase text-xs sm:text-base leading-tight">{gate.name}</span>
                        {i < gates.length - 1 && (
                            <span aria-hidden className="hidden sm:block absolute top-1/2 -right-3 w-3 h-0.5 bg-foreground" />
                        )}
                    </button>
                ))}
            </div>
            <div role="tabpanel" className={`${panel} mt-3 p-4 sm:p-5`}>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-xs font-black bg-foreground text-background px-2 py-0.5 uppercase">{g.id}</span>
                    <span
                        className={`font-mono text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 border ${
                            g.status === "implemented" ? "text-emerald-500 border-emerald-500/50 bg-emerald-500/10" : "text-foreground/50 border-foreground/30"
                        }`}
                    >
                        {g.status}
                    </span>
                </div>
                <p className="font-read text-sm sm:text-base leading-relaxed text-foreground/85">{g.question}</p>
            </div>
        </div>
    );
}

/* ---------- The causal chain: break a link and see how it is reported ---------- */
const LINKS = ["task", "command", "log", "value"] as const;

export function CausalChain() {
    const [broken, setBroken] = useState<number | null>(null);
    return (
        <div className={`${panel} p-4 sm:p-5`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                <p className={label}>Try it: break a link in the chain</p>
                <p className="font-mono text-[10px] text-foreground/50">click a link</p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono text-xs sm:text-sm font-bold">
                {LINKS.map((name, i) => {
                    const bad = broken === i;
                    return (
                        <span key={name} className="flex items-center gap-1.5 sm:gap-2">
                            <button
                                type="button"
                                onClick={() => setBroken(bad ? null : i)}
                                aria-pressed={bad}
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 border transition-colors ${bad ? "border-red-500 text-red-500 bg-red-500/10" : "border-foreground hover:bg-foreground hover:text-background"}`}
                            >
                                {bad ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5 text-emerald-500" />}
                                {name}
                            </button>
                            {i < LINKS.length - 1 && <span className={broken !== null && (broken === i || broken === i + 1) ? "text-red-500" : "text-foreground/40"}>→</span>}
                        </span>
                    );
                })}
            </div>
            <p className={`mt-4 flex items-start gap-2 font-mono text-xs font-bold ${broken === null ? "text-emerald-500" : "text-red-500"}`} aria-live="polite">
                {broken === null ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                {broken === null
                    ? "Every link resolves: the value is causally attributable to a recorded run."
                    : `The ${LINKS[broken]} link does not resolve, so the chain is reported as broken rather than papered over.`}
            </p>
        </div>
    );
}
