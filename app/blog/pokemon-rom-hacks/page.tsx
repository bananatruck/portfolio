import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
    title: "Pokemon ROM Hacks — Kesh",
    description:
        "How a five-year-old with no console and a decrepit Android phone found Pokemon ROM hacks, and the thirteen that are still my favourites.",
};

type Hack = {
    rank: number | "HM";
    title: string;
    /** Sent to a search rather than a mirror — I'm not linking anyone's ROM. */
    search: string;
    base: string;
    image?: string;
    body: string;
};

const HACKS: Hack[] = [
    {
        rank: 1,
        title: "Pokemon Radical Red",
        search: "Pokemon Radical Red rom Download",
        base: "FireRed",
        image: "/images/rom-hacks/radical-red.webp",
        body:
            "My most played ROM hack of all time, and the only one that just keeps getting updates. The running joke in the community is asking when the last Radical Red update will be, and the answer is that we'll get the final version some time after the cold and numbing heat death of the universe. At its core it's a difficulty hack, but it's stacked with quality-of-life features, up-to-date graphics, mega evolutions and a difficulty curve you can tune to be exactly as fun as you need it to be. It builds on the FireRed path I'd already spent a decade wandering through every now and then. I still remember my first run, where the only strategy I knew was levelling my Charizard to 100 and beating the absolute hell out of the Elite Four with nothing but attacking moves and an obscene level advantage.",
    },
    {
        rank: 2,
        title: "Pokemon Adventure Red Chapter",
        search: "Pokemon Adventure Red Chapter rom Download",
        base: "FireRed",
        image: "/images/rom-hacks/adventures-red.webp",
        body:
            "An adaptation of the actual Pokemon manga turned into a genuinely polished game with really good dialogue. The story follows the source to a T, and then there's some gloriously cringy fan-written fiction bolted on at the end. I won't spoil it, but it's one of the most entertaining things I've ever interacted with from this franchise, and it has a better and more interesting story than any official Pokemon game I've played. You can easily sink 70 hours into a completely free game somebody built purely out of love for it. It's probably my favourite Pokemon story overall, give or take a couple of the shows.",
    },
    {
        rank: 3,
        title: "Pokemon Unbound",
        search: "Pokemon Unbound rom Download",
        base: "FireRed",
        image: "/images/rom-hacks/unbound.webp",
        body:
            "The most perfect overall rebuild a ROM hack has ever managed. A whole new region, whole new fights, custom difficulty settings, custom puzzle difficulty, an entirely new story. If Game Freak ever decided to make one more GBA game, Unbound is what they'd be trying to accomplish — except it somehow ended up better than most of the Pokemon games that actually shipped.",
    },
    {
        rank: 4,
        title: "Pokemon Team Rocket Edition",
        search: "Pokemon Team Rocket Edition rom Download",
        base: "FireRed",
        image: "/images/rom-hacks/team-rocket.webp",
        body:
            "An original story with a surprising amount of depth and nuance to it, in the same way Adventure Red Chapter has, which is exactly why I ended up loving both. Surprising because it was probably written by a teenager as a passion project. Definitely check it out if you've ever wanted to know what it feels like to steal from the elderly and from children.",
    },
    {
        rank: 5,
        title: "Pokemon Dark Rising",
        search: "Pokemon Dark Rising rom Download",
        base: "FireRed — the whole series",
        image: "/images/rom-hacks/dark-rising.webp",
        body:
            "An odd pick, and most people won't agree with me, because it's an edgy game with a shitty story. I've completed the entire series all the way through anyway. As a young kid who didn't really know the franchise as anything other than bright and friendly, seeing an edgy side to Pokemon was genuinely kind of cool, and that counts for something.",
    },
    {
        rank: 6,
        title: "Pokemon Emerald Rogue",
        search: "Pokemon Emerald Rogue rom Download",
        base: "Emerald",
        image: "/images/rom-hacks/emerald-rogue.webp",
        body:
            "A roguelike — one of my favourite genres full stop — folded into Pokemon with a lot of polish. You can spend hundreds of hours trying to complete it, and I did complete it, including the final challenge. I'm fairly sure only a handful of people in the world are stupid enough to spend that long on something that impossible. I just did it anyway.",
    },
    {
        rank: 7,
        title: "Pokemon Gaia",
        search: "Pokemon Gaia rom Download",
        base: "FireRed",
        image: "/images/rom-hacks/gaia.webp",
        body:
            "Gaia is what Unbound was probably influenced by, because it's a complete, finished version of that same idea with really fun mechanics. I think it goes up to Gen 6 Pokemon, maybe Gen 8 — I'm honestly not sure. Either way it's the better version of what Glazed was reaching for, which is why it sits one spot above it.",
    },
    {
        rank: 8,
        title: "Pokemon Glazed",
        search: "Pokemon Glazed rom Download",
        base: "Emerald",
        image: "/images/rom-hacks/glazed.webp",
        body:
            "Tunod, and three regions after it. Rough around the edges the way early hacks always were, and completely sincere about it. A lot of us are here at all because of Glazed — it was the one that showed a whole generation of kids that a fan could just build a Pokemon game.",
    },
    {
        rank: 9,
        title: "Pokemon Elite Redux",
        search: "Pokemon Elite Redux rom Download",
        base: "Emerald",
        image: "/images/rom-hacks/elite-redux.webp",
        body:
            "You'll have noticed a trend by now: a lot of difficulty hacks and repetitive roguelike hacks. Elite Redux is the purest version of that itch. Every Pokemon gets multiple abilities, every trainer is built to punish you for autopiloting, and the whole thing is a team-building sandbox pretending to be a Pokemon game. If you like the fighting more than the walking, this is the one.",
    },
    {
        rank: 10,
        title: "Pokemon Mega Power",
        search: "Pokemon Mega Power rom Download",
        base: "Emerald",
        image: "/images/rom-hacks/mega-power.webp",
        body:
            "The game that introduced me to Mega Evolution. It has Mega in the name, and when I was young that was genuinely all it took to sell me on it.",
    },
    {
        rank: 11,
        title: "Pokemon Light Platinum",
        search: "Pokemon Light Platinum rom Download",
        base: "Ruby",
        image: "/images/rom-hacks/light-platinum.webp",
        body:
            "My first complete premium Pokemon ROM hack experience, and it was really, really cool. New region, new league, new everything, and it actually ended properly instead of dropping you into an unfinished map like so much of what I'd played before it. This is the one that made me realise a fan project could be finished.",
    },
    {
        rank: 12,
        title: "Pokemon AshGray",
        search: "Pokemon AshGray rom Download",
        base: "FireRed",
        image: "/images/rom-hacks/ash-gray.webp",
        body:
            "A very unpolished game, and something I grew up playing an enormous amount of. It follows the anime episode by episode, and playing it made me feel like I was actually in the anime, which at that age was the entire point.",
    },
    {
        rank: 13,
        title: "Pokemon Liquid Crystal",
        search: "Pokemon Liquid Crystal rom Download",
        base: "FireRed",
        image: "/images/rom-hacks/liquid-crystal.webp",
        body:
            "Johto rebuilt on a GBA engine, and it holds a special place in my heart. Nothing clever to say about this one — it's just Crystal, done lovingly, and I was very happy the whole time I played it.",
    },
    {
        rank: "HM",
        title: "PokeRogue",
        search: "PokeRogue rom Download",
        base: "Browser fan game",
        body:
            "Honourable mention, with an asterisk. It could almost have been great, but at some point it stopped being a roguelike and turned into an autobattler instead, which I personally just got bored of — after about 200 hours of it, admittedly, so take the complaint with the appropriate amount of salt.",
    },
];

const EMULATORS = [
    { platform: "Android", name: "My Boy!", note: "What I actually grew up on." },
    { platform: "iOS", name: "Delta", note: "Free, and properly good now." },
    { platform: "PC", name: "mGBA", note: "The accurate one. Also what's running a few clicks back." },
];

function searchUrl(query: string) {
    return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

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
                        Pokemon ROM Hacks
                    </h1>
                    <p className="font-serif text-sm sm:text-base leading-relaxed text-foreground/85">
                        You found the emulator. This is the rest of it — how I got here, and
                        the thirteen hacks that are still my favourites.
                    </p>
                </header>

                <section className="mb-14">
                    <div className="flex items-center justify-between mb-6 border-b-4 border-foreground pb-2">
                        <h2 className="text-2xl font-black font-display uppercase tracking-widest">
                            How I Got Here
                        </h2>
                        <span className="font-mono text-xs font-bold">ORIGIN</span>
                    </div>

                    <div className="space-y-5 font-serif text-sm sm:text-base leading-relaxed text-foreground/85">
                        <p>
                            Growing up in an Asian household meant there was never really a
                            place or a budget for buying games, or Game Boys, or any consoles
                            at all. So five-year-old me, watching my friends play Pokemon and
                            Mario, really wanted to join in the fray too. Restricted phone
                            time, studying all day, and a very determined kid — which led me to
                            go looking for solutions on the internet, like any young kid on the
                            internet would.
                        </p>
                        <p>
                            That's how I ended up, at five years old, in the very niche
                            community that Pokemon ROM hack culture was at the time. I started
                            out playing plain vanilla Pokemon games on a Game Boy emulator,
                            because that was the only thing my old, decrepit phone could
                            actually run. Then I got into the default Mario games. And then, as
                            I learned more about console emulation as a whole, I found out that
                            people were building their own games out of the existing Pokemon
                            ones.
                        </p>
                        <p>
                            That's the thing that catapulted me into my own CS journey, and it
                            had a domino effect on the rest of my life. Working with emulators
                            and ROM hacks made me wonder if I could play other games on my
                            phone. That made me wonder what else in my phone I could change. So
                            I started tinkering with Android a lot more — installing custom
                            apps, trying to build custom apps that never really worked, picking
                            up a little bit of C++, and eventually flashing custom Android
                            software onto my devices. Now computer science is my major and it's
                            what I do for a living.
                        </p>
                        <p>
                            So this list holds a genuinely special place in my heart. It's
                            something personal, and I'm happy to share it with all of you.
                        </p>
                    </div>
                </section>

                <section className="mb-14">
                    <div className="flex items-center justify-between mb-6 border-b-4 border-foreground pb-2">
                        <h2 className="text-2xl font-black font-display uppercase tracking-widest">
                            The List
                        </h2>
                        <span className="font-mono text-xs font-bold">TAP TO FIND IT</span>
                    </div>

                    <ol className="space-y-6">
                        {HACKS.map((hack) => (
                            <li
                                key={hack.title}
                                className="border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:shadow-[6px_6px_0px_0px_hsl(var(--foreground))] transition-all overflow-hidden"
                            >
                                <a
                                    href={searchUrl(hack.search)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block"
                                >
                                    {hack.image ? (
                                        <div className="relative aspect-[3/2] border-b-2 border-foreground bg-foreground/5 overflow-hidden">
                                            <Image
                                                src={hack.image}
                                                alt={`${hack.title} title screen`}
                                                fill
                                                loading="lazy"
                                                sizes="(max-width: 768px) 100vw, 768px"
                                                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                            />
                                            <span className="absolute top-0 left-0 px-3 py-1.5 font-mono text-xs font-black bg-foreground text-background">
                                                {hack.rank === "HM" ? "HONOURABLE MENTION" : `#${hack.rank}`}
                                            </span>
                                        </div>
                                    ) : null}

                                    <div className="p-4 sm:p-5">
                                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                                            {!hack.image ? (
                                                <span className="font-mono text-xs font-black bg-foreground text-background px-2 py-0.5">
                                                    {hack.rank === "HM" ? "HONOURABLE MENTION" : `#${hack.rank}`}
                                                </span>
                                            ) : null}
                                            <h3 className="font-bold text-base sm:text-lg font-display uppercase tracking-wide group-hover:underline decoration-2 underline-offset-4">
                                                {hack.title}
                                            </h3>
                                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                                                {hack.base}
                                            </span>
                                            <ExternalLink className="w-3 h-3 text-foreground/40 group-hover:text-foreground transition-colors" />
                                        </div>
                                        <p className="font-serif text-xs sm:text-sm leading-relaxed text-foreground/85">
                                            {hack.body}
                                        </p>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="mb-14">
                    <div className="flex items-center justify-between mb-6 border-b-4 border-foreground pb-2">
                        <h2 className="text-2xl font-black font-display uppercase tracking-widest">
                            If You Want To Play
                        </h2>
                        <span className="font-mono text-xs font-bold">SETUP</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 mb-6">
                        {EMULATORS.map((emu) => (
                            <div
                                key={emu.platform}
                                className="border-2 border-foreground p-4 bg-background shadow-[3px_3px_0px_0px_hsl(var(--foreground))]"
                            >
                                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-1">
                                    {emu.platform}
                                </p>
                                <p className="font-display font-black uppercase tracking-wide text-lg leading-none mb-2">
                                    {emu.name}
                                </p>
                                <p className="font-serif text-xs leading-relaxed text-foreground/70">
                                    {emu.note}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-5 font-serif text-sm sm:text-base leading-relaxed text-foreground/85">
                        <p>
                            Hacks come as patches, not as games — usually an{" "}
                            <code className="font-mono text-xs">.ips</code>,{" "}
                            <code className="font-mono text-xs">.ups</code> or{" "}
                            <code className="font-mono text-xs">.bps</code> file. You bring a
                            clean copy of the original cartridge, run it and the patch through
                            a patcher, and get something playable out the other side. That
                            split is the whole arrangement the scene runs on: the creators
                            wrote the changes, and the changes are all they hand you.
                        </p>
                        <p className="text-foreground/60 text-xs sm:text-sm">
                            Every title above links to a search, not to a download. I don't
                            host ROMs or patches here, and neither should you.
                        </p>
                    </div>
                </section>

                <div className="border-2 border-foreground bg-foreground text-background p-6 sm:p-8 shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-widest opacity-70 mb-3">
                        One Last Thing
                    </p>
                    <div className="space-y-4 font-serif text-sm sm:text-base leading-relaxed">
                        <p>
                            This community is still growing. Honestly, 2026 has been the most
                            productive year for it I've ever seen. And with how lazy Pokemon
                            has gotten with its own IP, I think it's the fans who make this
                            thing special and keep it alive every single year, however long it
                            takes them.
                        </p>
                        <p>
                            So I hope you have fun on my portfolio learning a bit more about
                            them, and maybe you'll learn more about Pokemon ROM hacks by
                            actually playing a few. Go pat Garchomp again — the cartridge menu
                            takes your own file, so anything you've patched will boot right in
                            the browser without ever leaving your machine.
                        </p>
                        <p className="font-mono text-xs uppercase tracking-widest pt-1">
                            Look forward to seeing you on the leaderboard.
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}
