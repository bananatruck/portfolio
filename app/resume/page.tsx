"use client";

import { useState, useRef, useCallback } from "react";
import { Download, ZoomIn, ZoomOut, FileText, Maximize2, Minimize2 } from "lucide-react";

const PDF_URL = "/Keshav%20Jindal.pdf";

export default function Resume() {
    const [zoom, setZoom] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const zoomIn = useCallback(() => setZoom(z => Math.min(z + 25, 200)), []);
    const zoomOut = useCallback(() => setZoom(z => Math.max(z - 25, 50)), []);
    const resetZoom = useCallback(() => setZoom(100), []);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, []);

    return (
        <div ref={containerRef} className="resume-viewer min-h-screen pt-16 bg-background">
            {/* Toolbar */}
            <div className="resume-toolbar">
                <div className="resume-toolbar-inner">
                    {/* Left: Title */}
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-foreground" />
                        <span className="font-mono font-black text-sm uppercase tracking-widest text-foreground">
                            Resume
                        </span>
                        <span className="hidden sm:inline text-xs font-mono text-foreground/50">
                            — Keshav Jindal
                        </span>
                    </div>

                    {/* Center: Zoom Controls */}
                    <div className="flex items-center gap-1">
                        <button onClick={zoomOut} className="resume-btn cursor-target" title="Zoom Out">
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <button onClick={resetZoom} className="resume-btn resume-btn-wide cursor-target" title="Reset Zoom">
                            <span className="font-mono text-xs font-bold">{zoom}%</span>
                        </button>
                        <button onClick={zoomIn} className="resume-btn cursor-target" title="Zoom In">
                            <ZoomIn className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-foreground/20 mx-2 hidden sm:block" />
                        <button onClick={toggleFullscreen} className="resume-btn hidden sm:flex cursor-target" title="Fullscreen">
                            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Right: Download */}
                    <a href={PDF_URL} download className="resume-download-btn group cursor-target">
                        <Download className="w-4 h-4 group-hover:animate-bounce" />
                        <span className="hidden sm:inline font-mono text-xs font-bold uppercase">Download</span>
                    </a>
                </div>
            </div>

            {/* PDF Preview Area */}
            <div className="resume-preview-area">
                {/* Manga corner brackets */}
                <div className="resume-bracket resume-bracket-tl" />
                <div className="resume-bracket resume-bracket-tr" />
                <div className="resume-bracket resume-bracket-bl" />
                <div className="resume-bracket resume-bracket-br" />

                {/* Halftone texture behind */}
                <div className="resume-halftone" />

                {/* Paper stack effect — offset pages behind */}
                <div className="resume-paper-stack">
                    <div className="resume-paper resume-paper-3" />
                    <div className="resume-paper resume-paper-2" />

                    {/* Main PDF Frame */}
                    <div
                        className="resume-pdf-frame"
                        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                    >
                        <iframe
                            src={`${PDF_URL}#toolbar=0&navpanes=0&scrollbar=1`}
                            className="resume-iframe"
                            title="Resume Preview"
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .resume-toolbar {
                    position: sticky;
                    top: 64px;
                    z-index: 30;
                    background: hsl(var(--background));
                    border-bottom: 2px solid hsl(var(--foreground));
                }

                .resume-toolbar-inner {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 8px 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }

                .resume-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    border: 2px solid hsl(var(--foreground));
                    background: hsl(var(--background));
                    color: hsl(var(--foreground));
                    box-shadow: 2px 2px 0 0 hsl(var(--foreground));
                    transition: all 0.15s ease;
                    cursor: pointer;
                }

                .resume-btn:hover {
                    box-shadow: 3px 3px 0 0 hsl(var(--foreground));
                    transform: translateY(-1px);
                }

                .resume-btn:active {
                    box-shadow: 0 0 0 0 hsl(var(--foreground));
                    transform: translateY(2px);
                }

                .resume-btn-wide {
                    width: auto;
                    padding: 0 12px;
                    min-width: 56px;
                }

                .resume-download-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border: 2px solid hsl(var(--foreground));
                    background: hsl(var(--foreground));
                    color: hsl(var(--background));
                    box-shadow: 3px 3px 0 0 hsl(var(--foreground) / 0.3);
                    font-weight: 800;
                    letter-spacing: 0.05em;
                    transition: all 0.15s ease;
                    cursor: pointer;
                    text-decoration: none;
                }

                .resume-download-btn:hover {
                    box-shadow: 4px 4px 0 0 hsl(var(--foreground) / 0.4);
                    transform: translateY(-1px);
                }

                .resume-download-btn:active {
                    box-shadow: 0 0 0 0 hsl(var(--foreground));
                    transform: translateY(2px);
                }

                /* Preview Area */
                .resume-preview-area {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    padding: 24px 12px 48px;
                    min-height: calc(100vh - 120px);
                    overflow: auto;
                }

                .resume-halftone {
                    position: absolute;
                    inset: 0;
                    opacity: 0.03;
                    background-image: radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px);
                    background-size: 12px 12px;
                    pointer-events: none;
                }

                /* Manga corner brackets */
                .resume-bracket {
                    position: fixed;
                    width: 24px;
                    height: 24px;
                    border-color: hsl(var(--foreground));
                    border-style: solid;
                    opacity: 0.2;
                    z-index: 20;
                    pointer-events: none;
                }

                .resume-bracket-tl {
                    top: 80px;
                    left: 12px;
                    border-width: 3px 0 0 3px;
                }
                .resume-bracket-tr {
                    top: 80px;
                    right: 12px;
                    border-width: 3px 3px 0 0;
                }
                .resume-bracket-bl {
                    bottom: 12px;
                    left: 12px;
                    border-width: 0 0 3px 3px;
                }
                .resume-bracket-br {
                    bottom: 12px;
                    right: 12px;
                    border-width: 0 3px 3px 0;
                }

                /* Paper stack — stacked pages behind main */
                .resume-paper-stack {
                    position: relative;
                    width: 100%;
                    max-width: 1000px;
                }

                .resume-paper {
                    position: absolute;
                    inset: 0;
                    background: hsl(var(--background));
                    border: 1.5px solid hsl(var(--foreground) / 0.2);
                }

                .resume-paper-3 {
                    transform: rotate(1.2deg) translate(6px, 8px);
                    box-shadow: 1px 1px 4px hsl(var(--foreground) / 0.08);
                }

                .resume-paper-2 {
                    transform: rotate(-0.6deg) translate(3px, 4px);
                    box-shadow: 1px 1px 3px hsl(var(--foreground) / 0.06);
                }

                /* PDF Frame — main paper on top */
                .resume-pdf-frame {
                    position: relative;
                    width: 100%;
                    border: 2px solid hsl(var(--foreground));
                    box-shadow:
                        0 2px 8px hsl(var(--foreground) / 0.1),
                        0 8px 24px hsl(var(--foreground) / 0.06);
                    background: white;
                    transition: transform 0.3s ease;
                    aspect-ratio: 8.5 / 11;
                    z-index: 2;
                }

                .resume-iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                    display: block;
                }

                /* Fullscreen adjustments */
                :global(.resume-viewer:fullscreen) .resume-toolbar {
                    top: 0;
                }

                :global(.resume-viewer:fullscreen) .resume-bracket-tl {
                    top: 60px;
                }

                :global(.resume-viewer:fullscreen) .resume-bracket-tr {
                    top: 60px;
                }

                @media (max-width: 640px) {
                    .resume-paper {
                        display: none;
                    }

                    .resume-bracket {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}
