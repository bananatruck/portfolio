"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getBasePath } from "./base-path";
import { PixelBackArrow, PixelCartridge, PixelPokeball, PixelSadFace } from "./pixel-icons";
import "./secret-game.css";

/** How long the boot sequence runs before the emulator is revealed. */
const BOOT_DURATION_MS = 2600;

type Rom = { file: string; label: string };
type Cartridge = { url: string; label: string; isObjectUrl: boolean };

export default function SecretGameOverlay({ onClose }: { onClose: () => void }) {
    const [booting, setBooting] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [roms, setRoms] = useState<Rom[]>([]);
    const [cartridge, setCartridge] = useState<Cartridge | null>(null);
    // Distinguishes "no ROMs bundled" from "haven't looked yet", so the empty
    // state can't flash while the manifest is still in flight.
    const [manifestLoaded, setManifestLoaded] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const frameRef = useRef<HTMLIFrameElement>(null);
    const backRef = useRef<HTMLButtonElement>(null);
    // Tracks the object URL currently handed to the iframe so it can be revoked
    // when it's replaced or the overlay closes.
    const objectUrlRef = useRef<string | null>(null);

    const basePath = useMemo(getBasePath, []);

    const insertCartridge = useCallback((next: Cartridge) => {
        // Revoking outside the state updater keeps the updater pure — React
        // invokes it twice under StrictMode.
        const previous = objectUrlRef.current;
        if (previous && previous !== next.url) URL.revokeObjectURL(previous);
        objectUrlRef.current = next.isObjectUrl ? next.url : null;

        setCartridge(next);
        setMenuOpen(false);
    }, []);

    // Load whichever ROMs were bundled at build time. In a public deploy the
    // roms folder is empty, so this comes back empty and the visitor is asked
    // for their own file instead.
    useEffect(() => {
        let cancelled = false;

        fetch(`${basePath}/secret-game/roms/manifest.json`, { cache: "no-cache" })
            .then((response) => (response.ok ? response.json() : { roms: [] }))
            .then((data: { roms?: Rom[] }) => {
                if (cancelled) return;
                const available = Array.isArray(data.roms) ? data.roms : [];
                setRoms(available);
                // First entry in the manifest is the default cartridge.
                if (available[0]) {
                    setCartridge({
                        url: `${basePath}/secret-game/roms/${available[0].file}`,
                        label: available[0].label,
                        isObjectUrl: false,
                    });
                }
            })
            .catch(() => {
                if (!cancelled) setRoms([]);
            })
            .finally(() => {
                if (!cancelled) setManifestLoaded(true);
            });

        return () => {
            cancelled = true;
        };
    }, [basePath]);

    // Take over the page: lock scrolling, silence the music player, and undo the
    // site's global cursor hiding (handled by the .sg-open class in CSS).
    useEffect(() => {
        const restoreFocusTo = document.activeElement as HTMLElement | null;
        document.body.classList.add("sg-open");

        const paused = Array.from(
            document.querySelectorAll<HTMLMediaElement>("audio, video"),
        ).filter((media) => !media.paused);
        paused.forEach((media) => media.pause());

        return () => {
            document.body.classList.remove("sg-open");
            // Resuming can reject if the tab lost autoplay permission meanwhile;
            // there's nothing useful to do about it either way.
            paused.forEach((media) => void media.play().catch(() => {}));
            restoreFocusTo?.focus?.();
        };
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => setBooting(false), BOOT_DURATION_MS);
        return () => window.clearTimeout(timer);
    }, []);

    // Move focus onto the back button once the boot sequence clears, so keyboard
    // and screen-reader users land somewhere useful rather than back at the top
    // of the underlying page.
    useEffect(() => {
        if (!booting) backRef.current?.focus();
    }, [booting]);

    useEffect(() => {
        // Escape typed while focus is inside the iframe never reaches this
        // document, so the emulator page forwards it back up.
        const onMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.source !== frameRef.current?.contentWindow) return;
            if (event.data?.type === "secret-game:close") onClose();
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            if (menuOpen) {
                setMenuOpen(false);
                return;
            }
            onClose();
        };

        window.addEventListener("message", onMessage);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("message", onMessage);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [menuOpen, onClose]);

    // Release the picked file's object URL on unmount. Removing the iframe is
    // what actually tears the emulator down.
    useEffect(
        () => () => {
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        },
        [],
    );

    const onFileChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        insertCartridge({
            url: URL.createObjectURL(file),
            label: file.name.replace(/\.[^.]+$/, ""),
            isObjectUrl: true,
        });
    };

    // Directory form rather than /index.html: some static hosts 301 the explicit
    // filename, and a redirect is a poor thing to put in front of a blob: URL
    // that only exists in this tab.
    const frameSrc = cartridge
        ? `${basePath}/secret-game/#rom=${encodeURIComponent(
              cartridge.url,
          )}&name=${encodeURIComponent(cartridge.label)}`
        : null;

    return createPortal(
        <div className="sg-overlay" role="dialog" aria-modal="true" aria-label="Secret game">
            {frameSrc ? (
                <iframe
                    // Re-keying on the ROM forces a fresh document, which is the
                    // cleanest way to shut down one emulator and start another.
                    key={frameSrc}
                    ref={frameRef}
                    src={frameSrc}
                    title="Game Boy Advance emulator"
                    allow="autoplay; fullscreen; gamepad"
                    className={`sg-frame${booting ? "" : " sg-visible"}`}
                />
            ) : null}

            {!frameSrc && !booting && manifestLoaded ? (
                <div className="sg-boot">
                    <PixelCartridge size={72} />
                    <p className="sg-menu-title" style={{ margin: 0 }}>
                        No cartridge inserted
                    </p>
                    <button
                        type="button"
                        className="sg-menu-item"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Insert your own .gba
                    </button>
                </div>
            ) : null}

            {booting ? (
                <div className="sg-boot">
                    <PixelPokeball size={96} className="sg-boot-ball" />
                    <p className="sg-boot-title">GARCHOMP OS 8</p>
                    <div className="sg-boot-bar">
                        <div className="sg-boot-bar-fill" />
                    </div>
                    <p className="sg-boot-hint">Now loading</p>
                </div>
            ) : null}

            <div className="sg-scanlines" />

            <div className="sg-chrome">
                <button
                    type="button"
                    ref={backRef}
                    className="sg-btn sg-btn-back"
                    onClick={onClose}
                    aria-label="Leave the game and go back"
                >
                    <PixelBackArrow size={24} className="sg-icon-rest" />
                    <PixelSadFace size={24} className="sg-icon-hover" />
                </button>
                <span className="sg-tip" aria-hidden="true">
                    Aww, leaving?
                </span>

                <button
                    type="button"
                    className="sg-btn"
                    onClick={() => setMenuOpen((open) => !open)}
                    aria-label="Change cartridge"
                    aria-expanded={menuOpen}
                >
                    <PixelCartridge size={24} />
                </button>
            </div>

            {menuOpen ? (
                <div className="sg-menu">
                    <p className="sg-menu-title">Select cartridge</p>

                    {roms.map((rom) => {
                        const url = `${basePath}/secret-game/roms/${rom.file}`;
                        return (
                            <button
                                key={rom.file}
                                type="button"
                                className="sg-menu-item"
                                aria-current={cartridge?.url === url}
                                onClick={() =>
                                    insertCartridge({ url, label: rom.label, isObjectUrl: false })
                                }
                            >
                                {rom.label}
                            </button>
                        );
                    })}

                    {roms.length > 0 ? <div className="sg-menu-sep" /> : null}

                    <button
                        type="button"
                        className="sg-menu-item"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Load file...
                    </button>

                    <p className="sg-menu-note">
                        Your file is read in the browser and never uploaded.
                    </p>
                </div>
            ) : null}

            <input
                ref={fileInputRef}
                type="file"
                accept=".gba,.zip,.7z,application/octet-stream"
                onChange={onFileChosen}
                hidden
            />
        </div>,
        document.body,
    );
}
