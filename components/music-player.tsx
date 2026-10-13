"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from 'lucide-react';

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

// Cover art for the artists the site already has pictures of; the rest get a lettered tile.
const COVERS: Record<string, string> = {
    "Radiohead": "/images/radiohead.webp",
    "Pink Floyd": "/images/Pink-Floyd.webp",
    "Masayoshi Takanaka": "/images/Masayoshi-Takanaka.webp",
    "The Strokes": "/images/the-strokes.webp",
};

const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    return `${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, '0')}`;
};

function Cover({ artist, size }: { artist: string; size: number }) {
    const src = COVERS[artist];
    return src ? (
        <img src={src} alt="" width={size} height={size} loading="lazy" className="object-cover flex-shrink-0 grayscale-[35%]" style={{ width: size, height: size }} />
    ) : (
        <div className="flex-shrink-0 grid place-items-center bg-foreground/10 text-foreground/70 font-mono font-bold" style={{ width: size, height: size, fontSize: size * 0.32 }}>
            {artist.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
    );
}

function Bars() {
    return (
        <span className="inline-flex items-end gap-[2px] h-3 w-3" aria-hidden>
            {[0, 1, 2].map(i => <i key={i} className="w-[3px] h-full origin-bottom bg-emerald-400 motion-safe:animate-[eq_0.9s_ease-in-out_infinite]" style={{ animationDelay: `${i * -0.3}s`, transform: 'scaleY(0.4)' }} />)}
        </span>
    );
}

interface MusicPlayerProps {
    songIndex?: number;
}

export function MusicPlayer({ songIndex }: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [hasError, setHasError] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const wantPlay = useRef(false);
    // Read by the 'ended' handler, so toggling them never re-runs the audio effect.
    const shuffleRef = useRef(shuffle);
    const repeatRef = useRef(repeat);
    shuffleRef.current = shuffle;
    repeatRef.current = repeat;

    const currentSong = SONG_LIBRARY[currentIndex] || SONG_LIBRARY[0];

    useEffect(() => {
        setCurrentIndex(songIndex !== undefined && SONG_LIBRARY[songIndex] ? songIndex : Math.floor(Math.random() * SONG_LIBRARY.length));
    }, [songIndex]);

    const pick = useCallback((step: 1 | -1) => {
        setCurrentIndex(prev => {
            if (shuffleRef.current && SONG_LIBRARY.length > 1) {
                let n = prev;
                while (n === prev) n = Math.floor(Math.random() * SONG_LIBRARY.length);
                return n;
            }
            return (prev + step + SONG_LIBRARY.length) % SONG_LIBRARY.length;
        });
    }, []);

    const handleEnded = useCallback(() => {
        const audio = audioRef.current;
        if (repeatRef.current && audio) { audio.currentTime = 0; void audio.play(); return; }
        wantPlay.current = true;
        pick(1);
    }, [pick]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const onTime = () => setCurrentTime(audio.currentTime);
        const onMeta = () => { setDuration(audio.duration); setHasError(false); };
        const onError = () => setHasError(true);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        audio.addEventListener('timeupdate', onTime);
        audio.addEventListener('loadedmetadata', onMeta);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', onError);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.load();
        setCurrentTime(0);
        if (wantPlay.current) audio.play().catch(() => setIsPlaying(false));
        return () => {
            audio.removeEventListener('timeupdate', onTime);
            audio.removeEventListener('loadedmetadata', onMeta);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('error', onError);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
        };
    }, [currentIndex, handleEnded]);

    useEffect(() => {
        if (audioRef.current) { audioRef.current.volume = volume; audioRef.current.muted = isMuted; }
    }, [volume, isMuted]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio || hasError) return;
        // A rejected play() (autoplay policy, an aborted load) is not a broken track; only the
        // element's own 'error' event disables the button.
        if (audio.paused) { wantPlay.current = true; audio.play().catch(() => { wantPlay.current = false; setIsPlaying(false); }); }
        else { wantPlay.current = false; audio.pause(); }
    };
    const playTrack = (i: number) => {
        if (i === currentIndex) { togglePlay(); return; }
        wantPlay.current = true;
        setCurrentIndex(i);
    };
    const seek = (value: number) => {
        if (audioRef.current && duration) { audioRef.current.currentTime = value; setCurrentTime(value); }
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="font-mono text-foreground flex flex-col min-h-0 lg:flex-1">
            <audio ref={audioRef} src={`/music/${encodeURIComponent(currentSong.file)}`} preload="metadata" />

            {/* Now playing */}
            <div className="flex items-center gap-3 p-3">
                <Cover artist={currentSong.artist} size={56} />
                <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold truncate">{currentSong.title}</div>
                    <div className="text-xs text-foreground/60 truncate">{currentSong.artist}</div>
                </div>
                {isPlaying && <Bars />}
            </div>

            <div className="px-3 pb-3">
                <div className="flex items-center justify-center gap-4">
                    <button onClick={() => setShuffle(v => !v)} title="Shuffle" aria-pressed={shuffle} className={`p-1.5 transition-colors ${shuffle ? 'text-emerald-400' : 'text-foreground/50 hover:text-foreground'}`}><Shuffle className="w-4 h-4" /></button>
                    <button onClick={() => { wantPlay.current = isPlaying; pick(-1); }} title="Previous" className="p-1.5 text-foreground/70 hover:text-foreground transition-colors"><SkipBack className="w-4 h-4 fill-current" /></button>
                    <button
                        onClick={togglePlay}
                        disabled={hasError}
                        title={isPlaying ? 'Pause' : 'Play'}
                        className="w-10 h-10 rounded-full grid place-items-center bg-foreground text-background hover:scale-105 active:scale-95 transition-transform disabled:opacity-40"
                    >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <button onClick={() => { wantPlay.current = isPlaying; pick(1); }} title="Next" className="p-1.5 text-foreground/70 hover:text-foreground transition-colors"><SkipForward className="w-4 h-4 fill-current" /></button>
                    <button onClick={() => setRepeat(v => !v)} title="Repeat one" aria-pressed={repeat} className={`p-1.5 transition-colors ${repeat ? 'text-emerald-400' : 'text-foreground/50 hover:text-foreground'}`}><Repeat className="w-4 h-4" /></button>
                </div>

                <div className="mt-2 flex items-center gap-2 text-[10px] text-foreground/50 tabular-nums">
                    <span className="w-8 text-right">{formatTime(currentTime)}</span>
                    <div className="group relative flex-1 h-4 flex items-center">
                        <div className="absolute inset-x-0 h-[3px] rounded-full bg-foreground/15" />
                        <div className="absolute left-0 h-[3px] rounded-full bg-foreground group-hover:bg-emerald-400 transition-colors" style={{ width: `${progress}%` }} />
                        <div className="absolute w-3 h-3 rounded-full bg-foreground opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2" style={{ left: `${progress}%` }} />
                        <input type="range" aria-label="Seek" min={0} max={duration || 0} step={0.1} value={currentTime} onChange={e => seek(Number(e.target.value))} className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                    </div>
                    <span className="w-8">{formatTime(duration)}</span>
                </div>

                <div className="mt-1 flex items-center justify-end gap-2">
                    <button onClick={() => setIsMuted(m => !m)} title={isMuted ? 'Unmute' : 'Mute'} className="text-foreground/60 hover:text-foreground transition-colors">
                        {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input type="range" aria-label="Volume" min={0} max={1} step={0.01} value={isMuted ? 0 : volume} onChange={e => { setVolume(Number(e.target.value)); setIsMuted(false); }} className="w-24 h-1 accent-emerald-400 cursor-pointer" />
                </div>
            </div>

            {/* Track list */}
            <ol className="border-t border-foreground/10 max-h-72 lg:max-h-none lg:flex-1 lg:min-h-0 lg:basis-0 overflow-y-auto py-1">
                {SONG_LIBRARY.map((song, i) => {
                    const current = i === currentIndex;
                    return (
                        <li key={song.file}>
                            <button
                                onClick={() => playTrack(i)}
                                className={`group w-full grid grid-cols-[28px_32px_1fr] items-center gap-3 px-3 py-1.5 text-left rounded-sm transition-colors hover:bg-foreground/[0.07] ${current ? 'text-emerald-400' : ''}`}
                            >
                                <span className="text-[11px] text-foreground/40 tabular-nums text-right">
                                    <span className="group-hover:hidden">{current && isPlaying ? <Bars /> : i + 1}</span>
                                    <span className="hidden group-hover:inline text-foreground">{current && isPlaying ? '❚❚' : '▶'}</span>
                                </span>
                                <Cover artist={song.artist} size={32} />
                                <span className="min-w-0">
                                    <span className="block text-xs font-bold truncate">{song.title}</span>
                                    <span className="block text-[11px] text-foreground/50 truncate">{song.artist}</span>
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
