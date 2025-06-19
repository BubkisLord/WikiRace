import React, { useState, useEffect } from "react";
import TopNavbar from "../components/top_navbar";
import {
    createGame,
    addPlayerToGame,
    setGameJoinCode,
    getPlayersInGame,
    startGame,
    setStartAndEndPages,
    setFixedStartAndEndPages,
    setGameState
} from "../database"; // Import Firebase functions

const AnimatedText = ({ text }) => (
    <span
        className="dot-anim"
        style={{ position: "relative", display: "inline-block" }}>
        {/* Animated dots on top */}
        <span style={{ position: "relative" }}>
            {text.split("").map((char, i) => (
                <span
                    key={i}
                    className="dot"
                    style={{ animationDelay: `${i * 0.03}s` }}>
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </span>
    </span>
);

const Host = () => {
    const [isHosting, setIsHosting] = useState(false);
    const [gameCode, setGameCode] = useState(""); // Replace public IP with game code
    const [playerName, setPlayerName] = useState("");
    const [maxPlayers, setMaxPlayers] = useState("");
    const [participants, setParticipants] = useState([]);
    const [gameId, setGameId] = useState(""); // Store the game ID
    const [loadingStartGame, setLoadingStartGame] = useState(false); // Loading state
    const [loadingHosting, setLoadingHosting] = useState(false); // Loading state
    const [error, setError] = useState("");
    const [randomTip, setRandomTip] = useState("");

    useEffect(() => {
        var tips = [
            "Wikipedia has over 6.8 million articles in English alone (as of 2024).",
            "Every link in Wikipedia is internal or an external reference, but only internal links count in Wiki races.",
            "Wikipedia articles follow a hierarchical structure, moving from broad topics to specifics.",
            "Disambiguation pages can be both a shortcut and a dead end, depending on context.",
            "Portal pages (e.g., Portal:Science) are usually dead ends in races.",
            "Some articles are protected, meaning they can't be edited, but their links are still functional.",
            "Redirect pages can save time — they automatically forward you to the intended page.",
            "Wikipedia’s first link in almost every article often leads to a broader concept (like “Philosophy”).",
            "The average Wikipedia article has 100–300 internal links.",
            "Wikipedia has a “Random article” button, but it's rarely useful in structured races.",
            "Start from general topics to narrow down quickly.",
            "Open potential links in new tabs to compare paths in parallel.",
            "Use Ctrl+F to find keywords on a page fast.",
            "Avoid country-specific links unless your target is geographic.",
            "Recognise patterns: sciences often lead through related sciences.",
            "Prefer “List of...” pages when searching for examples or categories.",
            "Stay calm — rushing often leads to dead ends.",
            "Ignore citation links ([1], [2]) — they're external.",
            "Use “See also” sections, they are usually rich in useful links.",
            `Pre-map logical link hierarchies: e.g., "Disease" → "Infectious disease" → "Specific virus".`,
            `Learn high-traffic pivot pages, like "Science", "Technology", "History", which connect many domains.`,
            "Understand meta-structures: taxonomies (for biology), timelines (for history), filmographies (for cinema).",
            "Prioritise function over familiarity: pick a route with the most outbound links, not the one you know best.",
            `Predict redirects — knowing common synonyms increases speed (e.g., "Heart attack" redirects to "Myocardial infarction").`,
            "Exploit template navboxes at the bottom of articles for tightly clustered topics.",
            "Track common disambiguation paths — some ambiguous terms offer a backdoor route.",
            "If you get stuck, step back to broader categories rather than pushing into specifics.",
            "Use language patterns: scientific terms often follow Latin/Greek roots — predict link names accordingly."
        ];
        const tipInterval = setInterval(() => {
            setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
        }, 4000);

        return () => clearInterval(tipInterval); // Cleanup interval on component unmount
    }, []);

    // Generate a random six-letter alphanumeric code
    useEffect(() => {
        const generateGameCode = async () => {
            const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let code = "";
            for (let i = 0; i < 6; i++) {
                code += characters.charAt(
                    Math.floor(Math.random() * characters.length)
                );
            }
            setGameCode(code);

            // Update the game's join code in the database
            if (gameId) {
                try {
                    await setGameJoinCode(gameId, code);
                } catch (error) {
                    console.error("Failed to update game join code:", error);
                }
            }
        };

        generateGameCode();
    }, [gameId]); // Re-run when gameId changes

    const startHosting = async () => {
        try {
            setLoadingHosting(true);
            const newGameId = await createGame(maxPlayers); // Create a new game in Firebase
            setGameId(newGameId);
            setIsHosting(true);

            // Add the host to the game
            setParticipants([playerName]);
            await addPlayerToGame(newGameId, playerName);
        } catch (error) {
            setError("Failed to start hosting:", error);
        }
    };

    const _startGame = async () => {
        setLoadingStartGame(true); // Show loading screen
        setError(""); // Clear previous errors
        if (participants.length >= 2) {
            try {
                await setGameState(gameId, "starting"); // Start game

                // Only do this when debugging.
                if (false) {
                    await setFixedStartAndEndPages(
                        gameId,
                        "Albert_Einstein",
                        "Theoretical_physics"
                    );
                }
                await setStartAndEndPages(gameId);
                localStorage.setItem("playerName", playerName);
                window.location.href = `/game/${gameCode}`;
            } catch (error) {
                setLoadingStartGame(false);
                setError("You need two or more players to start.");
            }
        } else {
            setLoadingStartGame(false);
            setError("You need two or more players to start.");
        }
    };

    useEffect(() => {
        const fetchParticipants = async () => {
            if (gameId) {
                try {
                    const players = await getPlayersInGame(gameId); // Fetch players from Firebase
                    setParticipants(players);
                } catch (error) {
                    console.error("Failed to fetch participants:", error);
                }
            }
        };

        const intervalId = setInterval(fetchParticipants, 2000); // Fetch every 2 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [gameId]);

    return (
        <div className="min-h-screen bg-gray-600 flex flex-col">
            <TopNavbar
                navigation_items={[
                    { name: "Dashboard", href: "/", current: false },
                    { name: "Host", href: "/host", current: true },
                    { name: "Join", href: "/join", current: false },
                    {
                        name: "Game History",
                        href: "/game-history",
                        current: false
                    }
                ]}
            />
            <div className="flex flex-1 items-center justify-center">
                {!isHosting ? (
                    <div className="bg-gray-700 shadow-lg rounded-lg p-8 w-full max-w-md">
                        <h1 className="text-2xl font-bold text-center text-gray-100 mb-4">
                            Host a Game
                        </h1>
                        <p className="text-center text-gray-100 mb-6">
                            Enter your name and the max players for this game.
                        </p>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter Player Name"
                                maxLength="20"
                                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                value={maxPlayers}
                                onChange={(e) => setMaxPlayers(e.target.value)}
                                placeholder="Set Max Players"
                                maxLength="2"
                                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={startHosting}
                                className={`w-full py-2 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 ${
                                    loadingHosting
                                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                        : "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500"
                                }`}
                                disabled={loadingHosting}>
                                {loadingHosting ? (
                                    <div className="flex justify-center items-center">
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24">
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            />
                                        </svg>
                                        <span className="ml-2 flex items-center">
                                            <AnimatedText text="Hosting..." />
                                        </span>
                                    </div>
                                ) : (
                                    "Host Game"
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-700 shadow-lg rounded-lg p-8 w-full max-w-md">
                        <h1 className="text-2xl font-bold text-center text-gray-100 mb-4">
                            Game Code: {gameCode}
                        </h1>
                        <p className="text-center text-gray-100 mb-6">
                            Waiting for players to join...
                        </p>
                        <ul className="space-y-2">
                            {participants.map((participant, index) => (
                                <li
                                    key={index}
                                    className="bg-gray-800 text-gray-100 px-4 py-2 rounded-lg">
                                    {participant}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={_startGame}
                            className={`w-full py-2 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 ${
                                loadingStartGame
                                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                    : "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500"
                            }`}
                            disabled={loadingStartGame}
                            style={{ marginTop: "1em" }}>
                            {loadingStartGame ? (
                                <div className="flex justify-center items-center">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        />
                                    </svg>
                                    <span className="ml-2 flex items-center">
                                        <AnimatedText text="Starting Game..." />
                                    </span>
                                </div>
                            ) : (
                                "Start Game"
                            )}
                        </button>
                        {loadingStartGame && randomTip && (
                            <p
                                className="text-gray-100 text-center mt-4"
                                style={{ marginBottom: "0px" }}>
                                Tip: {randomTip}
                            </p>
                        )}
                        {error && (
                            <p
                                className="text-red-500 text-center mt-4"
                                style={{ marginBottom: "0px" }}>
                                {error}
                            </p>
                        )}
                    </div>
                )}
            </div>
            <style>
                {`
                .loader {
                    border: 4px solid #f3f3f3; /* Light gray */
                    border-top: 4px solid #3b82f6; /* Blue */
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                }
                .dot-anim {
                    position: relative;
                    display: inline-block;
                }
                .dot-anim .dot-static {
                    z-index: 0;
                    opacity: 1;
                }
                .dot-anim .dot {
                    opacity: 0;
                    animation: dotFlashing 2s infinite linear;
                    font-weight: bold;
                    font-size: 1.2em;
                    display: inline-block;
                    z-index: 1;
                    position: relative;
                    color: #fff;
                }
                .dot-anim .dot:nth-child(1) { animation-delay: 0s; }
                .dot-anim .dot:nth-child(2) { animation-delay: 0.05s; }
                .dot-anim .dot:nth-child(3) { animation-delay: 0.1s; }
                @keyframes dotFlashing {
                    0% { opacity: 0; }
                    20% { opacity: 1; }
                    100% { opacity: 0; }
                }
                `}
            </style>
        </div>
    );
};

export default Host;
