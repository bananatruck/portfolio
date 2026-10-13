/**
 * The console's button table, and where each button sits on the skin.
 *
 * Layout coordinates come straight out of the Glacier skin's info.json (a Delta
 * emulator skin, in Pokemon Assets/), so the hit areas land exactly on the
 * painted buttons. They're absolute pixels against a mapping frame, converted to
 * percentages at render time — that's what lets one set of numbers drive every
 * screen size.
 */

/** RetroArch joypad indices. EmulatorJS's simulateInput speaks these. */
export const PAD = {
    B: 0,
    Y: 1,
    SELECT: 2,
    START: 3,
    UP: 4,
    DOWN: 5,
    LEFT: 6,
    RIGHT: 7,
    A: 8,
    X: 9,
    L: 10,
    R: 11,
} as const;

export type PadButton = keyof typeof PAD;

/**
 * Keyboard bindings, shown on the buttons themselves on desktop so nobody has to
 * guess. The parent document owns keyboard input outright — see the note in
 * public/secret-game/index.html for why the emulator's own bindings never fire.
 */
export const KEY_BINDINGS: Record<string, PadButton> = {
    z: "A",
    x: "B",
    c: "START",
    v: "SELECT",
    a: "L",
    s: "R",
    arrowup: "UP",
    arrowdown: "DOWN",
    arrowleft: "LEFT",
    arrowright: "RIGHT",
};

/** The label printed on the keycap badge for each button, on desktop. */
export const KEY_LABELS: Record<PadButton, string> = {
    A: "Z",
    B: "X",
    START: "C",
    SELECT: "V",
    L: "A",
    R: "S",
    UP: "↑",
    DOWN: "↓",
    LEFT: "←",
    RIGHT: "→",
    X: "",
    Y: "",
};

/** Held rather than toggled, so it behaves like a turbo trigger. */
export const FAST_FORWARD_KEY = " ";
export const MUTE_KEY = "m";

type Frame = { x: number; y: number; width: number; height: number };

export type Layout = {
    /** The coordinate space every frame below is expressed in. */
    mapping: { width: number; height: number };
    screen: Frame;
    dpad: Frame;
    buttons: Partial<Record<PadButton, Frame>>;
    /** The skin's centre button, which opens our menu rather than Delta's. */
    menu: Frame;
    skin: string;
};

/**
 * The DMG pad from the itephra skin, with a screen composited above it.
 *
 * That skin is controller-only — its info.json declares no screen frame, because
 * Delta puts the picture in whatever space is left above the pad. Baking the
 * screen into the art instead means one image and one frame table, exactly like
 * a full-device skin, and the shell needs no special case for it.
 *
 * Frames are the skin's own 320-wide coordinates scaled 4x, offset down by the
 * 849px screen band.
 */
export const ITEPHRA: Layout = {
    mapping: { width: 1280, height: 1945 },
    screen: { x: 90, y: 70, width: 1100, height: 733 },
    dpad: { x: 24, y: 1073, width: 528, height: 528 },
    buttons: {
        A: { x: 964, y: 1097, width: 256, height: 256 },
        B: { x: 704, y: 1333, width: 256, height: 256 },
        START: { x: 704, y: 1669, width: 84, height: 84 },
        SELECT: { x: 496, y: 1669, width: 84, height: 84 },
        L: { x: 0, y: 849, width: 388, height: 116 },
        R: { x: 896, y: 849, width: 388, height: 116 },
    },
    menu: { x: 32, y: 1669, width: 84, height: 84 },
    skin: "/secret-game/skin/itephra.webp",
};

export const PORTRAIT: Layout = {
    mapping: { width: 1080, height: 2340 },
    screen: { x: 52, y: 143, width: 976, height: 651 },
    dpad: { x: 26, y: 1442, width: 376, height: 376 },
    buttons: {
        A: { x: 870, y: 1474, width: 184, height: 184 },
        B: { x: 657, y: 1600, width: 184, height: 184 },
        START: { x: 700, y: 2060, width: 108, height: 108 },
        SELECT: { x: 273, y: 2060, width: 108, height: 108 },
        L: { x: 26, y: 986, width: 204, height: 94 },
        R: { x: 849, y: 986, width: 204, height: 94 },
    },
    menu: { x: 486, y: 2060, width: 108, height: 108 },
    skin: "/secret-game/skin/glacier-portrait.webp",
};

export const LANDSCAPE: Layout = {
    mapping: { width: 2340, height: 1080 },
    screen: { x: 594, y: 118, width: 1153, height: 770 },
    dpad: { x: 130, y: 375, width: 330, height: 330 },
    buttons: {
        A: { x: 2039, y: 371, width: 171, height: 171 },
        B: { x: 1881, y: 543, width: 171, height: 171 },
        START: { x: 2179, y: 919, width: 108, height: 108 },
        SELECT: { x: 53, y: 919, width: 108, height: 108 },
        L: { x: 44, y: 32, width: 355, height: 116 },
        R: { x: 1941, y: 32, width: 355, height: 116 },
    },
    menu: { x: 236, y: 919, width: 108, height: 108 },
    skin: "/secret-game/skin/glacier-landscape.webp",
};

/**
 * KESH_BOY: the site's own console, drawn as SVG in the portfolio's paper and
 * ink. Frames are the SVG's own coordinates, so hit areas land on the drawing.
 */
export const KESH_LANDSCAPE: Layout = {
    mapping: { width: 2340, height: 1080 },
    screen: { x: 615, y: 165, width: 1110, height: 740 },
    dpad: { x: 140, y: 370, width: 360, height: 360 },
    buttons: {
        A: { x: 2025, y: 345, width: 190, height: 190 },
        B: { x: 1855, y: 495, width: 190, height: 190 },
        START: { x: 2010, y: 860, width: 220, height: 84 },
        SELECT: { x: 110, y: 860, width: 220, height: 84 },
        L: { x: 90, y: 60, width: 330, height: 92 },
        R: { x: 1920, y: 60, width: 330, height: 92 },
    },
    menu: { x: 380, y: 860, width: 140, height: 84 },
    skin: "/secret-game/skin/kesh-boy-landscape.svg",
};

export const KESH_PORTRAIT: Layout = {
    mapping: { width: 1080, height: 2340 },
    screen: { x: 90, y: 190, width: 900, height: 600 },
    dpad: { x: 80, y: 1150, width: 420, height: 420 },
    buttons: {
        A: { x: 800, y: 1150, width: 210, height: 210 },
        B: { x: 590, y: 1330, width: 210, height: 210 },
        START: { x: 590, y: 1800, width: 240, height: 90 },
        SELECT: { x: 250, y: 1800, width: 240, height: 90 },
        L: { x: 60, y: 960, width: 300, height: 96 },
        R: { x: 720, y: 960, width: 300, height: 96 },
    },
    menu: { x: 440, y: 1990, width: 200, height: 84 },
    skin: "/secret-game/skin/kesh-boy-portrait.svg",
};

/**
 * The shells you can pick between.
 *
 * A skin either reshapes itself to the window or it doesn't. Glacier ships
 * portrait and landscape art, so it follows the orientation. itephra is a Game
 * Boy — a portrait object — and the file only contains portrait art anyway, so
 * it stays upright and letterboxes on a wide screen, which is how holding one
 * actually looks.
 */
export type SkinId = "kesh" | "itephra" | "glacier";

export type Skin = {
    id: SkinId;
    label: string;
    blurb: string;
    portrait: Layout;
    landscape: Layout;
};

export const SKINS: Record<SkinId, Skin> = {
    kesh: {
        id: "kesh",
        label: "KESH_BOY",
        blurb: "Paper and ink",
        portrait: KESH_PORTRAIT,
        landscape: KESH_LANDSCAPE,
    },
    itephra: {
        id: "itephra",
        label: "Game Boy",
        blurb: "DMG-01",
        portrait: ITEPHRA,
        landscape: ITEPHRA,
    },
    glacier: {
        id: "glacier",
        label: "Glacier",
        blurb: "Clear GBA",
        portrait: PORTRAIT,
        landscape: LANDSCAPE,
    },
};

export const SKIN_ORDER: SkinId[] = ["kesh", "glacier", "itephra"];

/**
 * KESH_BOY by default: it matches the site and, like Glacier, has portrait and
 * landscape art, so it fills a desktop window as well as a phone.
 */
export const DEFAULT_SKIN: SkinId = "kesh";

const SKIN_KEY = "sg:skin";

export function loadSkin(): SkinId {
    try {
        const stored = window.localStorage.getItem(SKIN_KEY);
        if (stored && stored in SKINS) return stored as SkinId;
    } catch {
        // Storage is optional; the default is a fine answer.
    }
    return DEFAULT_SKIN;
}

export function saveSkin(id: SkinId) {
    try {
        window.localStorage.setItem(SKIN_KEY, id);
    } catch {
        // Not worth surfacing — the picker still works for this session.
    }
}

/** Frame to CSS percentages, so the console scales with its container. */
export function place(frame: Frame, mapping: { width: number; height: number }) {
    return {
        left: `${(frame.x / mapping.width) * 100}%`,
        top: `${(frame.y / mapping.height) * 100}%`,
        width: `${(frame.width / mapping.width) * 100}%`,
        height: `${(frame.height / mapping.height) * 100}%`,
    };
}

/**
 * Which quadrant(s) of the d-pad a point falls in. The dead zone in the middle
 * is deliberately small: on a real GBA the diagonals are easy to hit, and a
 * generous one makes turning corners in a Pokemon game feel sticky.
 */
export function dpadDirections(offsetX: number, offsetY: number, size: number): PadButton[] {
    const cx = offsetX / size - 0.5;
    const cy = offsetY / size - 0.5;
    const deadZone = 0.12;

    const directions: PadButton[] = [];
    if (cy < -deadZone) directions.push("UP");
    if (cy > deadZone) directions.push("DOWN");
    if (cx < -deadZone) directions.push("LEFT");
    if (cx > deadZone) directions.push("RIGHT");
    return directions;
}
