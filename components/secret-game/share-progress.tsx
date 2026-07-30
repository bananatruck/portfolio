"use client";

import { useEffect, useRef, useState } from "react";
import { formatPlaytime } from "./playtime";

/**
 * "Show Kesh where you got to": grabs the screen and hands it off.
 *
 * How far the handoff goes depends on the platform, and there's no way around
 * that. Phones get the real thing — the Web Share sheet takes the PNG itself, so
 * LinkedIn or Gmail opens with the image already attached. Desktop browsers have
 * no equivalent: mailto: cannot carry an attachment and LinkedIn has no compose
 * URL that accepts one. So there the shot is copied to the clipboard and saved
 * to disk first, and the message window opens second — paste or attach, one
 * step, no typing.
 */

const LINKEDIN_URL = "https://www.linkedin.com/in/keshavjindal04/";
const EMAIL = "keshav.jmgl@gmail.com";

type ShareTarget = "linkedin" | "email";

function dataUrlToBlob(dataUrl: string): Blob {
    const [header, encoded] = dataUrl.split(",");
    const mime = /:(.*?);/.exec(header)?.[1] ?? "image/png";
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
}

function download(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

async function copyImage(blob: Blob): Promise<boolean> {
    try {
        // Firefox has no image support in the async clipboard API, and any
        // browser will reject this without clipboard permission.
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        return true;
    } catch {
        return false;
    }
}

export function ShareProgress({
    shot,
    gameLabel,
    playtimeMs,
    onClose,
}: {
    /** Screenshot as a PNG data URL, already taken by the time this opens. */
    shot: string | null;
    gameLabel: string;
    playtimeMs: number;
    onClose: () => void;
}) {
    const [note, setNote] = useState<string | null>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        closeRef.current?.focus();
    }, []);

    const filename = `${gameLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-progress.png`;
    const summary = `${gameLabel} — ${formatPlaytime(playtimeMs)} on the clock`;

    const canShareFiles = () => {
        if (!shot || typeof navigator.canShare !== "function") return false;
        const file = new File([dataUrlToBlob(shot)], filename, { type: "image/png" });
        return navigator.canShare({ files: [file] });
    };

    const shareSheet = async () => {
        if (!shot) return;
        const file = new File([dataUrlToBlob(shot)], filename, { type: "image/png" });
        try {
            await navigator.share({ files: [file], text: summary });
        } catch {
            // Includes the user simply dismissing the sheet, which isn't an error
            // worth saying anything about.
        }
    };

    const handoff = async (target: ShareTarget) => {
        if (!shot) return;
        const blob = dataUrlToBlob(shot);

        const copied = await copyImage(blob);
        if (!copied) download(blob, filename);

        setNote(
            copied
                ? "Screenshot copied — paste it into the message."
                : "Screenshot saved — attach it to the message.",
        );

        const url =
            target === "linkedin"
                ? LINKEDIN_URL
                : `mailto:${EMAIL}?subject=${encodeURIComponent(
                      "My progress in your emulator",
                  )}&body=${encodeURIComponent(`${summary}\n\n(screenshot attached)`)}`;

        // Opened after the copy resolves, so the clipboard write still counts as
        // happening inside the click that started it.
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="sg-panel sg-share" role="dialog" aria-label="Send your progress">
            <div className="sg-panel-head">
                <p className="sg-panel-title">Send progress</p>
                <button
                    type="button"
                    ref={closeRef}
                    className="sg-panel-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    X
                </button>
            </div>

            {shot ? (
                <img className="sg-share-shot" src={shot} alt="Your current screen" />
            ) : (
                <p className="sg-panel-note">Couldn&apos;t grab the screen. Try again in a moment.</p>
            )}

            <p className="sg-share-summary">{summary}</p>

            {shot ? (
                <div className="sg-panel-actions">
                    {canShareFiles() ? (
                        <button type="button" className="sg-panel-action" onClick={shareSheet}>
                            Share screenshot
                        </button>
                    ) : null}
                    <button
                        type="button"
                        className="sg-panel-action"
                        onClick={() => void handoff("linkedin")}
                    >
                        LinkedIn DM
                    </button>
                    <button
                        type="button"
                        className="sg-panel-action"
                        onClick={() => void handoff("email")}
                    >
                        Email it
                    </button>
                    <button
                        type="button"
                        className="sg-panel-action"
                        onClick={() => download(dataUrlToBlob(shot), filename)}
                    >
                        Just save it
                    </button>
                </div>
            ) : null}

            {note ? <p className="sg-panel-note">{note}</p> : null}
        </div>
    );
}
