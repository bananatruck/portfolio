"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Playtime, kept the way the games keep it: a single running clock that only
 * ticks while you're actually in the game, saved locally and never sent
 * anywhere.
 */

const PLAYTIME_KEY = "sg:playtime-ms";
const TRAINER_KEY = "sg:trainer-name";

/** How often the clock is written back. Often enough that a hard close costs
 *  seconds, rarely enough that it isn't touching storage every frame. */
const FLUSH_INTERVAL_MS = 15000;

function read(key: string): string | null {
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
}

function write(key: string, value: string) {
    try {
        window.localStorage.setItem(key, value);
    } catch {
        // Storage is optional here — the clock just resets next visit.
    }
}

export function loadPlaytimeMs(): number {
    const stored = Number(read(PLAYTIME_KEY));
    return Number.isFinite(stored) && stored > 0 ? stored : 0;
}

export function loadTrainerName(): string {
    return read(TRAINER_KEY) ?? "";
}

export function saveTrainerName(name: string) {
    write(TRAINER_KEY, name);
}

/** "3h 42m", or "12m" under the hour — the RTC clock format, near enough. */
export function formatPlaytime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours === 0) return `${minutes}m`;
    return `${hours.toLocaleString()}h ${minutes % 60}m`;
}

/**
 * Runs the clock while `running` is true.
 *
 * Time is measured from a start stamp rather than accumulated per tick, so the
 * total stays honest even if the tab is throttled in the background and the
 * interval fires late or not at all.
 */
export function usePlaytime(running: boolean) {
    const [playtimeMs, setPlaytimeMs] = useState(0);
    const baseline = useRef(0);
    const startedAt = useRef<number | null>(null);

    useEffect(() => {
        baseline.current = loadPlaytimeMs();
        setPlaytimeMs(baseline.current);
    }, []);

    const total = useCallback(
        () => baseline.current + (startedAt.current === null ? 0 : Date.now() - startedAt.current),
        [],
    );

    useEffect(() => {
        if (!running) return;

        startedAt.current = Date.now();

        const flush = () => {
            const now = total();
            setPlaytimeMs(now);
            write(PLAYTIME_KEY, String(Math.round(now)));
        };

        const timer = window.setInterval(flush, FLUSH_INTERVAL_MS);
        // A closed tab never runs cleanup, so the clock is also written on the
        // way out — this is the one that catches most sessions.
        window.addEventListener("pagehide", flush);

        return () => {
            window.clearInterval(timer);
            window.removeEventListener("pagehide", flush);
            flush();
            baseline.current = total();
            startedAt.current = null;
        };
    }, [running, total]);

    return playtimeMs;
}
