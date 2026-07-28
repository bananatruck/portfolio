"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Music, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

const SONG_LIBRARY = [
    { file: "01 (01) Airbag.mp3", title: "Airbag", artist: "Radiohead" },
    { file: "02 (02) Paranoid Android.mp3", title: "Paranoid Android", artist: "Radiohead" },
    { file: "03 (03) Subterranean Homesick Alien.mp3", title: "Subterranean Homesick Alien", artist: "Radiohead" },
    { file: "05 (05) Let Down.mp3", title: "Let Down", artist: "Radiohead" },
    { file: "06 (06) Karma Police.mp3", title: "Karma Police", artist: "Radiohead" },
    { file: "10 (10) No Surprises.mp3", title: "No Surprises", artist: "Radiohead" },
    { file: "04 Fake Plastic Trees.mp3", title: "Fake Plastic Trees", artist: "Radiohead" },
    { file: "01 The Adults Are Talking.mp3", title: "The Adults Are Talking", artist: "The Strokes" },
    { file: "02 Selfless.mp3", title: "Selfless", artist: "The Strokes" },
    { file: "09 Ode To The Mets.mp3", title: "Ode To The Mets", artist: "The Strokes" },
    { file: "4 Time.mp3", title: "Time", artist: "Pink Floyd" },
    { file: "5 The Great Gig in the Sky.mp3", title: "The Great Gig in the Sky", artist: "Pink Floyd" },
    { file: "7 Us and Them.mp3", title: "Us and Them", artist: "Pink Floyd" },
    { file: "Masayoshi Takanaka - Chill Me Out - 1982.mp3", title: "Chill Me Out", artist: "Masayoshi Takanaka" },
    { file: "Masayoshi Takanaka -Thunderstorm - 1981.mp3", title: "Thunderstorm", artist: "Masayoshi Takanaka" },
    { file: "01 Space Oddity David Bowie.mp3", title: "Space Oddity", artist: "David Bowie" },
    { file: "21. George Michael - Careless Whisper.mp3", title: "Careless Whisper", artist: "George Michael" },
    { file: "Jeff Buckley - Grace - 07 - Lover, You Should've Come Over.mp3", title: "Lover, You Should've Come Over", artist: "Jeff Buckley" },
    { file: "4. 11. Shihoko Hirata - Heartbeat, Heartbreak.mp3", title: "Heartbeat, Heartbreak", artist: "Shihoko Hirata" },
];

interface MusicPlayerProps {
    songIndex?: number;
}

export function MusicPlayer({ songIndex }: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    const currentSong = SONG_LIBRARY[currentIndex] || SONG_LIBRARY[0];

    useEffect(() => {
        if (songIndex !== undefined && SONG_LIBRARY[songIndex]) {
            setCurrentIndex(songIndex);
        } else {
            const randomIndex = Math.floor(Math.random() * SONG_LIBRARY.length);
            setCurrentIndex(randomIndex);
        }
    }, [songIndex]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => {
            setDuration(audio.duration);
            setHasError(false);
            setIsLoading(false);
        };
        const handleError = () => {
            setHasError(true);
            setIsLoading(false);
        };
        const handleCanPlay = () => {
            setIsLoading(false);
            setHasError(false);
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleNext);
        audio.addEventListener('error', handleError);
        audio.addEventListener('canplay', handleCanPlay);

        audio.load();
        if (isPlaying) {
            audio.play().catch(() => setIsPlaying(false));
        }

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleNext);
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('canplay', handleCanPlay);
        };
    }, [currentIndex]);

    const togglePlay = async () => {
        if (audioRef.current && !hasError) {
            try {
                if (isPlaying) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                } else {
                    await audioRef.current.play();
                    setIsPlaying(true);
                }
            } catch (err) {
                setHasError(true);
            }
        }
    };

    const handleNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % SONG_LIBRARY.length);
    }, []);

    const handlePrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + SONG_LIBRARY.length) % SONG_LIBRARY.length);
    }, []);

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current || !audioRef.current || !duration) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const newTime = (clickX / width) * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="p-3 sm:p-4 space-y-4 font-mono">
            <audio
                ref={audioRef}
                src={`/music/${encodeURIComponent(currentSong.file)}`}
                preload="metadata"
            />

            {/* Header Track Info & Green LED Indicator */}
            <div className="flex items-center justify-between gap-3 border-b-2 border-foreground/30 pb-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${isPlaying ? 'bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse' : 'bg-foreground/30'}`} />
                    <div className="min-w-0 flex-1">
                        <div className="text-sm font-black text-foreground truncate uppercase tracking-wider">
                            {currentSong.title}
                        </div>
                        <div className="text-xs text-foreground/70 truncate font-serif font-medium mt-0.5">
                            {currentSong.artist}
                        </div>
                    </div>
                </div>
            </div>

            {/* Vertically Stretched Control Buttons & Timestamp Rows */}
            <div className="flex flex-col gap-3 py-1">
                {/* Control Buttons Centered */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Previous Button */}
                        <button
                            onClick={handlePrev}
                            title="Previous Track"
                            className="p-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-all text-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                        >
                            <SkipBack className="w-4 h-4" />
                        </button>

                        {/* Main Play/Pause Button */}
                        <button
                            onClick={togglePlay}
                            disabled={hasError || isLoading}
                            className="p-3 border-2 border-foreground bg-foreground text-background hover:bg-emerald-500 hover:border-emerald-500 hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_hsl(var(--foreground))] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_hsl(var(--foreground))]"
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                            ) : hasError ? (
                                <Music className="w-4 h-4" />
                            ) : isPlaying ? (
                                <Pause className="w-4 h-4" />
                            ) : (
                                <Play className="w-4 h-4 ml-0.5" />
                            )}
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={handleNext}
                            title="Next Track"
                            className="p-2 border-2 border-foreground hover:bg-foreground hover:text-background transition-all text-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                        >
                            <SkipForward className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={toggleMute}
                        title={isMuted ? "Unmute" : "Mute"}
                        className="p-2 border border-foreground/40 hover:border-foreground text-foreground/70 hover:text-foreground transition-colors"
                    >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                </div>

                {/* Dedicated Timestamp Row */}
                <div className="flex items-center justify-between text-xs text-emerald-500 font-mono font-bold tabular-nums pt-1 border-t border-foreground/10">
                    <span>TIMECODE</span>
                    <span className="bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/30">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                </div>
            </div>

            {/* Clickable Progress Bar */}
            <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="relative h-3 bg-foreground/10 border-2 border-foreground/50 cursor-pointer overflow-hidden group shadow-[1px_1px_0px_0px_hsl(var(--foreground))]"
            >
                <div
                    className="h-full bg-emerald-500 group-hover:bg-emerald-400 transition-all duration-75 shadow-[0_0_8px_#10b981]"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}


