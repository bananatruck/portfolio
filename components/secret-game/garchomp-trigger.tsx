"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { getBasePath } from "./base-path";
import "./secret-game.css";

/** How long the sprite has to be held before the game opens. */
const HOLD_DURATION_MS = 1500;
/** Beat between the cry landing and the boot sequence taking over. */
const CRY_LEAD_MS = 260;

// Nothing here is fetched until the egg actually fires: the overlay is a
// separate chunk, the emulator lives in an iframe that doesn't exist yet, and
// the cry is only constructed on first press.
const SecretGameOverlay = dynamic(() => import("./secret-game-overlay"), { ssr: false });

export function GarchompTrigger() {
    const [charging, setCharging] = useState(false);
    const [open, setOpen] = useState(false);

    const fillRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<number | null>(null);
    const launchRef = useRef<number | null>(null);
    const cryRef = useRef<HTMLAudioElement | null>(null);

    const cancelHold = useCallback(() => {
        if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }
        setCharging(false);
        if (fillRef.current) fillRef.current.style.width = "0%";
    }, []);

    const launch = useCallback(() => {
        cancelHold();

        // Constructed lazily, and played from inside the pointer/key handler's
        // gesture so autoplay policy lets it through.
        const cry = cryRef.current ?? new Audio(`${getBasePath()}/cries/garchomp.ogg`);
        cryRef.current = cry;
        cry.currentTime = 0;
        cry.volume = 0.55;
        void cry.play().catch(() => {});

        // The cry is detached from the DOM, so the overlay's "pause everything"
        // pass doesn't catch it and it rings out over the boot animation.
        launchRef.current = window.setTimeout(() => setOpen(true), CRY_LEAD_MS);
    }, [cancelHold]);

    const beginHold = useCallback(() => {
        if (open || frameRef.current !== null) return;

        setCharging(true);
        const startedAt = performance.now();

        const step = () => {
            const progress = Math.min((performance.now() - startedAt) / HOLD_DURATION_MS, 1);
            // Written straight to the node rather than through state, so a
            // 60fps meter doesn't re-render the About section.
            if (fillRef.current) fillRef.current.style.width = `${progress * 100}%`;

            if (progress >= 1) {
                frameRef.current = null;
                launch();
                return;
            }
            frameRef.current = requestAnimationFrame(step);
        };

        frameRef.current = requestAnimationFrame(step);
    }, [launch, open]);

    useEffect(
        () => () => {
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
            if (launchRef.current !== null) window.clearTimeout(launchRef.current);
        },
        [],
    );

    return (
        <>
            <button
                type="button"
                className="sg-trigger"
                data-charging={charging}
                aria-label="Garchomp — hold to wake him up"
                onPointerDown={(event) => {
                    // Ignore secondary buttons so a right-click doesn't arm the hold.
                    if (event.button !== 0) return;
                    // Capture keeps the hold alive if the pointer drifts off the
                    // 32px sprite mid-press, which is easy to do over 1.5s.
                    try {
                        event.currentTarget.setPointerCapture(event.pointerId);
                    } catch {
                        // Non-fatal: the hold just becomes less forgiving.
                    }
                    beginHold();
                }}
                onPointerUp={cancelHold}
                onPointerCancel={cancelHold}
                onPointerLeave={cancelHold}
                onKeyDown={(event) => {
                    if (event.key !== " " && event.key !== "Enter") return;
                    // Space would scroll the page, and both keys auto-repeat.
                    event.preventDefault();
                    if (event.repeat) return;
                    beginHold();
                }}
                onKeyUp={cancelHold}
                onBlur={cancelHold}
                onContextMenu={(event) => event.preventDefault()}
            >
                <img
                    src="/garchomp.gif"
                    alt="Garchomp"
                    loading="lazy"
                    decoding="async"
                    className="w-8 h-8 mb-1 grayscale hover:grayscale-0 transition-all duration-300"
                />
                <span className="sg-charge" aria-hidden="true">
                    <span ref={fillRef} className="sg-charge-fill" />
                </span>
            </button>

            {open ? <SecretGameOverlay onClose={() => setOpen(false)} /> : null}
        </>
    );
}
