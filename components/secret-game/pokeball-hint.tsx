"use client";

import { useEffect, useMemo, useState } from "react";
import { getBasePath } from "./base-path";
import "./secret-game.css";

/**
 * A pokeball that rocks in the corner while you're reading the About section,
 * and only there. Tapping it points at the real easter egg without giving the
 * whole thing away.
 *
 * It stays unlabelled: the egg is still meant to be found, not announced.
 */
export function PokeballHint({ sectionRef }: { sectionRef: React.RefObject<HTMLElement> }) {
    const [inView, setInView] = useState(false);
    const [open, setOpen] = useState(false);
    const basePath = useMemo(getBasePath, []);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        // Fires on how much of the *viewport* the section covers rather than a
        // ratio of the section itself: About is several screens tall, so a
        // threshold against its own height would never be met on a phone.
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { rootMargin: "-20% 0px -20% 0px" },
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
                <img
                    src={`${basePath}/secret-game/pokeball.webp`}
                    alt=""
                    width={40}
                    height={40}
                    decoding="async"
                />
            </button>
        </div>
    );
}
