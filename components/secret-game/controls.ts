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
