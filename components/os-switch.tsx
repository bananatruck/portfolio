"use client";

// The K. mark, top left. Clicking it collapses the page like a CRT switching off, down to a
// single dot, then hands over to KESH_OS (public/os), whose boot picks up from that dot.
const OS_URL = process.env.NEXT_PUBLIC_OS_URL || "/os";

export function OsSwitch() {
    const enter = () => {
        const leave = () => {
            // Embedded (the design review shell shows the site in a frame), the parent owns the
            // switch; it checks the sender's origin, and the message carries no data.
            if (window.parent !== window) window.parent.postMessage({ type: "kesh:os" }, "*");
            else window.location.href = OS_URL;
        };
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return leave();
        const body = document.body;
        const root = document.documentElement;
        const prevBg = root.style.background;
        root.style.background = "#000";
        body.style.transformOrigin = `50% ${window.scrollY + window.innerHeight / 2}px`;
        const anim = body.animate(
            [
                { transform: "none", filter: "none" },
                { transform: "scale(1, 0.004)", filter: "brightness(3)", offset: 0.55 },
                { transform: "scale(0.004, 0.004)", filter: "brightness(6)" },
            ],
            { duration: 700, easing: "cubic-bezier(.6,0,.4,1)", fill: "forwards" },
        );
        anim.finished.then(() => {
            leave();
            // Put the page back for the return trip (the shell keeps it loaded; Back restores it from cache).
            setTimeout(() => { anim.cancel(); root.style.background = prevBg; body.style.transformOrigin = ""; }, 900);
        });
    };

    return (
        <button
            type="button"
            onClick={enter}
            title="Switch to KESH_OS"
            aria-label="K. Switch to KESH_OS, the desktop version of this site"
            className="group shrink-0 inline-flex items-end font-mono text-base sm:text-lg font-black leading-none text-foreground border-2 border-border px-2 py-1 bg-background shadow-[2px_2px_0px_0px_hsl(var(--foreground))] hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-0.5 transition-all"
        >
            K<span aria-hidden className="ml-[2px] mb-[1px] w-[5px] h-[5px] bg-emerald-500 animate-[k-blink_1s_steps(1)_infinite] group-hover:animate-none" />
        </button>
    );
}
