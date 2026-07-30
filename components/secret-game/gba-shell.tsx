"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    dpadDirections,
    FAST_FORWARD_KEY,
    KEY_BINDINGS,
    KEY_LABELS,
    LANDSCAPE,
    MUTE_KEY,
    PAD,
    PORTRAIT,
    place,
    type Layout,
    type PadButton,
} from "./controls";
import { getBasePath } from "./base-path";

/**
 * The console itself: the Glacier skin with live hit areas sitting exactly on
 * the painted buttons, and the emulator's picture inside the screen cutout.
 *
 * The skin is a Delta emulator skin ("Glacier" by epicpal, in Pokemon Assets/),
 * rendered to WebP at its own mapping resolution so the coordinates in
 * controls.ts land pixel-perfect on the art.
 */

const FACE_BUTTONS: PadButton[] = ["A", "B", "START", "SELECT", "L", "R"];
const ARMS: { direction: PadButton; className: string }[] = [
    { direction: "UP", className: "sg-arm-up" },
    { direction: "DOWN", className: "sg-arm-down" },
    { direction: "LEFT", className: "sg-arm-left" },
    { direction: "RIGHT", className: "sg-arm-right" },
];

type ShellProps = {
    frameRef: React.RefObject<HTMLIFrameElement>;
    frameSrc: string | null;
    /** True once the core is running; controls stay inert before that. */
    live: boolean;
    press: (index: number, pressed: boolean) => void;
    onFastForward: (on: boolean) => void;
    onToggleMute: () => void;
    onMenu: () => void;
    /** Drawn inside the screen cutout, over the emulator's picture. */
    screenOverlay?: React.ReactNode;
};

/**
 * Portrait skin on tall screens, landscape on wide ones — the same choice Delta
 * makes. Keycaps are a separate question: they're about whether there's a
 * keyboard to label, not about the shape of the window.
 *
 * Keycaps key off `pointer: coarse` being *absent* rather than `pointer: fine`
 * being present. Both identify a desktop, but they fail in opposite directions:
 * anything reporting `pointer: none` — which is what a browser says when it
 * can't characterise the input device — would lose its key labels under the
 * positive test, and losing them is the worse outcome. A touchscreen still
 * answers `coarse`, so phones and tablets stay clean either way.
 */
function useLayoutMode() {
    // Read on the first render rather than in the effect: this only ever mounts
    // inside the ssr:false overlay, so `window` is there, and waiting for the
    // effect would flash the landscape skin on a phone before correcting.
    const read = () => ({
        layout: window.matchMedia("(orientation: portrait)").matches ? PORTRAIT : LANDSCAPE,
        showKeycaps: !window.matchMedia("(pointer: coarse)").matches,
    });

    const [state, setState] = useState(read);

    useEffect(() => {
        const tall = window.matchMedia("(orientation: portrait)");
        const touch = window.matchMedia("(pointer: coarse)");

        const sync = () => setState(read());

        sync();
        tall.addEventListener("change", sync);
        touch.addEventListener("change", sync);
        return () => {
            tall.removeEventListener("change", sync);
            touch.removeEventListener("change", sync);
        };
        // `read` closes over nothing that changes between renders.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return state;
}

export function GbaShell({
    frameRef,
    frameSrc,
    live,
    press,
    onFastForward,
    onToggleMute,
    onMenu,
    screenOverlay,
}: ShellProps) {
    const { layout, showKeycaps } = useLayoutMode();
    const [active, setActive] = useState<ReadonlySet<PadButton>>(new Set());

    // Held buttons are tracked in a ref as well as state: the pointer and key
    // handlers need to read the current set synchronously to work out what
    // changed, and state alone would lag a frame behind.
    const held = useRef(new Set<PadButton>());

    const apply = useCallback(
        (next: Set<PadButton>) => {
            const previous = held.current;

            next.forEach((button) => {
                if (!previous.has(button)) press(PAD[button], true);
            });
            previous.forEach((button) => {
                if (!next.has(button)) press(PAD[button], false);
            });

            held.current = next;
            setActive(new Set(next));
        },
        [press],
    );

    const set = useCallback(
        (button: PadButton, pressed: boolean) => {
            const next = new Set(held.current);
            if (pressed) next.add(button);
            else next.delete(button);
            apply(next);
        },
        [apply],
    );

    // Releases everything at once. Used when the pointer leaves the console or
    // the tab loses focus, so a held direction can't stick on and walk the
    // player into a wall while they're away.
    const releaseAll = useCallback(() => {
        if (held.current.size > 0) apply(new Set());
    }, [apply]);

    useEffect(() => {
        if (!live) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.metaKey || event.ctrlKey || event.altKey) return;

            const key = event.key.toLowerCase();

            if (key === FAST_FORWARD_KEY) {
                event.preventDefault();
                if (!event.repeat) onFastForward(true);
                return;
            }
            if (key === MUTE_KEY) {
                event.preventDefault();
                if (!event.repeat) onToggleMute();
                return;
            }

            const button = KEY_BINDINGS[key];
            if (!button) return;
            // Arrow keys scroll, and space would too — the page underneath is
            // still there, just hidden behind the overlay.
            event.preventDefault();
            if (event.repeat) return;
            set(button, true);
        };

        const onKeyUp = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();

            if (key === FAST_FORWARD_KEY) {
                onFastForward(false);
                return;
            }

            const button = KEY_BINDINGS[key];
            if (button) set(button, false);
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        window.addEventListener("blur", releaseAll);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("blur", releaseAll);
            releaseAll();
        };
    }, [live, onFastForward, onToggleMute, releaseAll, set]);

    const basePath = useMemo(getBasePath, []);
    const { mapping } = layout;

    const buttonProps = (button: PadButton) => ({
        onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
            if (event.button !== 0) return;
            // Capture, so sliding a thumb off the button still releases it.
            event.currentTarget.setPointerCapture?.(event.pointerId);
            set(button, true);
        },
        onPointerUp: () => set(button, false),
        onPointerCancel: () => set(button, false),
        onContextMenu: (event: React.MouseEvent) => event.preventDefault(),
    });

    return (
        <div className="sg-stage">
            <div
                className="sg-console"
                style={{
                    ["--sg-aspect" as string]: `${mapping.width} / ${mapping.height}`,
                    backgroundImage: `url("${basePath}${layout.skin}")`,
                }}
                data-layout={mapping.width > mapping.height ? "landscape" : "portrait"}
                data-live={live}
            >
                <div className="sg-screen" style={place(layout.screen, mapping)}>
                    {frameSrc ? (
                        <iframe
                            // Re-keying on the ROM forces a fresh document, which is
                            // the cleanest way to shut down one emulator and start
                            // another.
                            key={frameSrc}
                            ref={frameRef}
                            src={frameSrc}
                            title="Game Boy Advance emulator"
                            allow="autoplay; fullscreen; gamepad"
                            // Inert and out of the tab order: every control lives out
                            // here, and focus must never land inside the frame or the
                            // emulator would handle keys a second time.
                            tabIndex={-1}
                            className="sg-screen-frame"
                        />
                    ) : null}
                    {screenOverlay}
                    <div className="sg-screen-glare" aria-hidden="true" />
                </div>

                <div
                    className="sg-dpad"
                    style={place(layout.dpad, mapping)}
                    role="group"
                    aria-label="D-pad"
                    onPointerDown={(event) => {
                        if (event.button !== 0) return;
                        event.currentTarget.setPointerCapture?.(event.pointerId);
                        const box = event.currentTarget.getBoundingClientRect();
                        apply(
                            new Set(
                                dpadDirections(
                                    event.clientX - box.left,
                                    event.clientY - box.top,
                                    box.width,
                                ),
                            ),
                        );
                    }}
                    onPointerMove={(event) => {
                        // Only while held — otherwise a hovering mouse would drive
                        // the character around on its own.
                        if (event.buttons !== 1) return;
                        const box = event.currentTarget.getBoundingClientRect();
                        const next = new Set(held.current);
                        ARMS.forEach(({ direction }) => next.delete(direction));
                        dpadDirections(
                            event.clientX - box.left,
                            event.clientY - box.top,
                            box.width,
                        ).forEach((direction) => next.add(direction));
                        apply(next);
                    }}
                    onPointerUp={releaseAll}
                    onPointerCancel={releaseAll}
                    onContextMenu={(event) => event.preventDefault()}
                >
                    {ARMS.map(({ direction, className }) => (
                        <span
                            key={direction}
                            className={`sg-arm ${className}`}
                            data-pressed={active.has(direction)}
                            aria-hidden="true"
                        >
                            {showKeycaps ? (
                                <span className="sg-keycap">{KEY_LABELS[direction]}</span>
                            ) : null}
                        </span>
                    ))}
                </div>

                {FACE_BUTTONS.map((button) => {
                    const frame = layout.buttons[button];
                    if (!frame) return null;

                    return (
                        <button
                            key={button}
                            type="button"
                            className="sg-pad-btn"
                            data-button={button}
                            data-pressed={active.has(button)}
                            style={place(frame, mapping)}
                            aria-label={button}
                            {...buttonProps(button)}
                        >
                            {showKeycaps ? (
                                <span className="sg-keycap">{KEY_LABELS[button]}</span>
                            ) : null}
                        </button>
                    );
                })}

                {/* The skin paints a third pill between START and SELECT. On a
                    Delta skin that's the emulator menu, so it opens ours. */}
                <button
                    type="button"
                    className="sg-pad-btn sg-pad-menu"
                    style={place(layout.menu, mapping)}
                    onClick={onMenu}
                    aria-label="Emulator menu"
                />
            </div>
        </div>
    );
}
