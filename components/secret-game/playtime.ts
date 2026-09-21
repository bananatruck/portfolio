"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Playtime, kept the way the games keep it: a single running clock that only
 * ticks while you're actually in the game, saved locally and never sent
 * anywhere.
 */

const LEGACY_PLAYTIME_KEY = "sg:playtime-ms";
const PLAYTIME_KEY = "sg:playtime-by-game-v1";
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

function loadPlaytimes(): Record<string, number> {
    const stored = read(PLAYTIME_KEY);
    if (!stored) return {};

    try {
        const parsed: unknown = JSON.parse(stored);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

        return Object.fromEntries(
            Object.entries(parsed).filter(
                (entry): entry is [string, number] =>
                    typeof entry[1] === "number" &&
                    Number.isFinite(entry[1]) &&
                    entry[1] >= 0,
            ),
        );
    } catch {
        return {};
    }
}

export function loadPlaytimeMs(gameId: string): number {
    const stored = loadPlaytimes()[gameId];
    if (stored !== undefined) return stored;

    // Carry the old single clock into the first game opened after this update.
    // Once the per-game map exists, other cartridges start from zero.
    const hasPerGameData = read(PLAYTIME_KEY) !== null;
    if (hasPerGameData) return 0;

    const legacy = Number(read(LEGACY_PLAYTIME_KEY));
    return Number.isFinite(legacy) && legacy > 0 ? legacy : 0;
}

function savePlaytimeMs(gameId: string, playtimeMs: number) {
    write(
        PLAYTIME_KEY,
        JSON.stringify({
            ...loadPlaytimes(),
            [gameId]: Math.max(0, Math.round(playtimeMs)),
        }),
    );
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
export function usePlaytime(running: boolean, gameId: string | null) {
    const [playtimeMs, setPlaytimeMs] = useState(0);
    const baseline = useRef(0);
    const startedAt = useRef<number | null>(null);

    useEffect(() => {
        baseline.current = gameId ? loadPlaytimeMs(gameId) : 0;
        startedAt.current = null;
        setPlaytimeMs(baseline.current);
    }, [gameId]);

    const total = useCallback(
        () => baseline.current + (startedAt.current === null ? 0 : Date.now() - startedAt.current),
        [],
    );

    useEffect(() => {
        if (!running || !gameId) return;

        startedAt.current = Date.now();
        let lastFlush = startedAt.current;

        const update = () => {
            const now = total();
            setPlaytimeMs(now);
            if (Date.now() - lastFlush >= FLUSH_INTERVAL_MS) {
                savePlaytimeMs(gameId, now);
                lastFlush = Date.now();
            }
        };

        // The visible rank now moves every second instead of appearing frozen
        // for up to 15 seconds. Storage writes keep their slower cadence.
        const timer = window.setInterval(update, 1000);
        // A closed tab never runs cleanup, so the clock is also written on the
        // way out — this is the one that catches most sessions.
        const flush = () => savePlaytimeMs(gameId, total());
        window.addEventListener("pagehide", flush);

        return () => {
            window.clearInterval(timer);
            window.removeEventListener("pagehide", flush);
            flush();
            baseline.current = total();
            startedAt.current = null;
        };
    }, [gameId, running, total]);

    return playtimeMs;
}
