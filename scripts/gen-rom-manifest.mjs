/**
 * Scans public/secret-game/roms and writes a manifest of what's actually there.
 *
 * The roms folder is gitignored, so this resolves differently by environment:
 *   - locally, where the ROMs exist, the secret game boots straight into them
 *   - in CI, where the folder is empty, the manifest comes out empty and the
 *     game falls back to asking the visitor for their own file
 *
 * Either way the manifest exists, so the client never fetches a 404.
 */

import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROMS_DIR = path.join(process.cwd(), "public", "secret-game", "roms");
const MANIFEST = path.join(ROMS_DIR, "manifest.json");
const ROM_EXTENSIONS = new Set([".gba", ".zip", ".7z"]);

// Display names for the ROMs we know about; anything else falls back to its
// filename. Order here is the order they appear in the cartridge menu.
const KNOWN = [
    // No accent on "Pokemon": the pixel font used in the menu has no é glyph,
    // so it would fall back to a different typeface mid-word.
    { file: "pokemon-unbound.zip", label: "Pokemon Unbound" },
    { file: "pokemon-firered.zip", label: "Pokemon FireRed" },
];

function titleFromFilename(file) {
    return path
        .basename(file, path.extname(file))
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function listRoms() {
    try {
        const entries = await readdir(ROMS_DIR, { withFileTypes: true });
        return entries
            .filter((e) => e.isFile() && ROM_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
            .map((e) => e.name);
    } catch (error) {
        if (error.code === "ENOENT") return [];
        throw error;
    }
}

const present = await listRoms();

const ordered = [
    ...KNOWN.filter((rom) => present.includes(rom.file)),
    ...present
        .filter((file) => !KNOWN.some((rom) => rom.file === file))
        .map((file) => ({ file, label: titleFromFilename(file) })),
];

await mkdir(ROMS_DIR, { recursive: true });
await writeFile(MANIFEST, `${JSON.stringify({ roms: ordered }, null, 2)}\n`);

console.log(
    ordered.length > 0
        ? `secret-game: ${ordered.length} rom(s) — ${ordered.map((r) => r.label).join(", ")}`
        : "secret-game: no roms found, visitors will be asked for their own file",
);
