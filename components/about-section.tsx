"use client";

import { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, Disc, ChevronDown, ChevronUp, MapPin, BookOpen, Tv, Film } from 'lucide-react';
import dynamic from "next/dynamic";
import Image from 'next/image';
import { GarchompTrigger } from '@/components/secret-game/garchomp-trigger';
import { PokeballHint } from '@/components/secret-game/pokeball-hint';

const MusicPlayer = dynamic(
    () => import('@/components/music-player').then(mod => ({ default: mod.MusicPlayer })),
    { ssr: false }
);

const favorites = [
    {
        label: "CINEMA",
        title: "Dead Poets Society",
        year: "1989",
        image: "/images/dead-poets-society.webp"
    },
    {
        label: "CINEMA",
        title: "Perfect Blue",
        year: "1997",
        image: "/images/perfect-blue.webp"
    },
    {
        label: "CINEMA",
        title: "Good Will Hunting",
        year: "1997",
        image: "/images/good-will-hunting.webp"
    },
    {
        label: "CINEMA",
        title: "Dune: Part Two",
        year: "2024",
        image: "/images/dune-2.webp"
    },
];

const manga = [
    { title: "Vagabond", author: "Takehiko Inoue", image: "/images/Vagabond.webp" },
    { title: "The Climber", author: "Shin'ichi Sakamoto", image: "/images/The-climber.webp" },
    { title: "Berserk", author: "Kentaro Miura", image: "/images/berserk.webp" },
    { title: "Kingdom", author: "Yasuhisa Hara", image: "/images/Kingdom.webp" },
];

const anime = [
    { title: "Orb: On the Movements of the Earth", year: "2024", image: "/images/Orb.webp" },
    { title: "Vinland Saga", year: "2019", image: "/images/Vinland-Saga.webp" },
    { title: "Neon Genesis Evangelion", year: "1995", image: "/images/evangelion.webp" },
    { title: "Hunter X Hunter", year: "2011", image: "/images/hunter-x-hunter.webp" },
];

const tvShows = [
    { title: "Mr Robot", year: "2015", image: "/images/mr-robot.webp" },
    { title: "Breaking Bad", year: "2008", image: "/images/Breaking-bad.webp" },
    { title: "Better Call Saul", year: "2015", image: "/images/better-call-saul.webp" },
    { title: "The Office", year: "2005", image: "/images/the-office.webp" },
];

const artists = [
    { name: "Radiohead", album: "OK Computer", image: "/images/radiohead.webp" },
    { name: "The Strokes", album: "Is This It", image: "/images/the-strokes.webp" },
    { name: "Masayoshi Takanaka", album: "All Of Me", image: "/images/Masayoshi-Takanaka.webp" },
    { name: "Pink Floyd", album: "Dark Side of the Moon", image: "/images/Pink-Floyd.webp" },
];

const hobbies = [
    { title: "Writing", description: "Essays & Stories", image: "/images/writing.webp" },
    { title: "Photography", description: "Street & Nature", image: "/images/photography.webp" },
    { title: "Art", description: "Drawing & Design", image: "/images/art.webp" },
    { title: "Tech", description: "Building & Tinkering", image: "/images/tech.webp" },
];

const milestones = [
    {
        year: "2026",
        title: "Research Assistant — Autonomous Research Agents",
        rating: 5,
        review: "Building execution-grounded pipelines at CSULB so research agents can only report numbers they actually measured. Paper pending peer review.",
        loved: true
    },
    {
        year: "2025",
        title: "Founder and President of a Startup",
        rating: 5,
        review: "Trying to build something new and foster a better computer science community in my college.",
        loved: true
    },
    {
        year: "2024",
        title: "First Hackathon",
        rating: 4.5,
        review: "Saw the inspiring CS community for the first time ever and built one of the coolest projects I ever have.",
        loved: true
    },
    {
        year: "2023",
        title: "CS Undergrad",
        rating: 4,
        review: "Enrolled into my CS undergrad Bachelors and started my formal journey into computer science.",
        loved: false
    },
    {
        year: "2022",
        title: "Small Internships",
        rating: 3.5,
        review: "Helping out local companies to practice more experience before college.",
        loved: false
    },
    {
        year: "2021",
        title: "Coding Adventure",
        rating: 3,
        review: "Learning how to code finally through online tutorials and high school classes.",
        loved: false
    },
    {
        year: "2016",
        title: "Android app modding",
        rating: 4,
        review: "Getting back into CS as an android app modder and helping random indie devs.",
        loved: false
    },
    {
        year: "2013",
        title: "Android Rooting and ROM ricing",
        rating: 5,
        review: "Learning to root android devices to install custom operating skins of android to really get more into CS.",
        loved: true
    },
    {
        year: "2012",
        title: "C++ snake game",
        rating: 5,
        review: "Made my first project ever and got into programming.",
        loved: true
    }
];

const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
        stars.push(<Star key={`full-${i}`} className="w-3 h-3 fill-foreground text-foreground dark:fill-foreground" />);
    }
    if (hasHalfStar) {
        stars.push(<Star key="half" className="w-3 h-3 fill-foreground/50 text-foreground" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-foreground/20" />);
    }
    return stars;
};

export function AboutSection() {
    const [showAllMovies, setShowAllMovies] = useState(false);
    // Watched by the pokeball hint, which only shows itself while this section
    // is the one you're looking at.
    const sectionRef = useRef<HTMLDivElement>(null);

    const visibleMilestones = useMemo(
        () => showAllMovies ? milestones : milestones.slice(0, 4),
        [showAllMovies]
    );

    return (
        <div ref={sectionRef} className="py-12 relative overflow-hidden bg-background text-foreground selection:bg-foreground selection:text-background">
            {/* Background image layer */}
            <div
                className="absolute inset-0 z-0 opacity-20 dark:opacity-10 grayscale dark:invert"
                style={{
                    backgroundImage: 'url("/images/projects.webp")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            ></div>
            {/* Subtle manga grid background */}
            <div className="absolute inset-0 z-1 opacity-10 pointer-events-none dark:hidden" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <div className="absolute inset-0 z-1 opacity-10 pointer-events-none hidden dark:block" style={{ backgroundImage: 'radial-gradient(#f5f5f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="max-w-4xl relative z-10 mx-auto px-4 sm:px-6">
                {/* Profile Header - Manga Panel Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row gap-6 mb-12 items-start relative z-10 border-2 border-foreground p-5 sm:p-6 bg-background shadow-[6px_6px_0px_0px_hsl(var(--foreground))]"
                >
                    {/* Avatar Column */}
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                        <div className="w-28 h-28 sm:w-32 sm:h-32 border-2 border-foreground overflow-hidden relative grayscale contrast-125 shadow-[3px_3px_0px_0px_hsl(var(--foreground))]">
                            <Image
                                src="/images/Mori-pfp.webp"
                                alt="Kesh"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Info Column */}
                    <div className="flex-grow text-center md:text-left min-w-0 w-full">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-3 mb-3 border-b-2 border-foreground pb-3">
                            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tighter uppercase">Kesh</h1>
                            <GarchompTrigger />
                        </div>

                        {/* Bio */}
                        <div className="prose prose-p:text-foreground max-w-none font-serif">
                            <p className="text-sm sm:text-base leading-relaxed font-medium">
                                Creatively enriched software developer who tries to build <span className="font-black underline decoration-2 underline-offset-4">useful applications</span>.
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3.5 mt-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                                <a href="https://letterboxd.com/TommyWiseauo/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline decoration-2 underline-offset-4"><Film className="w-3.5 h-3.5" /> Letterboxd</a>
                                <span className="text-foreground/40">•</span>
                                <a href="https://medium.com/@wanderingstoicist" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline decoration-2 underline-offset-4"><BookOpen className="w-3.5 h-3.5" /> Medium</a>
                                <span className="text-foreground/40">•</span>
                                <a href="https://myanimelist.net/profile/Kenshai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline decoration-2 underline-offset-4"><Tv className="w-3.5 h-3.5" /> MyAnimeList</a>
                                <span className="text-foreground/40">•</span>
                                <span className="text-foreground/50 text-[10px] normal-case font-normal italic">"I use Arch btw"</span>
                                <span className="text-foreground/40">•</span>
                                <a href="https://play.pokemonshowdown.com/users/canihave5dollars" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline decoration-2 underline-offset-4">@canihave5dollars</a>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Hobbies Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-16 relative z-10"
                >
                    <div className="flex items-center justify-between mb-6 border-b-4 border-foreground pb-2">
                        <h2 className="text-2xl font-black font-display uppercase tracking-widest">
                            Hobbies
                        </h2>
                        <span className="font-mono text-xs font-bold">ACTIVITIES</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {hobbies.map((item, index) => (
                            <div key={index} className="group relative aspect-square border-2 border-foreground bg-foreground overflow-hidden cursor-pointer shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    priority={index < 2}
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black dark:from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <span className="text-white dark:text-black font-bold font-serif text-lg leading-tight">{item.title}</span>
                                    <span className="text-white/70 dark:text-black/70 text-xs font-mono">{item.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Cinema Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="mb-16 relative z-10"
                >
                    <div className="flex items-center justify-between mb-6 border-b-4 border-foreground pb-2">
                        <h2 className="text-2xl font-black font-display uppercase tracking-widest">
                            Cinema
                        </h2>
                        <span className="font-mono text-xs font-bold">FAVORITES_COLLECTION</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {favorites.map((item, index) => (
                            <div key={index} className="group relative aspect-[2/3] border-2 border-foreground bg-foreground overflow-hidden cursor-pointer shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black dark:from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <span className="text-white dark:text-black font-bold font-serif text-lg leading-tight">{item.title}</span>
                                    <span className="text-white/70 dark:text-black/70 text-xs font-mono">{item.year}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Manga Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-16 relative z-10"
                >
                    <div className="flex items-center justify-between mb-6 border-b-4 border-foreground pb-2">
                        <h2 className="text-2xl font-black font-display uppercase tracking-widest">
                            Manga
                        </h2>
                        <span className="font-mono text-xs font-bold">READING_LIST</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {manga.map((item, index) => (
                            <div key={index} className="group relative aspect-[2/3] border-2 border-foreground bg-foreground overflow-hidden cursor-pointer shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black dark:from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <span className="text-white dark:text-black font-bold font-serif text-lg leading-tight">{item.title}</span>
                                    <span className="text-white/70 dark:text-black/70 text-xs font-mono">{item.author}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Anime Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.35 }}
                    className="mb-16 relative z-10"
                >
                    <div className="flex items-center justify-between mb-6 border-b-4 border-foreground pb-2">
                        <h2 className="text-2xl font-black font-display uppercase tracking-widest">
                            Anime
                        </h2>
                        <span className="font-mono text-xs font-bold">WATCH_LIST</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {anime.map((item, index) => (
                            <div key={index} className="group relative aspect-[2/3] border-2 border-foreground bg-foreground overflow-hidden cursor-pointer shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black dark:from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <span className="text-white dark:text-black font-bold font-serif text-lg leading-tight">{item.title}</span>
                                    <span className="text-white/70 dark:text-black/70 text-xs font-mono">{item.year}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Artists Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-16 relative z-10"
                >
                    <div className="flex items-center justify-between mb-6 border-b-4 border-foreground pb-2">
                        <h2 className="text-2xl font-black font-display uppercase tracking-widest">
                            Artists
                        </h2>
                        <span className="font-mono text-xs font-bold">PLAYLIST</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {artists.map((item, index) => (
                            <div key={index} className="group relative aspect-square border-2 border-foreground bg-foreground overflow-hidden cursor-pointer shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black dark:from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <span className="text-white dark:text-black font-bold font-serif text-lg leading-tight">{item.name}</span>
                                    <span className="text-white/70 dark:text-black/70 text-xs font-mono">{item.album}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* TV Shows Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                    className="mb-16 relative z-10"
                >
                    <div className="flex items-center justify-between mb-6 border-b-4 border-foreground pb-2">
                        <h2 className="text-2xl font-black font-display uppercase tracking-widest">
                            TV Shows
                        </h2>
                        <span className="font-mono text-xs font-bold">BINGE_LIST</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {tvShows.map((item, index) => (
                            <div key={index} className="group relative aspect-[2/3] border-2 border-foreground bg-foreground overflow-hidden cursor-pointer shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black dark:from-white via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <span className="text-white dark:text-black font-bold font-serif text-lg leading-tight">{item.title}</span>
                                    <span className="text-white/70 dark:text-black/70 text-xs font-mono">{item.year}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Milestones - Manga Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                    {/* Recent Activity Column (2/3 width) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <div className="flex items-center justify-between mb-6 border-b-4 border-foreground pb-2">
                            <h2 className="text-2xl font-black font-display uppercase tracking-widest">
                                Path
                            </h2>
                            <span className="font-mono text-xs font-bold">MILESTONES</span>
                        </div>

                        <div className="space-y-4">
                            {visibleMilestones.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 p-4 border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] transition-all"
                                >
                                    <div className="flex-shrink-0 w-16 h-20 border-2 border-foreground flex items-center justify-center flex-col gap-0.5 bg-foreground text-background">
                                        <span className="text-sm font-bold font-mono">{item.year}</span>
                                        <Disc className="w-5 h-5" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-start justify-between mb-1">
                                            <h3 className="font-bold text-base sm:text-lg font-display uppercase tracking-wide">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex gap-0.5">
                                                {renderStars(item.rating)}
                                            </div>
                                            {item.loved && (
                                                <Heart className="w-3.5 h-3.5 fill-black text-foreground" />
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm font-serif leading-relaxed text-foreground/80">{item.review}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowAllMovies(!showAllMovies)}
                            className="mt-8 w-full py-4 border-2 border-foreground font-bold font-mono uppercase tracking-widest hover:bg-foreground hover:text-white transition-colors flex items-center justify-center gap-2"
                        >
                            {showAllMovies ? (
                                <>SHOW LESS <ChevronUp className="w-4 h-4" /></>
                            ) : (
                                <>VIEW ALL MILESTONES <ChevronDown className="w-4 h-4" /></>
                            )}
                        </button>
                    </motion.div>

                    {/* Sidebar Column (1/3 width) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6 border-b-4 border-foreground pb-2">
                                <h2 className="text-xl font-black font-display uppercase tracking-widest">
                                    On Repeat
                                </h2>
                            </div>
                            <div className="border-2 border-foreground p-4 bg-background shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                                <MusicPlayer />
                            </div>
                        </div>

                        <div className="p-6 border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                            <h3 className="text-xl font-black font-display uppercase mb-4 border-b-2 border-foreground pb-2">Diary</h3>
                            <div className="space-y-4 font-mono text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">This Year</span>
                                    <span className="bg-foreground text-background px-2 py-1 font-bold">142</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">This Month</span>
                                    <span className="bg-foreground text-background px-2 py-1 font-bold">12</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">Total</span>
                                    <span className="bg-foreground text-background px-2 py-1 font-bold">1,823</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <PokeballHint sectionRef={sectionRef} />
        </div>
    );
}
