"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Disc, ChevronDown, ChevronUp, MapPin, Link as LinkIcon, Calendar, BookOpen, Tv } from 'lucide-react';
import { MusicPlayer } from '@/components/music-player';
import { CenteredContainer } from '@/components/centered-container';
import Image from 'next/image';

export default function About() {
    const [showAllMovies, setShowAllMovies] = useState(false);

    const favorites = [
        {
            label: "CINEMA",
            title: "Dead Poets Society",
            year: "1989",
            image: "/images/dead-poets-society.jpg"
        },
        {
            label: "CINEMA",
            title: "Perfect Blue",
            year: "1997",
            image: "/images/perfect-blue.jpg"
        },
        {
            label: "CINEMA",
            title: "Good Will Hunting",
            year: "1997",
            image: "/images/good-will-hunting.jpg"
        },
        {
            label: "CINEMA",
            title: "Dune: Part Two",
            year: "2024",
            image: "/images/dune-2.jpg"
        },
    ];

    const manga = [
        { title: "Vagabond", author: "Takehiko Inoue", image: "/images/Vagabond.jpg" },
        { title: "The Climber", author: "Shin'ichi Sakamoto", image: "/images/The climber.webp" },
        { title: "Berserk", author: "Kentaro Miura", image: "/images/berserk.jpg" },
        { title: "Kingdom", author: "Yasuhisa Hara", image: "/images/Kingdom.jpg" },
    ];

    const anime = [
        { title: "Orb: On the Movements of the Earth", year: "2024", image: "/images/Orb.jpg" },
        { title: "Vinland Saga", year: "2019", image: "/images/Vinland Saga.jpg" },
        { title: "Neon Genesis Evangelion", year: "1995", image: "/images/evangelion.jpg" },
        { title: "Hunter X Hunter", year: "2011", image: "/images/hunter-x-hunter.jpg" },
    ];

    const tvShows = [
        { title: "Mr Robot", year: "2015", image: "/images/mr-robot.jpg" },
        { title: "Breaking Bad", year: "2008", image: "/images/Breaking bad.jpg" },
        { title: "Better Call Saul", year: "2015", image: "/images/better call saul.jpg" },
        { title: "The Office", year: "2005", image: "/images/the office.jpg" },
    ];

    const artists = [
        { name: "Radiohead", album: "OK Computer", image: "/images/radiohead.jpg" },
        { name: "The Strokes", album: "Is This It", image: "/images/the strokes.jpg" },
        { name: "Masayoshi Takanaka", album: "All Of Me", image: "/images/Masayoshi Takanaka.jpg" },
        { name: "Pink Floyd", album: "Dark Side of the Moon", image: "/images/Pink Floyd.jpg" },
    ];

    const hobbies = [
        { title: "Writing", description: "Essays & Stories", image: "/images/writing.jpg" },
        { title: "Photography", description: "Street & Nature", image: "/images/photography.jpg" },
        { title: "Art", description: "Drawing & Design", image: "/images/art.jpg" },
        { title: "Tech", description: "Building & Tinkering", image: "/images/tech.jpg" },
    ];

    const milestones = [
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

    const visibleMilestones = showAllMovies ? milestones : milestones.slice(0, 4);

    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const stars = [];

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={`full-${i}`} className="w-3 h-3 fill-black text-black" />);
        }
        if (hasHalfStar) {
            stars.push(<Star key="half" className="w-3 h-3 fill-black/50 text-black" />);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-black/20" />);
        }
        return stars;
    };

    return (
        <div className="min-h-screen pt-24 pb-12 relative overflow-hidden bg-[#f5f5f0] text-black selection:bg-black selection:text-white">
            {/* Ink wash background effect */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")' }}></div>

            <CenteredContainer maxWidth="default">
                {/* Profile Header - Manga Panel Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row gap-8 mb-16 items-start relative z-10 border-4 border-black p-6 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                >
                    {/* Avatar Column */}
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                        <div className="w-40 h-40 border-4 border-black overflow-hidden relative grayscale contrast-125">
                            <Image
                                src="/images/Mori pfp.jpg"
                                alt="Kesh"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                    {/* Info Column */}
                    <div className="flex-grow text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 mb-4 border-b-2 border-black pb-4">
                            <h1 className="text-5xl font-black font-serif tracking-tighter uppercase">Kesh</h1>
                            <img
                                src="/garchomp.gif"
                                alt="Garchomp"
                                className="w-10 h-10 mb-2 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
                            />
                        </div>

                        {/* Bio */}
                        <div className="prose prose-p:text-black max-w-none mb-6 font-serif">
                            <p className="text-lg leading-relaxed font-medium">
                                Creatively enriched software developer who tries to build <span className="font-black underline decoration-2 underline-offset-4">useful applications</span>.
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6 text-sm font-bold uppercase tracking-wider">
                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Long Beach, CA</span>
                                <a href="https://medium.com/@wanderingstoicist" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline decoration-2 underline-offset-4"><BookOpen className="w-4 h-4" /> Medium</a>
                                <a href="https://myanimelist.net/profile/Kenshai" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline decoration-2 underline-offset-4"><Tv className="w-4 h-4" /> MyAnimeList</a>
                                <span className="text-black/40 text-xs normal-case font-normal italic">"I use Arch btw"</span>
                                <a href="https://play.pokemonshowdown.com/users/canihave5dollars" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline decoration-2 underline-offset-4">@canihave5dollars</a>
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
                    <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-2">
                        <h2 className="text-2xl font-black font-serif uppercase tracking-widest">
                            Hobbies
                        </h2>
                        <span className="font-mono text-xs font-bold">ACTIVITIES</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {hobbies.map((item, index) => (
                            <div key={index} className="group relative aspect-square border-2 border-black bg-black overflow-hidden cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    priority={index < 2}
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <span className="text-white font-bold font-serif text-lg leading-tight">{item.title}</span>
                                    <span className="text-white/70 text-xs font-mono">{item.description}</span>
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
                    <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-2">
                        <h2 className="text-2xl font-black font-serif uppercase tracking-widest">
                            Cinema
                        </h2>
                        <span className="font-mono text-xs font-bold">FAVORITES_COLLECTION</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {favorites.map((item, index) => (
                            <div key={index} className="group relative aspect-[2/3] border-2 border-black bg-black overflow-hidden cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <span className="text-white font-bold font-serif text-lg leading-tight">{item.title}</span>
                                    <span className="text-white/70 text-xs font-mono">{item.year}</span>
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
                    <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-2">
                        <h2 className="text-2xl font-black font-serif uppercase tracking-widest">
                            Manga
                        </h2>
                        <span className="font-mono text-xs font-bold">READING_LIST</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {manga.map((item, index) => (
                            <div key={index} className="group relative aspect-[2/3] border-2 border-black bg-black overflow-hidden cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <span className="text-white font-bold font-serif text-lg leading-tight">{item.title}</span>
                                    <span className="text-white/70 text-xs font-mono">{item.author}</span>
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
                    <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-2">
                        <h2 className="text-2xl font-black font-serif uppercase tracking-widest">
                            Anime
                        </h2>
                        <span className="font-mono text-xs font-bold">WATCH_LIST</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {anime.map((item, index) => (
                            <div key={index} className="group relative aspect-[2/3] border-2 border-black bg-black overflow-hidden cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <span className="text-white font-bold font-serif text-lg leading-tight">{item.title}</span>
                                    <span className="text-white/70 text-xs font-mono">{item.year}</span>
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
                    <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-2">
                        <h2 className="text-2xl font-black font-serif uppercase tracking-widest">
                            Artists
                        </h2>
                        <span className="font-mono text-xs font-bold">PLAYLIST</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {artists.map((item, index) => (
                            <div key={index} className="group relative aspect-square border-2 border-black bg-black overflow-hidden cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <span className="text-white font-bold font-serif text-lg leading-tight">{item.name}</span>
                                    <span className="text-white/70 text-xs font-mono">{item.album}</span>
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
                    <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-2">
                        <h2 className="text-2xl font-black font-serif uppercase tracking-widest">
                            TV Shows
                        </h2>
                        <span className="font-mono text-xs font-bold">BINGE_LIST</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {tvShows.map((item, index) => (
                            <div key={index} className="group relative aspect-[2/3] border-2 border-black bg-black overflow-hidden cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <span className="text-white font-bold font-serif text-lg leading-tight">{item.title}</span>
                                    <span className="text-white/70 text-xs font-mono">{item.year}</span>
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
                        <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-2">
                            <h2 className="text-2xl font-black font-serif uppercase tracking-widest">
                                Path
                            </h2>
                            <span className="font-mono text-xs font-bold">MILESTONES</span>
                        </div>

                        <div className="space-y-6">
                            {visibleMilestones.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex gap-6 p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                    <div className="flex-shrink-0 w-20 h-24 border-2 border-black flex items-center justify-center flex-col gap-1 bg-black text-white">
                                        <span className="text-lg font-bold font-mono">{item.year}</span>
                                        <Disc className="w-6 h-6" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-xl font-serif uppercase tracking-wide">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex gap-0.5">
                                                {renderStars(item.rating)}
                                            </div>
                                            {item.loved && (
                                                <Heart className="w-4 h-4 fill-black text-black" />
                                            )}
                                        </div>
                                        <p className="text-sm font-serif leading-relaxed text-black/80">{item.review}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowAllMovies(!showAllMovies)}
                            className="mt-8 w-full py-4 border-2 border-black font-bold font-mono uppercase tracking-widest hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
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
                            <div className="flex items-center justify-between mb-6 border-b-4 border-black pb-2">
                                <h2 className="text-xl font-black font-serif uppercase tracking-widest">
                                    On Repeat
                                </h2>
                            </div>
                            <div className="border-2 border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <MusicPlayer />
                            </div>
                        </div>

                        <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-xl font-black font-serif uppercase mb-4 border-b-2 border-black pb-2">Diary</h3>
                            <div className="space-y-4 font-mono text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">This Year</span>
                                    <span className="bg-black text-white px-2 py-1 font-bold">142</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">This Month</span>
                                    <span className="bg-black text-white px-2 py-1 font-bold">12</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">Total</span>
                                    <span className="bg-black text-white px-2 py-1 font-bold">1,823</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </CenteredContainer>
        </div>
    );
}
