"use client";

export const SAVE_SLOTS = [1, 2, 3, 4, 5, 6] as const;

export type SaveSlot = (typeof SAVE_SLOTS)[number];

export type StoredSaveState = {
    id: string;
    gameId: string;
    gameLabel: string;
    slot: SaveSlot;
    savedAt: number;
    playtimeMs: number;
    data: ArrayBuffer;
};

const DATABASE_NAME = "sg-save-states-v1";
const STORE_NAME = "states";

function stateId(gameId: string, slot: SaveSlot): string {
    return `${gameId}:${slot}`;
}

function isSaveSlot(value: unknown): value is SaveSlot {
    return typeof value === "number" && SAVE_SLOTS.some((slot) => slot === value);
}

function isStoredSaveState(value: unknown): value is StoredSaveState {
    if (!value || typeof value !== "object") return false;

    return (
        "id" in value &&
        typeof value.id === "string" &&
        "gameId" in value &&
        typeof value.gameId === "string" &&
        "gameLabel" in value &&
        typeof value.gameLabel === "string" &&
        "slot" in value &&
        isSaveSlot(value.slot) &&
        "savedAt" in value &&
        typeof value.savedAt === "number" &&
        Number.isFinite(value.savedAt) &&
        "playtimeMs" in value &&
        typeof value.playtimeMs === "number" &&
        Number.isFinite(value.playtimeMs) &&
        "data" in value &&
        value.data instanceof ArrayBuffer
    );
}

function openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, 1);

        request.onupgradeneeded = () => {
            if (!request.result.objectStoreNames.contains(STORE_NAME)) {
                const store = request.result.createObjectStore(STORE_NAME, { keyPath: "id" });
                store.createIndex("gameId", "gameId");
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error ?? new Error("Could not open save storage."));
    });
}

export async function listSaveStates(gameId: string): Promise<StoredSaveState[]> {
    const database = await openDatabase();

    try {
        return await new Promise((resolve, reject) => {
            const transaction = database.transaction(STORE_NAME, "readonly");
            const request = transaction.objectStore(STORE_NAME).index("gameId").getAll(gameId);

            request.onsuccess = () => {
                const records: unknown = request.result;
                resolve(Array.isArray(records) ? records.filter(isStoredSaveState) : []);
            };
            request.onerror = () => reject(request.error ?? new Error("Could not read save slots."));
        });
    } finally {
        database.close();
    }
}

export async function readSaveState(
    gameId: string,
    slot: SaveSlot,
): Promise<StoredSaveState | null> {
    const database = await openDatabase();

    try {
        return await new Promise((resolve, reject) => {
            const request = database
                .transaction(STORE_NAME, "readonly")
                .objectStore(STORE_NAME)
                .get(stateId(gameId, slot));

            request.onsuccess = () => {
                const record: unknown = request.result;
                resolve(isStoredSaveState(record) ? record : null);
            };
            request.onerror = () => reject(request.error ?? new Error("Could not read that save."));
        });
    } finally {
        database.close();
    }
}

export async function writeSaveState(
    save: Omit<StoredSaveState, "id">,
): Promise<StoredSaveState> {
    const database = await openDatabase();
    const record: StoredSaveState = { ...save, id: stateId(save.gameId, save.slot) };

    try {
        await new Promise<void>((resolve, reject) => {
            const transaction = database.transaction(STORE_NAME, "readwrite");
            transaction.objectStore(STORE_NAME).put(record);
            transaction.oncomplete = () => resolve();
            transaction.onerror = () =>
                reject(transaction.error ?? new Error("Could not write that save."));
            transaction.onabort = () =>
                reject(transaction.error ?? new Error("Writing that save was cancelled."));
        });
        return record;
    } finally {
        database.close();
    }
}

export async function deleteSaveState(gameId: string, slot: SaveSlot): Promise<void> {
    const database = await openDatabase();

    try {
        await new Promise<void>((resolve, reject) => {
            const transaction = database.transaction(STORE_NAME, "readwrite");
            transaction.objectStore(STORE_NAME).delete(stateId(gameId, slot));
            transaction.oncomplete = () => resolve();
            transaction.onerror = () =>
                reject(transaction.error ?? new Error("Could not delete that save."));
            transaction.onabort = () =>
                reject(transaction.error ?? new Error("Deleting that save was cancelled."));
        });
    } finally {
        database.close();
    }
}
