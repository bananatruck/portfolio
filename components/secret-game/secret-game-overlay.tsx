"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getBasePath } from "./base-path";
import { BootAnimation, pickBootKind } from "./boot-animations";
import { formatBytes, loadCartridge, type DownloadProgress } from "./cartridge-cache";
import { DEFAULT_SKIN, loadSkin, saveSkin, SKIN_ORDER, SKINS, type SkinId } from "./controls";
import { useEmulatorBridge } from "./emulator-bridge";
import { GbaShell } from "./gba-shell";
import { Leaderboard } from "./leaderboard";
import { PixelBackArrow, PixelCartridge, PixelSadFace } from "./pixel-icons";
import { usePlaytime } from "./playtime";
import { ShareProgress } from "./share-progress";
import "./secret-game.css";

/** The boot animation always gets to play through, even on a fast core. */
const BOOT_MIN_MS = 3400;
/** ...but a core that never reports in shouldn't trap anyone behind it. */
const BOOT_MAX_MS = 14000;
/** Matches the boot screen's fade-out in CSS. */
const BOOT_EXIT_MS = 420;

const DEFAULT_VOLUME = 0.5;

type Rom = { file: string; label: string; bytes?: number };
type Cartridge = { url: string; label: string; isObjectUrl: boolean };
type Panel = "cartridges" | "leaderboard" | "share" | null;

export default function SecretGameOverlay({ onClose }: { onClose: () => void }) {
    const [booting, setBooting] = useState(true);
    const [bootLeaving, setBootLeaving] = useState(false);
    const [panel, setPanel] = useState<Panel>(null);
    const [roms, setRoms] = useState<Rom[]>([]);
    const [cartridge, setCartridge] = useState<Cartridge | null>(null);
    // Distinguishes "no ROMs bundled" from "haven't looked yet", so the empty
    // state can't flash while the manifest is still in flight.
    const [manifestLoaded, setManifestLoaded] = useState(false);

    const [muted, setMuted] = useState(false);
    const [fastForward, setFastForward] = useState(false);
    // Starts on the default so the server and first client render agree, then
    // picks up a stored choice on mount.
    const [skin, setSkin] = useState<SkinId>(DEFAULT_SKIN);
    const [shot, setShot] = useState<string | null>(null);
    const [flash, setFlash] = useState<string | null>(null);
    // Null until a cartridge is actually being fetched, so the boot screen knows
    // whether to show a download bar or its own indeterminate one.
    const [download, setDownload] = useState<DownloadProgress | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const backRef = useRef<HTMLButtonElement>(null);
    // Tracks the object URL currently handed to the iframe so it can be revoked
    // when it's replaced or the overlay closes.
    const objectUrlRef = useRef<string | null>(null);
    // When the current boot started. Reset on every cartridge swap so the
    // animation gets its full run each time, not just the first.
    const openedAt = useRef(Date.now());

    const basePath = useMemo(getBasePath, []);
    // Chosen once, on mount: FireRed the first time anyone opens this, random
    // after that. Re-rolling on a re-render would restart the animation.
    const bootKind = useMemo(pickBootKind, []);

    const emulator = useEmulatorBridge();
    const { frameRef, status } = emulator;
    const live = !booting && status === "running";
    const playtimeMs = usePlaytime(live);

    useEffect(() => setSkin(loadSkin()), []);

    const chooseSkin = useCallback((next: SkinId) => {
        setSkin(next);
        saveSkin(next);
    }, []);

    const insertCartridge = useCallback((next: Cartridge) => {
        // Revoking outside the state updater keeps the updater pure — React
        // invokes it twice under StrictMode.
        const previous = objectUrlRef.current;
        if (previous && previous !== next.url) URL.revokeObjectURL(previous);
        objectUrlRef.current = next.isObjectUrl ? next.url : null;

        setCartridge(next);
        setPanel(null);
    }, []);

    /**
     * Picking a cartridge is what starts the download — nothing is fetched
     * before this. The boot screen comes back while it streams in, so the wait
     * is the game booting rather than a spinner on a menu.
     */
    const selectRom = useCallback(
        async (rom: Rom) => {
            const url = `${basePath}/secret-game/roms/${rom.file}`;

            setPanel(null);
            setLoadError(null);
            setBooting(true);
            setBootLeaving(false);
            openedAt.current = Date.now();
            emulator.setStatus("loading");
            setDownload({ ratio: null, receivedBytes: 0, totalBytes: rom.bytes ?? null, cached: false });

            try {
                const objectUrl = await loadCartridge(url, setDownload);
                insertCartridge({ url: objectUrl, label: rom.label, isObjectUrl: true });
            } catch (error) {
                setLoadError(
                    error instanceof Error ? error.message : "That cartridge wouldn't load.",
                );
                setBooting(false);
            } finally {
                setDownload(null);
            }
        },
        [basePath, emulator, insertCartridge],
    );

    // Only the manifest is fetched up front — it's a couple of hundred bytes.
    // No cartridge is chosen here: the games are ~17MB each, and downloading one
    // because somebody opened the easter egg would be a poor trade. Picking one
    // is what starts the download.
    useEffect(() => {
        let cancelled = false;

        fetch(`${basePath}/secret-game/roms/manifest.json`, { cache: "no-cache" })
            .then((response) => (response.ok ? response.json() : { roms: [] }))
            .then((data: { roms?: Rom[] }) => {
                if (cancelled) return;
                setRoms(Array.isArray(data.roms) ? data.roms : []);
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

    // The boot screen clears once the core has reported in and the animation has
    // had its full run — whichever is later. The cap covers a core that never
    // starts at all, so the shell stays reachable.
    //
    // Nothing runs until a cartridge is in, because until then the screen is the
    // cartridge picker rather than a boot sequence.
    useEffect(() => {
        if (!cartridge) return;

        let exitTimer: number;

        const leave = () => {
            setBootLeaving(true);
            exitTimer = window.setTimeout(() => setBooting(false), BOOT_EXIT_MS);
        };

        // Measured from when this boot started, not from when the effect last
        // ran — otherwise a core that reports in early would restart the clock
        // and hold the animation for another full BOOT_MIN_MS.
        const elapsed = Date.now() - openedAt.current;
        const minTimer = window.setTimeout(
            () => {
                if (status === "running") leave();
            },
            Math.max(0, BOOT_MIN_MS - elapsed),
        );
        const capTimer = window.setTimeout(leave, Math.max(0, BOOT_MAX_MS - elapsed));

        return () => {
            window.clearTimeout(minTimer);
            window.clearTimeout(capTimer);
            window.clearTimeout(exitTimer);
        };
    }, [cartridge, status]);

    // Move focus onto the back button once the boot sequence clears, so keyboard
    // and screen-reader users land somewhere useful rather than back at the top
    // of the underlying page.
    useEffect(() => {
        if (!booting) backRef.current?.focus();
    }, [booting]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            if (panel) {
                setPanel(null);
                return;
            }
            onClose();
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose, panel]);

    // Escape typed while focus is inside the iframe never reaches this document,
    // so the emulator page forwards it back up.
    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.source !== frameRef.current?.contentWindow) return;
            if (event.data?.type === "sg:close") onClose();
        };

        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, [frameRef, onClose]);

    // Release the picked file's object URL on unmount. Removing the iframe is
    // what actually tears the emulator down.
    useEffect(
        () => () => {
            if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        },
        [],
    );

    // The core comes up at its own default volume, so push ours once it's live
    // and whenever it's toggled after that.
    useEffect(() => {
        if (!live) return;
        emulator.volume(muted ? 0 : DEFAULT_VOLUME);
    }, [emulator, live, muted]);

    useEffect(() => {
        if (!live) return;
        emulator.fastForward(fastForward);
    }, [emulator, fastForward, live]);

    // A short confirmation over the screen, the way the games acknowledge a save.
    const say = useCallback((message: string) => {
        setFlash(message);
        window.setTimeout(() => setFlash((current) => (current === message ? null : current)), 1600);
    }, []);

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

    const openShare = async () => {
        setShot(null);
        setPanel("share");
        setShot(await emulator.screenshot());
    };

    // Explicit /index.html rather than the directory form. `next dev` serves
    // files out of public/ without resolving a directory index, so the bare
    // folder 308s to a 404 and the emulator never loads locally. Static hosts
    // serve the filename directly, and the one or two that prettify it into the
    // directory form carry the fragment across the redirect — so the blob: URL
    // in the hash survives either way.
    const frameSrc = cartridge
        ? `${basePath}/secret-game/index.html#rom=${encodeURIComponent(
              cartridge.url,
          )}&name=${encodeURIComponent(cartridge.label)}`
        : null;

    const gameLabel = cartridge?.label ?? "No cartridge";

    // Defined once and rendered twice: floating over the console on desktop, and
    // inside the menu in portrait, where there's no room to float anything.
    const functionButtons = (
        <>
            <button
                type="button"
                className="sg-fn"
                data-on={fastForward}
                disabled={!live}
                onClick={() => setFastForward((on) => !on)}
            >
                FF<span className="sg-fn-key">SPACE</span>
            </button>
            <button
                type="button"
                className="sg-fn"
                data-on={muted}
                disabled={!live}
                onClick={() => setMuted((on) => !on)}
            >
                {muted ? "UNMUTE" : "MUTE"}
                <span className="sg-fn-key">M</span>
            </button>
            <button
                type="button"
                className="sg-fn"
                disabled={!live}
                onClick={() => {
                    emulator.saveState();
                    say("Progress saved.");
                }}
            >
                SAVE
            </button>
            <button
                type="button"
                className="sg-fn"
                disabled={!live}
                onClick={() => {
                    emulator.loadState();
                    say("State loaded.");
                }}
            >
                LOAD
            </button>
            <button
                type="button"
                className="sg-fn"
                disabled={!live}
                onClick={() => {
                    emulator.reset();
                    say("Rebooting...");
                }}
            >
                RESET
            </button>
            <button type="button" className="sg-fn" disabled={!live} onClick={() => void openShare()}>
                SEND KESH
            </button>
            <button
                type="button"
                className="sg-fn"
                onClick={() => setPanel((open) => (open === "leaderboard" ? null : "leaderboard"))}
            >
                RANKS
            </button>
        </>
    );

    return createPortal(
        <div className="sg-overlay" role="dialog" aria-modal="true" aria-label="Secret game">
            <GbaShell
                frameRef={frameRef}
                frameSrc={frameSrc}
                live={live}
                press={emulator.press}
                onFastForward={setFastForward}
                onToggleMute={() => setMuted((on) => !on)}
                skin={skin}
                onMenu={() => setPanel((open) => (open === "cartridges" ? null : "cartridges"))}
                screenOverlay={
                    <>
                        {/* `download` as well as `cartridge`: the cartridge isn't
                            set until its bytes are in, and the wait between
                            picking and that happening is exactly when the boot
                            screen needs to be up. */}
                        {booting && (cartridge || download) ? (
                            <BootAnimation
                                kind={bootKind}
                                leaving={bootLeaving}
                                download={download}
                            />
                        ) : null}

                        {/* Cartridge select lives on the console's own screen, so
                            the thing you're choosing for is already in front of
                            you while you choose. */}
                        {!cartridge && !download && manifestLoaded ? (
                            <div className="sg-select">
                                <p className="sg-select-title">Select a cartridge</p>

                                <div className="sg-select-list">
                                    {roms.map((rom) => (
                                        <button
                                            key={rom.file}
                                            type="button"
                                            className="sg-select-item"
                                            onClick={() => void selectRom(rom)}
                                        >
                                            <span className="sg-select-name">{rom.label}</span>
                                            {rom.bytes ? (
                                                <span className="sg-select-size">
                                                    {formatBytes(rom.bytes)}
                                                </span>
                                            ) : null}
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        className="sg-select-item"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <span className="sg-select-name">Load your own file...</span>
                                    </button>
                                </div>

                                <p className="sg-select-note">
                                    {roms.length > 0
                                        ? "Downloaded when you pick one, then kept for next time."
                                        : "No cartridges bundled — bring your own .gba."}
                                </p>

                                {loadError ? (
                                    <p className="sg-select-error" role="alert">
                                        {loadError}
                                    </p>
                                ) : null}
                            </div>
                        ) : null}

                        {flash ? <p className="sg-flash">{flash}</p> : null}
                    </>
                }
            />

            {status === "error" && emulator.error ? (
                <p className="sg-error" role="alert">
                    {emulator.error}
                </p>
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
                    onClick={() => setPanel((open) => (open === "cartridges" ? null : "cartridges"))}
                    aria-label="Change cartridge"
                    aria-expanded={panel === "cartridges"}
                >
                    <PixelCartridge size={24} />
                </button>
            </div>

            <div className="sg-functions" role="group" aria-label="Emulator functions">
                {functionButtons}
            </div>

            <a
                className="sg-more"
                // No trailing slash: a static export writes this as
                // blog/pokemon-rom-hacks.html, and the slashed form would send
                // GitHub Pages looking for a directory index that isn't there.
                href={`${basePath}/blog/pokemon-rom-hacks`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <span className="sg-more-top">Like this?</span>
                <span className="sg-more-bottom">THERES MORE!</span>
            </a>

            {panel === "cartridges" ? (
                <div className="sg-menu">
                    <div className="sg-menu-functions" role="group" aria-label="Emulator functions">
                        {functionButtons}
                    </div>

                    <p className="sg-menu-title">Console</p>
                    <div className="sg-skins">
                        {SKIN_ORDER.map((id) => (
                            <button
                                key={id}
                                type="button"
                                className="sg-skin"
                                data-active={skin === id}
                                aria-pressed={skin === id}
                                onClick={() => chooseSkin(id)}
                            >
                                <span
                                    className="sg-skin-art"
                                    style={{
                                        backgroundImage: `url("${basePath}${SKINS[id].portrait.skin}")`,
                                    }}
                                />
                                <span className="sg-skin-name">{SKINS[id].label}</span>
                                <span className="sg-skin-blurb">{SKINS[id].blurb}</span>
                            </button>
                        ))}
                    </div>

                    <div className="sg-menu-sep" />

                    <p className="sg-menu-title">Select cartridge</p>

                    {roms.map((rom) => (
                        <button
                            key={rom.file}
                            type="button"
                            className="sg-menu-item"
                            aria-current={cartridge?.label === rom.label}
                            onClick={() => void selectRom(rom)}
                        >
                            {rom.label}
                            {rom.bytes ? (
                                <span className="sg-menu-size">{formatBytes(rom.bytes)}</span>
                            ) : null}
                        </button>
                    ))}

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

            {panel === "leaderboard" ? (
                <Leaderboard
                    playtimeMs={playtimeMs}
                    gameLabel={gameLabel}
                    onClose={() => setPanel(null)}
                />
            ) : null}

            {panel === "share" ? (
                <ShareProgress
                    shot={shot}
                    gameLabel={gameLabel}
                    playtimeMs={playtimeMs}
                    onClose={() => setPanel(null)}
                />
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
