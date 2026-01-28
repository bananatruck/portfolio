"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';

// Song library - these are the actual MP3 files in public/music
const SONG_LIBRARY = [
    { file: "04 Fake Plastic Trees.mp3", title: "Fake Plastic Trees", artist: "Radiohead" },
    { file: "10 (10) No Surprises.mp3", title: "No Surprises", artist: "Radiohead" },
    { file: "06 (06) Karma Police.mp3", title: "Karma Police", artist: "Radiohead" },
    { file: "01 (01) Airbag.mp3", title: "Airbag", artist: "Radiohead" },
    { file: "02 Selfless.mp3", title: "Selfless", artist: "The Strokes" },
    { file: "07 Why Are Sunday's So Depressing.mp3", title: "Why Are Sunday's So Depressing", artist: "The Strokes" },
    { file: "09 Ode To The Mets.mp3", title: "Ode To The Mets", artist: "The Strokes" },
    { file: "2 Breathe (In the Air).mp3", title: "Breathe (In the Air)", artist: "Pink Floyd" },
    { file: "4 Time.mp3", title: "Time", artist: "Pink Floyd" },
    { file: "Masayoshi Takanaka - Chill Me Out - 1982.mp3", title: "Chill Me Out", artist: "Masayoshi Takanaka" },
    { file: "01 Space Oddity David Bowie.mp3", title: "Space Oddity", artist: "David Bowie" },
];

interface MusicPlayerProps {
    songIndex?: number;
}

export function MusicPlayer({ songIndex }: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentSong, setCurrentSong] = useState(SONG_LIBRARY[0]);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Select random song on mount
    useEffect(() => {
        if (songIndex !== undefined && SONG_LIBRARY[songIndex]) {
            setCurrentSong(SONG_LIBRARY[songIndex]);
        } else {
            const randomIndex = Math.floor(Math.random() * SONG_LIBRARY.length);
            setCurrentSong(SONG_LIBRARY[randomIndex]);
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
        audio.addEventListener('ended', () => setIsPlaying(false));
        audio.addEventListener('error', handleError);
        audio.addEventListener('canplay', handleCanPlay);

        // Try to load the audio
        audio.load();

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', () => setIsPlaying(false));
            audio.removeEventListener('error', handleError);
            audio.removeEventListener('canplay', handleCanPlay);
        };
    }, [currentSong]);

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

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="flex items-center gap-4">
            <audio
                ref={audioRef}
                src={`/music/${encodeURIComponent(currentSong.file)}`}
                preload="metadata"
            />

            <button
                onClick={togglePlay}
                disabled={hasError || isLoading}
                className="flex-shrink-0 w-12 h-12 flex items-center justify-center border-2 border-foreground hover:bg-foreground hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
                ) : hasError ? (
                    <Music className="w-5 h-5" />
                ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                )}
            </button>

            <div className="flex-1 min-w-0">
                <div className="text-sm font-bold font-mono text-foreground truncate uppercase">
                    {currentSong.title}
                </div>
                <div className="text-xs text-foreground/60 truncate font-serif">
                    {currentSong.artist}
                </div>

                <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-foreground/20 overflow-hidden">
                        <div
                            className="h-full bg-foreground transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-xs text-foreground/60 font-mono tabular-nums">
                        {formatTime(currentTime)}
                    </span>
                </div>
            </div>
        </div>
    );
}
