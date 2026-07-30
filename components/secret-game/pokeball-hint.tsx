"use client";

import { useEffect, useState } from "react";
import { PixelPokeball } from "./pixel-icons";
import "./secret-game.css";

/**
 * A pokeball that wobbles in the corner while you're reading the About section,
 * and only there. Clicking it points at the real easter egg without giving the
 * whole thing away.
 *
 * It stays deliberately small and unlabelled: the egg is still meant to be
 * found, not announced.
 */
export function PokeballHint({ sectionRef }: { sectionRef: React.RefObject<HTMLElement> }) {
    const [inView, setInView] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // A slice of the section has to be genuinely on screen, so the ball
        // doesn't appear for a section that's only just clipping into view.
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.15 },
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, [sectionRef]);

    // Scrolling away closes the note too, rather than leaving it to reappear
    // mid-sentence the next time the section comes back.
    useEffect(() => {
        if (!inView) setOpen(false);
    }, [inView]);

    if (!inView) return null;

    return (
        <div className="sg-hint">
            {open ? (
                <p className="sg-hint-bubble" role="status">
                    Pat garchomp for a bit to get a surprise!
                </p>
            ) : null}

            <button
                type="button"
                className="sg-hint-ball"
                data-open={open}
                onClick={() => setOpen((shown) => !shown)}
                aria-label="Something is rustling"
                aria-expanded={open}
            >
                <PixelPokeball size={28} />
            </button>
        </div>
    );
}
