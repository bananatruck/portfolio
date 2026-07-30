"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatPlaytime, loadTrainerName, saveTrainerName } from "./playtime";

/**
 * The hall of fame. Everyone's ranked by hours on the clock, under the trainer
 * name they'd have typed on the naming screen.
 *
 * The rivals are fixed — this is a joke on a portfolio site, not a service — and
 * the visitor's row is their real local playtime, which is why it starts at
 * "0m" and why they're bottom of the table for a very long time.
 */

type Rival = { name: string; game: string; hours: number };

const RIVALS: Rival[] = [
    { name: "KESH", game: "Unbound", hours: 8214 },
    { name: "RED", game: "FireRed", hours: 2317 },
    { name: "LEAF", game: "Emerald", hours: 1908 },
    { name: "ETHAN", game: "HeartGold", hours: 1442 },
    { name: "LUCAS", game: "Platinum", hours: 1129 },
    { name: "HILDA", game: "Black", hours: 874 },
    { name: "BRENDAN", game: "Radical Red", hours: 640 },
    { name: "MAY", game: "Gaia", hours: 512 },
    { name: "BARRY", game: "Emerald Kaizo", hours: 288 },
    { name: "SILVER", game: "Glazed", hours: 96 },
];

const MAX_NAME_LENGTH = 10;

export function Leaderboard({
    playtimeMs,
    gameLabel,
    onClose,
}: {
    playtimeMs: number;
    gameLabel: string;
    onClose: () => void;
}) {
    const [name, setName] = useState("");
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setName(loadTrainerName());
        closeRef.current?.focus();
    }, []);

    useEffect(() => {
        if (editing) inputRef.current?.focus();
    }, [editing]);

    const rows = useMemo(() => {
        const you = {
            name: name.trim().toUpperCase() || "RIVAL",
            game: gameLabel,
            hours: playtimeMs / 3600000,
            you: true,
        };

        return [...RIVALS.map((rival) => ({ ...rival, you: false })), you].sort(
            (a, b) => b.hours - a.hours,
        );
    }, [gameLabel, name, playtimeMs]);

    const commitName = () => {
        const cleaned = name.trim().toUpperCase().slice(0, MAX_NAME_LENGTH);
        setName(cleaned);
        saveTrainerName(cleaned);
        setEditing(false);
    };

    return (
        <div className="sg-panel sg-leaderboard" role="dialog" aria-label="Hall of fame">
            <div className="sg-panel-head">
                <p className="sg-panel-title">Hall of Fame</p>
                <button
                    type="button"
                    ref={closeRef}
                    className="sg-panel-close"
                    onClick={onClose}
                    aria-label="Close hall of fame"
                >
                    X
                </button>
            </div>

            <ol className="sg-lb-rows">
                {rows.map((row, index) => (
                    <li
                        key={`${row.name}-${index}`}
                        className="sg-lb-row"
                        data-you={row.you}
                        aria-current={row.you || undefined}
                    >
                        <span className="sg-lb-rank">{index + 1}</span>

                        {row.you && editing ? (
                            <input
                                ref={inputRef}
                                className="sg-lb-input"
                                value={name}
                                maxLength={MAX_NAME_LENGTH}
                                aria-label="Your trainer name"
                                onChange={(event) => setName(event.target.value)}
                                onBlur={commitName}
                                onKeyDown={(event) => {
                                    // Keys would otherwise fall through to the shell
                                    // and move the player around while you type.
                                    event.stopPropagation();
                                    if (event.key === "Enter") commitName();
                                }}
                            />
                        ) : (
                            <span className="sg-lb-name">{row.name}</span>
                        )}

                        <span className="sg-lb-game">{row.game}</span>
                        <span className="sg-lb-hours">
                            {row.you
                                ? formatPlaytime(playtimeMs)
                                : `${row.hours.toLocaleString()}h`}
                        </span>
                    </li>
                ))}
            </ol>

            {!editing ? (
                <button type="button" className="sg-panel-action" onClick={() => setEditing(true)}>
                    {name ? "Rename trainer" : "Name your trainer"}
                </button>
            ) : null}

            <p className="sg-panel-note">
                Your hours are counted on this device only. Kesh&apos;s are, regrettably, real.
            </p>
        </div>
    );
}
