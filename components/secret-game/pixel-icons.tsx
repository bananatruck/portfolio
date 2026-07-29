"use client";

/**
 * Icons drawn as literal pixel grids rather than vector paths, so they stay
 * chunky at any size instead of smoothing out the way an scaled SVG would.
 * Each string is one row; "#" is a filled pixel.
 */

type PixelIconProps = {
    grid: readonly string[];
    size?: number;
    className?: string;
};

function PixelIcon({ grid, size = 32, className }: PixelIconProps) {
    const height = grid.length;
    const width = grid[0]?.length ?? 0;

    const pixels: React.ReactNode[] = [];
    grid.forEach((row, y) => {
        // Collapse runs of filled pixels into single rects — a 16x16 icon drops
        // from ~256 nodes to a couple dozen, and seams between adjacent rects
        // stop showing up at fractional scales.
        let runStart: number | null = null;
        for (let x = 0; x <= width; x++) {
            const filled = row[x] === "#";
            if (filled && runStart === null) {
                runStart = x;
            } else if (!filled && runStart !== null) {
                pixels.push(
                    <rect key={`${y}-${runStart}`} x={runStart} y={y} width={x - runStart} height={1} />,
                );
                runStart = null;
            }
        }
    });

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            width={size}
            height={size}
            shapeRendering="crispEdges"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
            className={className}
        >
            {pixels}
        </svg>
    );
}

const BACK_ARROW = [
    "................",
    "................",
    "................",
    ".......##.......",
    "......###.......",
    ".....####.......",
    "....############",
    "...#############",
    "...#############",
    "....############",
    ".....####.......",
    "......###.......",
    ".......##.......",
    "................",
    "................",
    "................",
] as const;

const SAD_FACE = [
    "....########....",
    "..##........##..",
    ".#............#.",
    "#..............#",
    "#..##......##..#",
    "#..##......##..#",
    "#..............#",
    "#..............#",
    "#..............#",
    "#.....####.....#",
    "#...##....##...#",
    "#..#........#..#",
    ".#............#.",
    "..##........##..",
    "....########....",
    "................",
] as const;

const CARTRIDGE = [
    "................",
    "..############..",
    "..#..........#..",
    "..#.########.#..",
    "..#.#......#.#..",
    "..#.#......#.#..",
    "..#.########.#..",
    "..#..........#..",
    "..############..",
    "..#..........#..",
    "..#.##.##.##.#..",
    "..#.##.##.##.#..",
    "..#..........#..",
    ".##############.",
    ".##############.",
    "................",
] as const;

// Solid upper half, hollow lower half, release button through the middle —
// the silhouette has to carry it, since these render in a single colour.
const POKEBALL = [
    "....########....",
    "..############..",
    ".##############.",
    "################",
    "################",
    "################",
    "######....######",
    "#####.####.#####",
    "#####.#..#.#####",
    "#####.####.#####",
    "######....######",
    "##............##",
    "##............##",
    ".##..........##.",
    "..############..",
    "....########....",
] as const;

export const PixelBackArrow = (props: Omit<PixelIconProps, "grid">) => (
    <PixelIcon grid={BACK_ARROW} {...props} />
);

export const PixelSadFace = (props: Omit<PixelIconProps, "grid">) => (
    <PixelIcon grid={SAD_FACE} {...props} />
);

export const PixelCartridge = (props: Omit<PixelIconProps, "grid">) => (
    <PixelIcon grid={CARTRIDGE} {...props} />
);

export const PixelPokeball = (props: Omit<PixelIconProps, "grid">) => (
    <PixelIcon grid={POKEBALL} {...props} />
);
