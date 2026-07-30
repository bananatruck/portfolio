"use client";

/**
 * Fetches a cartridge on demand and keeps it in the browser's Cache Storage.
 *
 * Nothing is downloaded until a visitor actually picks a game. That matters
 * here: the cartridges run to about 17MB each and there are five of them, so
 * pulling them all just because someone opened the easter egg would be rude on
 * a phone plan.
 *
 * Once a cartridge is in the cache the second play is instant and offline, which
 * the HTTP cache alone wouldn't reliably give — static hosts tend to serve these
 * with a revalidate-every-time policy.
 */

const CACHE_NAME = "sg-cartridges-v1";

export type DownloadProgress = {
    /** 0..1, or null while the server hasn't told us the total yet. */
    ratio: number | null;
    receivedBytes: number;
    totalBytes: number | null;
    /** True when it came straight from cache and never hit the network. */
    cached: boolean;
};

async function openCache(): Promise<Cache | null> {
    try {
        return await caches.open(CACHE_NAME);
    } catch {
        // No Cache Storage (private mode in some browsers, insecure origin).
        // The download still works, it just won't be kept.
        return null;
    }
}

/**
 * Returns a blob: URL for the cartridge at `url`, downloading it first if it
 * isn't already cached. The caller owns the returned URL and must revoke it.
 */
export async function loadCartridge(
    url: string,
    onProgress: (progress: DownloadProgress) => void,
    signal?: AbortSignal,
): Promise<string> {
    const cache = await openCache();

    const hit = await cache?.match(url).catch(() => undefined);
    if (hit) {
        const blob = await hit.blob();
        onProgress({
            ratio: 1,
            receivedBytes: blob.size,
            totalBytes: blob.size,
            cached: true,
        });
        return URL.createObjectURL(blob);
    }

    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Cartridge failed to load (${response.status})`);

    // Cache before reading the body: put() consumes a clone, and doing it here
    // means an interrupted read still leaves nothing half-written behind.
    const forCache = response.clone();

    const declared = Number(response.headers.get("content-length"));
    const totalBytes = Number.isFinite(declared) && declared > 0 ? declared : null;

    let blob: Blob;
    const reader = response.body?.getReader();

    if (!reader) {
        // No streaming support — fall back to a single read with no progress.
        onProgress({ ratio: null, receivedBytes: 0, totalBytes, cached: false });
        blob = await response.blob();
    } else {
        const chunks: Uint8Array[] = [];
        let receivedBytes = 0;

        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedBytes += value.length;
            onProgress({
                ratio: totalBytes ? Math.min(receivedBytes / totalBytes, 1) : null,
                receivedBytes,
                totalBytes,
                cached: false,
            });
        }

        blob = new Blob(chunks as BlobPart[]);
    }

    // Storing can fail on a full quota; a working game without a cache entry
    // beats no game at all.
    await cache?.put(url, forCache).catch(() => {});

    onProgress({ ratio: 1, receivedBytes: blob.size, totalBytes: blob.size, cached: false });
    return URL.createObjectURL(blob);
}

/** "17.3 MB" — for telling someone what a cartridge will cost them. */
export function formatBytes(bytes: number): string {
    return `${(bytes / 1_000_000).toFixed(1)} MB`;
}
