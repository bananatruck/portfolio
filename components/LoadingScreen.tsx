"use client";

import { useState, useEffect } from "react";

export default function LoadingScreen() {
    const [phase, setPhase] = useState<"loading" | "exit" | "done">("loading");
    const [shouldShow, setShouldShow] = useState(true);

    useEffect(() => {
        // If loading screen already played this session, skip entirely
        if (sessionStorage.getItem("loadingDone")) {
            setShouldShow(false);
            window.dispatchEvent(new CustomEvent("loadingComplete"));
            return;
        }

        // Start exit after 2.4s
        const exitTimer = setTimeout(() => setPhase("exit"), 2400);
        return () => clearTimeout(exitTimer);
    }, []);

    useEffect(() => {
        if (phase === "done") {
            // Mark as played and dispatch event
            sessionStorage.setItem("loadingDone", "1");
            window.dispatchEvent(new CustomEvent("loadingComplete"));
        }
    }, [phase]);

    if (!shouldShow || phase === "done") return null;

    return (
        <div
            className={`loading-screen ${phase === "exit" ? "loading-screen--exit" : ""}`}
            onAnimationEnd={(e) => {
                if (e.animationName === "pageTurnFade") {
                    setPhase("done");
                }
            }}
        >
            {/* Subtle halftone dots — the only background texture */}
            <div className="halftone-overlay" />

            {/* Central manga panel */}
            <div className="manga-loading-panel" style={{ opacity: 0 }}>
                <div className="panel-border" />

                {/* KESH text — matches header font exactly */}
                <div className="loading-title">
                    {"KESH".split("").map((char, i) => (
                        <span
                            key={i}
                            className="loading-letter"
                            style={{ animationDelay: `${0.3 + i * 0.12}s` }}
                        >
                            {char}
                        </span>
                    ))}
                </div>

                {/* Subtitle */}
                <div className="loading-subtitle">
                    <span className="subtitle-text">ポートフォリオ</span>
                </div>

                {/* Brush stroke progress bar */}
                <div className="brush-progress">
                    <svg viewBox="0 0 200 12" className="brush-svg" preserveAspectRatio="none">
                        {/* Track — faint brush outline */}
                        <path
                            d="M4 6 C20 3, 40 9, 60 5 C80 2, 100 8, 120 4 C140 7, 160 3, 180 6 C190 8, 196 5, 196 6"
                            className="brush-track"
                            strokeLinecap="round"
                        />
                        {/* Fill — animated brush stroke */}
                        <path
                            d="M4 6 C20 3, 40 9, 60 5 C80 2, 100 8, 120 4 C140 7, 160 3, 180 6 C190 8, 196 5, 196 6"
                            className="brush-fill"
                            strokeLinecap="round"
                        />
                    </svg>
                    {/* Ink splatter at the end */}
                    <div className="ink-splatter" />
                </div>
            </div>

            <style jsx>{`
                .loading-screen {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: hsl(60 10% 96%);
                    overflow: hidden;
                }

                :global(.dark) .loading-screen {
                    background: hsl(0 0% 5%) !important;
                }

                /* ── Halftone overlay ── */
                .halftone-overlay {
                    position: absolute;
                    inset: 0;
                    opacity: 0.03;
                    background-image: radial-gradient(hsl(0 0% 0%) 1px, transparent 1px);
                    background-size: 8px 8px;
                    pointer-events: none;
                }

                :global(.dark) .halftone-overlay {
                    background-image: radial-gradient(hsl(60 10% 96%) 1px, transparent 1px);
                }

                /* ── Central Panel ── */
                .manga-loading-panel {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 14px;
                    padding: 40px 56px;
                    animation: panelAppear 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
                }

                .panel-border {
                    position: absolute;
                    inset: 0;
                    border: 2px solid hsl(0 0% 0%);
                    box-shadow: 2px 2px 0px 0px hsl(0 0% 0%);
                    animation: borderDraw 0.6s ease-out 0.15s both;
                }

                :global(.dark) .panel-border {
                    border-color: hsl(60 10% 96%);
                    box-shadow: 2px 2px 0px 0px hsl(60 10% 96%);
                }

                @keyframes panelAppear {
                    0% {
                        opacity: 0;
                        transform: scale(0.92);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                @keyframes borderDraw {
                    0% {
                        clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
                    }
                    100% {
                        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                    }
                }

                /* ── Title — matches header: font-mono, font-black, tracking-wider ── */
                .loading-title {
                    display: flex;
                    gap: 4px;
                    font-family: var(--font-mono), ui-monospace, monospace;
                    font-size: clamp(2.5rem, 7vw, 4rem);
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    color: hsl(0 0% 0%);
                    position: relative;
                    z-index: 1;
                }

                :global(.dark) .loading-title {
                    color: hsl(60 10% 96%);
                }

                .loading-letter {
                    display: inline-block;
                    opacity: 0;
                    animation: letterReveal 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                @keyframes letterReveal {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                        filter: blur(2px);
                    }
                    70% {
                        opacity: 1;
                        filter: blur(0px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                        filter: blur(0px);
                    }
                }

                /* ── Subtitle ── */
                .loading-subtitle {
                    position: relative;
                    z-index: 1;
                }

                .subtitle-text {
                    display: block;
                    font-family: var(--font-mono), monospace;
                    font-size: 0.75rem;
                    letter-spacing: 0.35em;
                    color: hsl(0 0% 45%);
                    opacity: 0;
                    animation: subtitleFade 0.5s ease-out 0.8s forwards;
                }

                :global(.dark) .subtitle-text {
                    color: hsl(0 0% 55%);
                }

                @keyframes subtitleFade {
                    0% {
                        opacity: 0;
                        transform: translateY(6px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* ── Brush Stroke Progress ── */
                .brush-progress {
                    position: relative;
                    z-index: 1;
                    width: 180px;
                    height: 12px;
                    margin-top: 6px;
                }

                .brush-svg {
                    width: 100%;
                    height: 100%;
                    overflow: visible;
                }

                .brush-track {
                    fill: none;
                    stroke: hsl(0 0% 0% / 0.08);
                    stroke-width: 3;
                }

                :global(.dark) .brush-track {
                    stroke: hsl(60 10% 96% / 0.08);
                }

                .brush-fill {
                    fill: none;
                    stroke: hsl(0 0% 0%);
                    stroke-width: 3.5;
                    stroke-dasharray: 220;
                    stroke-dashoffset: 220;
                    animation: brushStroke 2.0s cubic-bezier(0.4, 0, 0.15, 1) 0.3s forwards;
                }

                :global(.dark) .brush-fill {
                    stroke: hsl(60 10% 96%);
                }

                @keyframes brushStroke {
                    0% {
                        stroke-dashoffset: 220;
                    }
                    100% {
                        stroke-dashoffset: 0;
                    }
                }

                /* Ink splatter dot at the end of the stroke */
                .ink-splatter {
                    position: absolute;
                    right: -2px;
                    top: 50%;
                    transform: translateY(-50%) scale(0);
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: hsl(0 0% 0%);
                    animation: splatAppear 0.2s ease-out 2.2s forwards;
                }

                :global(.dark) .ink-splatter {
                    background: hsl(60 10% 96%);
                }

                @keyframes splatAppear {
                    0% {
                        transform: translateY(-50%) scale(0);
                    }
                    60% {
                        transform: translateY(-50%) scale(1.3);
                    }
                    100% {
                        transform: translateY(-50%) scale(1);
                    }
                }

                /* ── Exit: Subtle manga page fade ── */
                .loading-screen--exit {
                    animation: pageTurnFade 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                @keyframes pageTurnFade {
                    0% {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                    60% {
                        opacity: 0.4;
                    }
                    100% {
                        opacity: 0;
                        transform: translateX(3%) scale(0.99);
                        pointer-events: none;
                    }
                }
            `}</style>
        </div>
    );
}
