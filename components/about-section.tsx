"use client";

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ChevronDown, ChevronUp, BookOpen, Tv, Film, Feather, Clapperboard, Disc3, Gamepad2, ArrowUpRight } from 'lucide-react';
import dynamic from "next/dynamic";
import Image from 'next/image';
import Link from 'next/link';
import { GarchompTrigger } from '@/components/secret-game/garchomp-trigger';
import { PokeballHint } from '@/components/secret-game/pokeball-hint';

const MusicPlayer = dynamic(
    () => import('@/components/music-player').then(mod => ({ default: mod.MusicPlayer })),
    { ssr: false }
);

// Every tile is a 2:3 poster, so most art fits uncropped; `pos` (CSS object-position) nudges the rest.
type Item = { title: string; sub: string; image: string; pos?: string };

// Six shelves, each behind a symbol. Milestones live in their own block below.
const SHELVES: { key: string; label: string; icon: typeof Feather; items: Item[] }[] = [
    {
        key: "hobbies", label: "Hobbies", icon: Feather, items: [
            { title: "Writing", sub: "Essays & Stories", image: "/images/writing.webp" },
            { title: "Photography", sub: "Street & Nature", image: "/images/photography.webp" },
            { title: "Art", sub: "Drawing & Design", image: "/images/art.webp" },
            { title: "Tech", sub: "Building & Tinkering", image: "/images/tech.webp" },
        ]
    },
    {
        key: "film", label: "Film", icon: Clapperboard, items: [
            { title: "Dead Poets Society", sub: "1989", image: "/images/dead-poets-society.webp" },
            { title: "Perfect Blue", sub: "1997", image: "/images/perfect-blue.webp" },
            { title: "Good Will Hunting", sub: "1997", image: "/images/good-will-hunting.webp" },
            { title: "Dune: Part Two", sub: "2024", image: "/images/dune-2.webp" },
        ]
    },
    {
        key: "ink", label: "Anime & manga", icon: BookOpen, items: [
            { title: "Vagabond", sub: "Takehiko Inoue", image: "/images/Vagabond.webp" },
            { title: "Berserk", sub: "Kentaro Miura", image: "/images/berserk.webp" },
            { title: "The Climber", sub: "Shin'ichi Sakamoto", image: "/images/The-climber.webp" },
            { title: "Kingdom", sub: "Yasuhisa Hara", image: "/images/Kingdom.webp" },
            { title: "Orb: On the Movements of the Earth", sub: "2024", image: "/images/Orb.webp" },
            { title: "Vinland Saga", sub: "2019", image: "/images/Vinland-Saga.webp" },
            { title: "Neon Genesis Evangelion", sub: "1995", image: "/images/evangelion.webp" },
            { title: "Hunter X Hunter", sub: "2011", image: "/images/hunter-x-hunter.webp" },
        ]
    },
    {
        key: "tv", label: "TV", icon: Tv, items: [
            { title: "Mr Robot", sub: "2015", image: "/images/mr-robot.webp" },
            { title: "Breaking Bad", sub: "2008", image: "/images/Breaking-bad.webp" },
            { title: "Better Call Saul", sub: "2015", image: "/images/better-call-saul.webp" },
            { title: "Game of Thrones", sub: "2011", image: "/images/game-of-thrones.webp" },
        ]
    },
    {
        key: "music", label: "Music", icon: Disc3, items: [
            { title: "Radiohead", sub: "OK Computer", image: "/images/radiohead.webp" },
            { title: "Black Country, New Road", sub: "Ants From Up There", image: "/images/ants-from-up-there.webp" },
            { title: "Masayoshi Takanaka", sub: "All Of Me", image: "/images/Masayoshi-Takanaka.webp" },
            { title: "Pink Floyd", sub: "Dark Side of the Moon", image: "/images/Pink-Floyd.webp" },
        ]
    },
    {
        key: "games", label: "Games", icon: Gamepad2, items: [
            { title: "Disco Elysium", sub: "2019", image: "/images/disco-elysium.webp" },
            { title: "Super Mario Odyssey", sub: "2017", image: "/images/super-mario-odyssey.webp" },
            { title: "Pokemon", sub: "the whole series", image: "/images/pokemon.webp" },
            { title: "Slay the Spire 2", sub: "2026", image: "/images/slay-the-spire-2.webp" },
        ]
    },
];

const milestones = [
    { year: "2026", title: "Research Assistant, Autonomous Research Agents", rating: 5, review: "Building execution-grounded pipelines at CSULB so research agents can only report numbers they actually measured. Paper pending peer review.", loved: true },
    { year: "2025", title: "Founder and President of a Startup", rating: 5, review: "Trying to build something new and foster a better computer science community in my college.", loved: true },
    { year: "2024", title: "First Hackathon", rating: 4.5, review: "Saw the inspiring CS community for the first time ever and built one of the coolest projects I ever have.", loved: true },
    { year: "2023", title: "CS Undergrad", rating: 4, review: "Enrolled into my CS undergrad Bachelors and started my formal journey into computer science.", loved: false },
    { year: "2022", title: "Small Internships", rating: 3.5, review: "Helping out local companies to practice more experience before college.", loved: false },
    { year: "2021", title: "Coding Adventure", rating: 3, review: "Learning how to code finally through online tutorials and high school classes.", loved: false },
    { year: "2016", title: "Android app modding", rating: 4, review: "Getting back into CS as an android app modder and helping random indie devs.", loved: false },
    { year: "2013", title: "Android Rooting and ROM ricing", rating: 5, review: "Learning to root android devices to install custom operating skins of android to really get more into CS.", loved: true },
    { year: "2012", title: "C++ snake game", rating: 5, review: "Made my first project ever and got into programming.", loved: true },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
        const fill = rating >= i + 1 ? "fill-[rgb(var(--el-ink))]" : rating > i ? "fill-[rgb(var(--el-ink)/0.50)]" : "";
        stars.push(<Star key={i} className={`w-3 h-3 text-[rgb(var(--el-ink))] ${fill} ${fill ? "" : "opacity-20"}`} />);
    }
    return stars;
};

// The section inverts the site theme (light paper on the dark site, dark on the light site) via
// the .elsewhere variables in globals.css. The player keeps dark colours in both.
const GLASS = { ["--background" as string]: "0 0% 5%", ["--foreground" as string]: "60 10% 96%" };

export function AboutSection() {
    const [shelf, setShelf] = useState(SHELVES[0].key);
    const [showAll, setShowAll] = useState(false);
    // Watched by the pokeball hint, which only shows itself while this section is on screen.
    const sectionRef = useRef<HTMLDivElement>(null);
    const current = SHELVES.find(s => s.key === shelf)!;
    const visibleMilestones = showAll ? milestones : milestones.slice(0, 4);

    return (
        <div ref={sectionRef} className="elsewhere relative overflow-hidden text-[rgb(var(--el-ink))] bg-[rgb(var(--el-paper))]">
            {/* The page above tears into this section. */}
            <div aria-hidden className="h-14 sm:h-16 [background:var(--page-bg)] [clip-path:polygon(0_0,100%_0,100%_38%,93%_62%,86%_40%,77%_70%,68%_46%,58%_78%,49%_50%,40%_74%,31%_44%,22%_68%,13%_42%,6%_64%,0_46%)]" />
            <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.12]" style={{ backgroundImage: 'radial-gradient(rgb(var(--el-ink)) 0.8px, transparent 0.9px)', backgroundSize: '7px 7px' }} />

            <div className="max-w-7xl relative z-10 mx-auto px-4 sm:px-8 pt-10 pb-24">
                <motion.header
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-10"
                >
                    <h2 className="font-display font-black lowercase leading-[0.85] tracking-[-0.06em] text-[clamp(3.4rem,10vw,8.5rem)] text-[rgb(var(--el-ink)/0.13)] select-none">elsewhere</h2>
                    <p className="font-mono text-xs text-[rgb(var(--el-ink)/0.60)] md:mb-3">things i like, in no particular order.</p>
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 items-stretch">
                    <div className="min-w-0">
                        {/* Profile, as on the original about page */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ duration: 0.7, ease: EASE }}
                            className="flex flex-col sm:flex-row gap-5 items-start border border-[rgb(var(--el-ink))] p-5 bg-[rgb(var(--el-card)/0.80)] shadow-[4px_4px_0px_0px_rgb(var(--el-ink))]"
                        >
                            <div className="w-24 h-24 flex-shrink-0 border border-[rgb(var(--el-ink))] overflow-hidden relative grayscale contrast-125 shadow-[2px_2px_0px_0px_rgb(var(--el-ink))]">
                                <Image src="/images/Mori-pfp.webp" alt="Kesh" fill sizes="96px" className="object-cover" />
                            </div>
                            <div className="min-w-0 w-full">
                                <div className="flex items-end gap-3 mb-2 border-b border-[rgb(var(--el-ink))] pb-2">
                                    <h3 className="text-3xl font-black font-display tracking-tighter uppercase">Kesh</h3>
                                    <GarchompTrigger />
                                </div>
                                <p className="font-read text-sm sm:text-base leading-relaxed font-medium">
                                    Creatively enriched software developer who tries to build <span className="font-black underline decoration-2 underline-offset-4">useful applications</span>.
                                </p>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 text-[11px] font-bold uppercase tracking-wider font-mono">
                                    <a href="https://letterboxd.com/TommyWiseauo/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline decoration-2 underline-offset-4"><Film className="w-3.5 h-3.5" /> Letterboxd</a>
                                    <a href="https://medium.com/@wanderingstoicist" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline decoration-2 underline-offset-4"><BookOpen className="w-3.5 h-3.5" /> Medium</a>
                                    <a href="https://myanimelist.net/profile/Kenshai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline decoration-2 underline-offset-4"><Tv className="w-3.5 h-3.5" /> MyAnimeList</a>
                                    <a href="https://play.pokemonshowdown.com/users/canihave5dollars" target="_blank" rel="noopener noreferrer" className="hover:underline decoration-2 underline-offset-4">@canihave5dollars</a>
                                    <span className="text-[rgb(var(--el-ink)/0.50)] text-[10px] normal-case font-normal italic font-read">&quot;I use Arch btw&quot;</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Symbols instead of category names */}
                        <div className="mt-8 flex items-center gap-2" role="tablist" aria-label="Interests">
                            {SHELVES.map(s => {
                                const Icon = s.icon;
                                const on = s.key === shelf;
                                return (
                                    <button
                                        key={s.key}
                                        role="tab"
                                        aria-selected={on}
                                        aria-label={s.label}
                                        title={s.label}
                                        onClick={() => setShelf(s.key)}
                                        className={`relative w-11 h-11 grid place-items-center border border-[rgb(var(--el-ink))] transition-[background-color,color,transform,box-shadow] duration-300 ease-out ${on ? "bg-[rgb(var(--el-ink))] text-[rgb(var(--el-paper))] shadow-[2px_2px_0px_0px_#15ca91]" : "bg-[rgb(var(--el-card)/0.60)] hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgb(var(--el-ink))]"}`}
                                    >
                                        <Icon className="w-[18px] h-[18px]" strokeWidth={1.6} />
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-4 relative">
                            <AnimatePresence initial={false}>
                                <motion.div
                                    key={shelf}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.25, ease: EASE }}
                                    className="grid gap-2.5 grid-cols-2 sm:grid-cols-4"
                                >
                                    {current.items.map((item, i) => (
                                        <figure
                                            key={item.title}
                                            className="group relative m-0 aspect-[2/3] overflow-hidden border-[3px] border-[rgb(var(--el-ink))] bg-[rgb(var(--el-card))]"
                                        >
                                            <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 50vw, 30vw" style={item.pos ? { objectPosition: item.pos } : undefined} className="object-cover grayscale contrast-[1.08] group-hover:grayscale-0 group-hover:scale-[1.02] transition-transform duration-500 ease-out" />
                                            <figcaption className="absolute left-2 bottom-2 max-w-[calc(100%-1rem)] px-2 py-1 bg-[rgb(var(--el-cap)/0.95)] border border-[rgb(var(--el-ink))] font-mono text-[10px] leading-tight">
                                                <b className="block text-[11px] truncate">{item.title}</b>
                                                <span className="text-[rgb(var(--el-ink)/0.70)]">{item.sub}</span>
                                            </figcaption>
                                        </figure>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        {shelf === "games" && (
                            <Link href="/blog/pokemon-rom-hacks" className="inline-flex items-center gap-1.5 mt-3 font-mono text-[11px] font-bold uppercase tracking-wider border-b border-[rgb(var(--el-ink))] hover:text-[#0a8c5b] hover:border-[#0a8c5b] transition-colors">
                                The full ranking <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        )}
                    </div>

                    {/* Music on a dark, translucent pane */}
                    <motion.aside
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                        className="min-h-0 lg:h-full"
                        style={GLASS}
                    >
                        {/* Top edge lines up with the profile card; the track list fills down to the shelf's bottom edge. */}
                        <div className="flex flex-col lg:h-full border border-[rgb(var(--el-ink))] bg-[#0b0f0d]/90 backdrop-blur-md shadow-[4px_4px_0px_0px_rgb(var(--el-ink))] overflow-hidden">
                            <p className="px-3 pt-3 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4f1e8]/50">On repeat</p>
                            <MusicPlayer />
                        </div>
                    </motion.aside>
                </div>

                {/* Milestones, separate from the interests */}
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="mt-20"
                    aria-labelledby="path-title"
                >
                    <div className="flex items-end justify-between mb-6 border-b border-[rgb(var(--el-ink))] pb-2">
                        <h3 id="path-title" className="font-display font-black lowercase tracking-[-0.04em] text-4xl text-[rgb(var(--el-ink)/0.18)]">path</h3>
                        <span className="font-mono text-[10px] text-[rgb(var(--el-ink)/0.50)]">2012 to now</span>
                    </div>
                    <ol className="relative border-l border-[rgb(var(--el-ink))] ml-2 space-y-3">
                        {visibleMilestones.map(item => (
                            <li key={item.year + item.title} className="relative pl-6">
                                <span aria-hidden className={`absolute -left-[9px] top-4 w-4 h-4 border border-[rgb(var(--el-ink))] ${item.year === "2026" ? "bg-[#15ca91]" : "bg-[rgb(var(--el-paper))]"}`} />
                                <div className="flex gap-4 p-4 border border-[rgb(var(--el-ink))] bg-[rgb(var(--el-card)/0.80)] shadow-[3px_3px_0px_0px_rgb(var(--el-ink))] hover:shadow-[4px_4px_0px_0px_rgb(var(--el-ink))] hover:-translate-y-0.5 transition-[transform,box-shadow] duration-300">
                                    <span className="font-mono font-bold text-sm w-12 flex-shrink-0">{item.year}</span>
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                                            <h4 className="font-bold text-sm sm:text-base font-display uppercase tracking-wide">{item.title}</h4>
                                            <span className="flex gap-0.5">{renderStars(item.rating)}</span>
                                            {item.loved && <Heart className="w-3.5 h-3.5 fill-[rgb(var(--el-ink))] text-[rgb(var(--el-ink))]" />}
                                        </div>
                                        <p className="text-xs sm:text-sm font-read leading-relaxed text-[rgb(var(--el-ink)/0.80)]">{item.review}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <button
                        onClick={() => setShowAll(v => !v)}
                        className="mt-6 w-full py-3 border border-[rgb(var(--el-ink))] font-bold font-mono text-xs uppercase tracking-widest hover:bg-[rgb(var(--el-ink))] hover:text-[rgb(var(--el-paper))] transition-colors duration-300 flex items-center justify-center gap-2"
                    >
                        {showAll ? <>Show less <ChevronUp className="w-4 h-4" /></> : <>All of it <ChevronDown className="w-4 h-4" /></>}
                    </button>
                </motion.section>
            </div>

            <PokeballHint sectionRef={sectionRef} />
        </div>
    );
}
