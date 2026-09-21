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
const STATE_TIMEOUT_MS = 8000;

function isMessageRecord(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === "object";
}

export function useEmulatorBridge() {
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [status, setStatus] = useState<EmulatorStatus>("loading");
    const [error, setError] = useState<string | null>(null);

    // Screenshot requests are matched to their replies by id, so two taps in
    // quick succession can't resolve each other's promise.
    const pendingShots = useRef(new Map<number, (result: string | null) => void>());
    const pendingCaptures = useRef(
        new Map<number, { resolve: (state: ArrayBuffer) => void; reject: (error: Error) => void }>(),
    );
    const pendingRestores = useRef(
        new Map<number, { resolve: () => void; reject: (error: Error) => void }>(),
    );
    const shotId = useRef(0);
    const stateId = useRef(0);

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

            const data: unknown = event.data;
            if (!isMessageRecord(data) || typeof data.type !== "string") return;

            if (data.type === "sg:started") {
                setStatus("running");
            } else if (data.type === "sg:error") {
                setStatus("error");
                setError(typeof data.message === "string" ? data.message : "Something went wrong.");
            } else if (data.type === "sg:screenshot") {
                if (typeof data.requestId !== "number") return;
                const resolve = pendingShots.current.get(data.requestId);
                if (!resolve) return;
                pendingShots.current.delete(data.requestId);
                resolve(typeof data.dataUrl === "string" ? data.dataUrl : null);
            } else if (data.type === "sg:state-captured") {
                if (typeof data.requestId !== "number") return;
                const pending = pendingCaptures.current.get(data.requestId);
                if (!pending) return;
                pendingCaptures.current.delete(data.requestId);
                if (data.state instanceof ArrayBuffer) pending.resolve(data.state);
                else pending.reject(new Error("The emulator returned an invalid save state."));
            } else if (data.type === "sg:state-restored") {
                if (typeof data.requestId !== "number") return;
                const pending = pendingRestores.current.get(data.requestId);
                if (!pending) return;
                pendingRestores.current.delete(data.requestId);
                pending.resolve();
            } else if (data.type === "sg:state-error") {
                if (typeof data.requestId !== "number") return;
                const error = new Error(
                    typeof data.message === "string" ? data.message : "The save state failed.",
                );
                const capture = pendingCaptures.current.get(data.requestId);
                const restore = pendingRestores.current.get(data.requestId);
                pendingCaptures.current.delete(data.requestId);
                pendingRestores.current.delete(data.requestId);
                capture?.reject(error);
                restore?.reject(error);
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

    const captureState = useCallback(
        () =>
            new Promise<ArrayBuffer>((resolve, reject) => {
                const requestId = ++stateId.current;

                const timer = window.setTimeout(() => {
                    pendingCaptures.current.delete(requestId);
                    reject(new Error("The emulator took too long to capture that save."));
                }, STATE_TIMEOUT_MS);

                pendingCaptures.current.set(requestId, {
                    resolve: (state) => {
                        window.clearTimeout(timer);
                        resolve(state);
                    },
                    reject: (error) => {
                        window.clearTimeout(timer);
                        reject(error);
                    },
                });

                send("captureState", { requestId });
            }),
        [send],
    );

    const restoreState = useCallback(
        (state: ArrayBuffer) =>
            new Promise<void>((resolve, reject) => {
                const requestId = ++stateId.current;

                const timer = window.setTimeout(() => {
                    pendingRestores.current.delete(requestId);
                    reject(new Error("The emulator took too long to load that save."));
                }, STATE_TIMEOUT_MS);

                pendingRestores.current.set(requestId, {
                    resolve: () => {
                        window.clearTimeout(timer);
                        resolve();
                    },
                    reject: (error) => {
                        window.clearTimeout(timer);
                        reject(error);
                    },
                });

                send("restoreState", { requestId, state });
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
            captureState,
            restoreState,
            screenshot,
        }),
        [captureState, restoreState, screenshot, send],
    );

    // Memoised as one object: callers put this in effect dependency arrays, and a
    // fresh identity every render would re-send volume and fast-forward on every
    // single re-render of the overlay.
    // Swapping cartridges puts the emulator back into loading, so the shell can
    // reset the status it's showing without waiting for the new frame to report.
    const reset = useCallback((next: EmulatorStatus) => {
        setStatus(next);
        setError(null);
    }, []);

    return useMemo(
        () => ({ frameRef, status, error, setStatus: reset, ...commands }),
        [commands, error, reset, status],
    );
}
