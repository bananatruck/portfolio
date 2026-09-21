"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatPlaytime } from "./playtime";
import {
    deleteSaveState,
    listSaveStates,
    readSaveState,
    SAVE_SLOTS,
    type SaveSlot,
    type StoredSaveState,
    writeSaveState,
} from "./save-state-storage";

type SaveAction = "save" | "load" | "delete" | "share" | "import";

type BusyState =
    | { kind: "idle" }
    | { kind: "working"; action: SaveAction; slot: SaveSlot };

type SaveStatePanelProps = {
    gameId: string;
    gameLabel: string;
    playtimeMs: number;
    captureState: () => Promise<ArrayBuffer>;
    restoreState: (state: ArrayBuffer) => Promise<void>;
    onClose: () => void;
    onFlash: (message: string) => void;
};

function fileName(gameLabel: string, slot: SaveSlot): string {
    const safeLabel = gameLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `${safeLabel || "game"}-slot-${slot}.state`;
}

function download(file: File) {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function savedAtLabel(savedAt: number): string {
    return new Date(savedAt).toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export function SaveStatePanel({
    gameId,
    gameLabel,
    playtimeMs,
    captureState,
    restoreState,
    onClose,
    onFlash,
}: SaveStatePanelProps) {
    const [saves, setSaves] = useState<StoredSaveState[]>([]);
    const [busy, setBusy] = useState<BusyState>({ kind: "idle" });
    const [error, setError] = useState<string | null>(null);
    const [importSlot, setImportSlot] = useState<SaveSlot>(1);
    const closeRef = useRef<HTMLButtonElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const refresh = useCallback(async () => setSaves(await listSaveStates(gameId)), [gameId]);

    useEffect(() => {
        closeRef.current?.focus();
        void refresh().catch(() => setError("Save storage is unavailable in this browser."));
    }, [gameId, refresh]);

    const run = async (
        action: SaveAction,
        slot: SaveSlot,
        task: () => Promise<void>,
    ) => {
        setBusy({ kind: "working", action, slot });
        setError(null);
        try {
            await task();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "That save action failed.");
        } finally {
            setBusy({ kind: "idle" });
        }
    };

    const save = (slot: SaveSlot) =>
        run("save", slot, async () => {
            const data = await captureState();
            await writeSaveState({ gameId, gameLabel, slot, savedAt: Date.now(), playtimeMs, data });
            await refresh();
            onFlash(`Saved to slot ${slot}.`);
        });

    const load = (slot: SaveSlot) =>
        run("load", slot, async () => {
            const record = await readSaveState(gameId, slot);
            if (!record) throw new Error(`Slot ${slot} is empty.`);
            await restoreState(record.data);
            onFlash(`Loaded slot ${slot}.`);
            onClose();
        });

    const remove = (slot: SaveSlot) =>
        run("delete", slot, async () => {
            await deleteSaveState(gameId, slot);
            await refresh();
        });

    const share = (slot: SaveSlot) =>
        run("share", slot, async () => {
            const record = await readSaveState(gameId, slot);
            if (!record) throw new Error(`Slot ${slot} is empty.`);

            const file = new File([record.data], fileName(gameLabel, slot), {
                type: "application/octet-stream",
            });
            const shareData = { files: [file], title: `${gameLabel} save slot ${slot}` };

            if (
                typeof navigator.share === "function" &&
                typeof navigator.canShare === "function" &&
                navigator.canShare(shareData)
            ) {
                try {
                    await navigator.share(shareData);
                } catch (caught) {
                    if (caught instanceof DOMException && caught.name === "AbortError") return;
                    throw caught;
                }
            } else {
                download(file);
                onFlash(`Exported slot ${slot}.`);
            }
        });

    const chooseImport = (slot: SaveSlot) => {
        setImportSlot(slot);
        fileInputRef.current?.click();
    };

    const importFile = (file: File) =>
        run("import", importSlot, async () => {
            const data = await file.arrayBuffer();
            if (data.byteLength === 0) throw new Error("That state file is empty.");

            await writeSaveState({
                gameId,
                gameLabel,
                slot: importSlot,
                savedAt: Date.now(),
                playtimeMs,
                data,
            });
            await refresh();
            onFlash(`Imported slot ${importSlot}.`);
        });

    return (
        <div className="sg-panel sg-states" role="dialog" aria-label="Save states">
            <div className="sg-panel-head">
                <div>
                    <p className="sg-panel-title">Save states</p>
                    <p className="sg-panel-kicker">{gameLabel}</p>
                </div>
                <button
                    type="button"
                    ref={closeRef}
                    className="sg-panel-close"
                    onClick={onClose}
                    aria-label="Close save states"
                >
                    X
                </button>
            </div>

            <div className="sg-state-slots">
                {SAVE_SLOTS.map((slot) => {
                    const record = saves.find((saveState) => saveState.slot === slot);
                    const working = busy.kind === "working" && busy.slot === slot;

                    return (
                        <section className="sg-state-slot" key={slot} aria-label={`Save slot ${slot}`}>
                            <div className="sg-state-meta">
                                <span className="sg-state-number">SLOT {slot}</span>
                                <span className="sg-state-time">
                                    {record
                                        ? `${savedAtLabel(record.savedAt)} · ${formatPlaytime(record.playtimeMs)}`
                                        : "EMPTY"}
                                </span>
                            </div>
                            <div className="sg-state-actions">
                                <button type="button" disabled={working} onClick={() => void save(slot)}>
                                    {working && busy.action === "save" ? "SAVING" : "SAVE"}
                                </button>
                                <button
                                    type="button"
                                    disabled={!record || working}
                                    onClick={() => void load(slot)}
                                >
                                    LOAD
                                </button>
                                <button
                                    type="button"
                                    disabled={!record || working}
                                    onClick={() => void share(slot)}
                                >
                                    SHARE
                                </button>
                                <button type="button" disabled={working} onClick={() => chooseImport(slot)}>
                                    IMPORT
                                </button>
                                {record ? (
                                    <button
                                        type="button"
                                        disabled={working}
                                        onClick={() => void remove(slot)}
                                        aria-label={`Delete save slot ${slot}`}
                                    >
                                        DELETE
                                    </button>
                                ) : null}
                            </div>
                        </section>
                    );
                })}
            </div>

            <p className="sg-panel-note">
                Saves stay on this device. Share exports a state file you can import on another
                phone or computer.
            </p>
            {error ? (
                <p className="sg-state-error" role="alert">
                    {error}
                </p>
            ) : null}

            <input
                ref={fileInputRef}
                type="file"
                accept=".state,.savestate,application/octet-stream"
                hidden
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) void importFile(file);
                }}
            />
        </div>
    );
}
