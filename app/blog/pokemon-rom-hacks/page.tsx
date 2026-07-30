import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
    title: "What Pokemon ROM Hacks Are — Kesh",
    description:
        "A short introduction to Pokemon ROM hacks, why they're worth your time, and the ten I'd actually hand to someone.",
};

type Hack = {
    rank: number;
    title: string;
    base: string;
    pitch: string;
    note: string;
};

const TOP_TEN: Hack[] = [
    {
        rank: 1,
        title: "Pokemon Unbound",
        base: "FireRed",
        pitch:
            "The one that stopped feeling like a hack. An original region, a story with actual stakes, difficulty settings, a quest board, side content that isn't filler, and a soundtrack that had no business being that good. If you play one hack in your life, play this.",
        note: "Start on Difficult. Insane is a different hobby.",
    },
    {
        rank: 2,
        title: "Pokemon Radical Red",
        base: "FireRed",
        pitch:
            "Kanto rebuilt as a competitive puzzle. Every trainer is running a real team with real items and an AI that reads your switches. It is not fair and it is not trying to be — it's a boss rush wearing Gen 3's clothes.",
        note: "Turn on the built-in QoL settings. You will need the free level cap info.",
    },
    {
        rank: 3,
        title: "Pokemon Emerald Rogue",
        base: "Emerald",
        pitch:
            "Hoenn as a roguelike. Randomised routes, a shop between legs, a run that ends and starts over. It solves the problem every replay has: you already know what's on Route 104.",
        note: "The best hack for short sessions. One run fits in a lunch break.",
    },
    {
        rank: 4,
        title: "Pokemon Gaia",
        base: "FireRed",
        pitch:
            "Orbtus: ruins, earthquakes, an archaeology plot that holds together. The most confidently *designed* fan region I've played — every town looks like someone drew it twice.",
        note: "Complete and stable. A good first hack if Unbound sounds like a lot.",
    },
    {
        rank: 5,
        title: "Pokemon Renegade Platinum",
        base: "Platinum",
        pitch:
            "Platinum as it should have shipped. Every Sinnoh Pokemon obtainable, the awful early-game type coverage fixed, trainers given teams worth beating, and none of the original's charm sanded off.",
        note: "The definitive way to replay Gen 4.",
    },
    {
        rank: 6,
        title: "Pokemon Crystal Clear",
        base: "Crystal",
        pitch:
            "Open-world Johto. Pick a starter, pick a town, go anywhere, fight the gyms in any order — the badges scale to you. Twenty-five years later it found the thing Johto was always missing.",
        note: "Gen 2 sprite work and all. Play it on a handheld if you can.",
    },
    {
        rank: 7,
        title: "Pokemon Inclement Emerald",
        base: "Emerald",
        pitch:
            "Emerald with every quality-of-life fix at once — physical/special split, all 386 catchable, reusable TMs, a difficulty slider — and otherwise the game you remember. The comfort food entry.",
        note: "What to hand someone who says 'I just want to replay Emerald'.",
    },
    {
        rank: 8,
        title: "Pokemon Glazed",
        base: "Emerald",
        pitch:
            "Tunod, and three regions after it. Rough around the edges in the way early hacks are, and completely sincere about it. A lot of us got into this because of Glazed.",
        note: "Play the Blazed Glazed version; it fixes most of the sharp edges.",
    },
    {
        rank: 9,
        title: "Pokemon Sacred Gold & Storm Silver",
        base: "HeartGold / SoulSilver",
        pitch:
            "HeartGold with the difficulty turned up and the Johto roster finally opened out. Drayano's hacks are the reason 'rebalance hack' is a genre, and this is the best of them.",
        note: "Storm Silver if you want Kyogre. It genuinely doesn't matter otherwise.",
    },
    {
        rank: 10,
        title: "Pokemon Emerald Kaizo",
        base: "Emerald",
        pitch:
            "The masochism entry. Nuzlocke rules assumed, every gym leader with a full competitive team, and a Roxanne fight that has ended more runs than every other hack on this list combined.",
        note: "Do not start here. Finish something else first, then come back angry.",
    },
];

export default function PokemonRomHacksPage() {
    return (
        <article className="py-12 sm:py-16 bg-background text-foreground">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <Link
                    href="/#about"
                    className="inline-flex items-center gap-2 mb-8 font-mono text-xs font-bold uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                </Link>

                <header className="border-2 border-foreground bg-background p-6 sm:p-8 shadow-[6px_6px_0px_0px_hsl(var(--foreground))] mb-12">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-foreground/60 mb-3">
                        Field Notes
                    </p>
                    <h1 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tighter leading-none mb-4">
                        What Pokemon ROM Hacks Are
                    </h1>
                    <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/85">
                        You found the emulator. This is the rest of it — what these games
                        are, why people spend years making them, and the ten I&apos;d
                        actually put in someone&apos;s hands.
                    </p>
                </header>

                <section className="mb-14">
                    <div className="flex items-center justify-between mb-6 border-b-4 border-foreground pb-2">
                        <h2 className="text-2xl font-black font-display uppercase tracking-widest">
                            The Short Version
                        </h2>
                        <span className="font-mono text-xs font-bold">PRIMER</span>
                    </div>

                    <div className="space-y-5 font-serif text-sm sm:text-base leading-relaxed text-foreground/85">
                        <p>
                            A ROM hack is a Pokemon game somebody took apart and rebuilt. Not
                            a new game engine, not a remake from scratch — the original
                            cartridge&apos;s code, edited. Someone opens up FireRed, redraws
                            the map, rewrites the script, swaps the encounter tables, and what
                            comes out the other end is a game that runs on the same hardware
                            and feels like something else entirely.
                        </p>
                        <p>
                            The scene grew up around Gen 3 for a boring, practical reason: the
                            GBA games are the best documented. Two decades of people reverse
                            engineering FireRed and Emerald produced disassemblies so complete
                            that a modern hack can add mechanics Game Freak shipped ten years
                            later — the physical/special split, Fairy typing, held item
                            previews, running indoors — into a 2004 cartridge. That&apos;s why
                            so much of this list is Gen 3. It&apos;s the platform with the best
                            tools, not the best games.
                        </p>
                        <p>
                            They come in roughly three shapes.{" "}
                            <strong className="font-black">Quality-of-life rebuilds</strong>{" "}
                            keep the game you remember and fix what aged badly. {" "}
                            <strong className="font-black">Difficulty hacks</strong> assume you
                            have beaten Pokemon fifteen times and would like it to fight back.{" "}
                            <strong className="font-black">Total conversions</strong> throw out
                            the region, the story and the roster, and are the reason this scene
                            is worth paying attention to at all.
                        </p>
                        <p>
                            The good ones are not nostalgia projects. They&apos;re what happens
                            when people who love a series get to answer the design questions it
                            never did — what if the level curve respected your time, what if
                            the rival was a real fight, what if you could go anywhere. Some of
                            the best game design I&apos;ve played in the last few years shipped
                            as a .ips patch made by four people on a Discord server.
                        </p>
                    </div>
                </section>

                <section className="mb-14">
                    <div className="flex items-center justify-between mb-6 border-b-4 border-foreground pb-2">
                        <h2 className="text-2xl font-black font-display uppercase tracking-widest">
                            Top 10
                        </h2>
                        <span className="font-mono text-xs font-bold">MY LIST</span>
                    </div>

                    <ol className="space-y-4">
                        {TOP_TEN.map((hack) => (
                            <li
                                key={hack.rank}
                                className="flex gap-4 p-4 sm:p-5 border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] transition-all"
                            >
                                <div className="flex-shrink-0 w-12 h-14 sm:w-14 sm:h-16 border-2 border-foreground bg-foreground text-background flex items-center justify-center">
                                    <span className="text-xl sm:text-2xl font-black font-mono">
                                        {hack.rank}
                                    </span>
                                </div>

                                <div className="flex-grow min-w-0">
                                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                                        <h3 className="font-bold text-base sm:text-lg font-display uppercase tracking-wide">
                                            {hack.title}
                                        </h3>
                                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                                            {hack.base}
                                        </span>
                                    </div>
                                    <p className="font-serif text-xs sm:text-sm leading-relaxed text-foreground/85">
                                        {hack.pitch}
                                    </p>
                                    <p className="mt-2 font-mono text-[11px] leading-relaxed text-foreground/55">
                                        → {hack.note}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="mb-14">
                    <div className="flex items-center justify-between mb-6 border-b-4 border-foreground pb-2">
                        <h2 className="text-2xl font-black font-display uppercase tracking-widest">
                            How To Play One
                        </h2>
                        <span className="font-mono text-xs font-bold">SETUP</span>
                    </div>

                    <div className="space-y-5 font-serif text-sm sm:text-base leading-relaxed text-foreground/85">
                        <p>
                            Hacks are distributed as patches, not as games — usually an{" "}
                            <code className="font-mono text-xs">.ips</code>,{" "}
                            <code className="font-mono text-xs">.ups</code> or{" "}
                            <code className="font-mono text-xs">.bps</code> file. You supply a
                            clean copy of the original cartridge, run it and the patch through
                            a patcher, and get a playable ROM out. That split is the whole
                            legal arrangement the scene runs on: the creators wrote the changes,
                            and the changes are all they hand you.
                        </p>
                        <p>
                            After that it&apos;s any emulator — mGBA on a desktop, Delta on iOS,
                            or the one a few clicks back on this page, which is mGBA compiled to
                            WebAssembly and running in your browser tab. Same core, no install.
                        </p>
                        <p className="text-foreground/60 text-xs sm:text-sm">
                            Everything above is a link away from this site, not on it. I
                            don&apos;t host ROMs or patches, and neither should you.
                        </p>
                    </div>
                </section>

                <div className="border-2 border-foreground bg-foreground text-background p-6 sm:p-8 shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-widest opacity-70 mb-2">
                        Still here?
                    </p>
                    <p className="font-serif text-sm sm:text-base leading-relaxed">
                        Go pat Garchomp again. The cartridge menu takes your own file — if
                        you&apos;ve patched one of these, it&apos;ll boot in the browser
                        without ever leaving your machine.
                    </p>
                </div>
            </div>
        </article>
    );
}
