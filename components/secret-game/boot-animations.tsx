"use client";

import { useMemo } from "react";
import { getBasePath } from "./base-path";

/**
 * Six boot screens, one per generation, played inside the console's screen while
 * the core spins up.
 *
 * They're recreations rather than captures — palette, cadence and the box
 * legendary, in the spirit of each game's opening — built out of DOM and CSS so
 * they stay sharp at any size and cost a sprite each rather than a video.
 */

export const BOOT_KINDS = [
    "firered",
    "emerald",
    "heartgold",
    "platinum",
    "black",
    "white",
] as const;

export type BootKind = (typeof BOOT_KINDS)[number];

/** Remembers that the emulator has been opened before. */
const SEEN_KEY = "sg:booted-before";

type BootTheme = {
    title: string;
    subtitle: string;
    /** Number of drifting particles; each game's differ in look, not count. */
    motes: number;
};

const THEMES: Record<BootKind, BootTheme> = {
    firered: { title: "FIRE RED", subtitle: "VERSION", motes: 10 },
    emerald: { title: "EMERALD", subtitle: "VERSION", motes: 8 },
    heartgold: { title: "HEART GOLD", subtitle: "VERSION", motes: 9 },
    platinum: { title: "PLATINUM", subtitle: "VERSION", motes: 7 },
    black: { title: "BLACK", subtitle: "VERSION", motes: 6 },
    white: { title: "WHITE", subtitle: "VERSION", motes: 6 },
};

/**
 * FireRed on the very first open, every time — it's the one the whole easter egg
 * is built around, and a first-timer should always get it. After that it's a
 * coin toss between all six.
 *
 * Reads storage rather than taking a prop so the choice is made once, at the
 * moment the overlay mounts, and can't change under a re-render.
 */
export function pickBootKind(): BootKind {
    let seen = false;
    try {
        seen = window.localStorage.getItem(SEEN_KEY) === "1";
        window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
        // Private mode, or storage is full. Falling through means a first-time
        // FireRed every visit, which is the nicer way to be wrong.
    }

    if (!seen) return "firered";
    return BOOT_KINDS[Math.floor(Math.random() * BOOT_KINDS.length)];
}

export function BootAnimation({ kind, leaving }: { kind: BootKind; leaving: boolean }) {
    const basePath = useMemo(getBasePath, []);
    const theme = THEMES[kind];

    return (
        <div className="sg-bootscreen" data-kind={kind} data-leaving={leaving} aria-hidden="true">
            <div className="sg-boot-sky" />
            <div className="sg-boot-sweep" />

            <div className="sg-boot-motes">
                {Array.from({ length: theme.motes }, (_, index) => (
                    <span
                        key={index}
                        className="sg-mote"
                        style={{
                            // Spread across the width on a fixed pattern rather than
                            // at random, so nothing ever clumps into one corner.
                            left: `${(index * 100) / theme.motes + 4}%`,
                            animationDelay: `${(index % 5) * 0.34}s`,
                            animationDuration: `${2.6 + (index % 3) * 0.7}s`,
                        }}
                    />
                ))}
            </div>

            <img
                className="sg-boot-sprite"
                src={`${basePath}/secret-game/boot/${kind}.gif`}
                alt=""
                decoding="async"
            />

            <div className="sg-boot-plate">
                <p className="sg-boot-game">{theme.title}</p>
                <p className="sg-boot-version">{theme.subtitle}</p>
            </div>

            <div className="sg-boot-progress">
                <span className="sg-boot-progress-fill" />
            </div>
            <p className="sg-boot-status">NOW LOADING</p>
        </div>
    );
}
