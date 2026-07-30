"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Talks to the emulator running in the iframe.
 *
 * The emulator is same-origin, so this could reach into its document directly —
 * but going through postMessage keeps every EmulatorJS-specific detail on the
 * far side of one narrow command list, which is the only place that has to
 * change if the emulator is ever swapped out.
 */

export type EmulatorStatus = "loading" | "running" | "error";

/** A screenshot that hasn't come back within this long is treated as failed. */
const SCREENSHOT_TIMEOUT_MS = 8000;

export function useEmulatorBridge() {
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [status, setStatus] = useState<EmulatorStatus>("loading");
    const [error, setError] = useState<string | null>(null);

    // Screenshot requests are matched to their replies by id, so two taps in
    // quick succession can't resolve each other's promise.
    const pendingShots = useRef(new Map<number, (result: string | null) => void>());
    const shotId = useRef(0);

    const send = useCallback((command: string, data: Record<string, unknown> = {}) => {
        frameRef.current?.contentWindow?.postMessage(
            { command, ...data },
            window.location.origin,
        );
    }, []);

    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.source !== frameRef.current?.contentWindow) return;

            const data = event.data;
            if (!data || typeof data.type !== "string") return;

            if (data.type === "sg:started") {
                setStatus("running");
            } else if (data.type === "sg:error") {
                setStatus("error");
                setError(typeof data.message === "string" ? data.message : "Something went wrong.");
            } else if (data.type === "sg:screenshot") {
                const resolve = pendingShots.current.get(data.requestId);
                if (!resolve) return;
                pendingShots.current.delete(data.requestId);
                resolve(typeof data.dataUrl === "string" ? data.dataUrl : null);
            }
        };

        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, []);

    const screenshot = useCallback(
        () =>
            new Promise<string | null>((resolve) => {
                const requestId = ++shotId.current;

                const timer = window.setTimeout(() => {
                    pendingShots.current.delete(requestId);
                    resolve(null);
                }, SCREENSHOT_TIMEOUT_MS);

                pendingShots.current.set(requestId, (result) => {
                    window.clearTimeout(timer);
                    resolve(result);
                });

                send("screenshot", { requestId });
            }),
        [send],
    );

    const commands = useMemo(
        () => ({
            press: (index: number, pressed: boolean) => send("input", { index, pressed }),
            fastForward: (on: boolean, ratio = 3) => send("fastForward", { on, ratio }),
            volume: (volume: number) => send("volume", { volume }),
            pause: (on: boolean) => send("pause", { on }),
            reset: () => send("reset"),
            saveState: () => send("saveState"),
            loadState: () => send("loadState"),
            screenshot,
        }),
        [screenshot, send],
    );

    // Memoised as one object: callers put this in effect dependency arrays, and a
    // fresh identity every render would re-send volume and fast-forward on every
    // single re-render of the overlay.
    return useMemo(
        () => ({ frameRef, status, error, ...commands }),
        [commands, error, status],
    );
}
