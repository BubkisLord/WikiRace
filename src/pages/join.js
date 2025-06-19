import React, { useEffect, useState } from "react";
import TopNavbar from "../components/top_navbar";
import {
    getGameByJoinCode,
    getGameState,
    getPlayersByJoinCode,
    getPlayersInGame,
    joinGameByJoinCode
} from "../database";

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

const Join = () => {
    const [playerName, setPlayerName] = useState("");
    const [gameCode, setGameCode] = useState("");
    const [error, setError] = useState("");
    const [participants, setParticipants] = useState([]);

    const [gameId, setGameId] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [inLobby, setInLobby] = useState(false);
    const [loading, setLoading] = useState(false);

    const [currentState, setCurrentState] = useState("");

    const handleJoinGame = async () => {
        if (gameCode.length === 6 && playerName.trim() !== "") {
            setError("");
            setLoading(true);
            try {
                const game_id = await getGameByJoinCode(gameCode);
                if (!game_id) {
                    throw new Error("Game not found");
                }
                const { gameId, players } = await joinGameByJoinCode(
                    gameCode,
                    playerName.trim()
                );
                if (gameId && players) {
                    const playersList = await getPlayersByJoinCode(gameCode);
                    setParticipants(playersList);
                    localStorage.setItem("gameCode", gameCode);
                    localStorage.setItem("gameId", gameId);
                    localStorage.setItem("playerName", playerName.trim());
                    setGameId(gameId);
                    setInLobby(true);
                    setJoinCode(gameCode);
                } else {
                    setError(gameId);
                }
            } catch (err) {
                setError(
                    "Failed to join game. Please check the code and try again."
                );
                console.error(err);
            } finally {
                setLoading(false);
            }
        } else if (gameCode.length === 6) {
            setError("You must enter in a player name.");
        } else {
            setError("Game code must be exactly 6 characters.");
        }
    };

    useEffect(() => {
        const fetchParticipants = async () => {
            if (inLobby && gameId) {
                try {
                    const players = await getPlayersInGame(gameId); // Fetch players from Firebase
                    setParticipants(players);
                } catch (error) {
                    console.error("Failed to fetch participants:", error);
                }
            }
        };

        const getGameStatus = async () => {
            getGameState(gameId)
                .then((gameState) => {
                    setCurrentState(gameState);
                    if (gameState === "started") {
                        setLoading(true);
                    } else if (gameState === "in_progress") {
                        window.location.href = `/game/${joinCode}`;
                    } else if (gameState === "ended") {
                        localStorage.removeItem("gameCode");
                        localStorage.removeItem("gameId");
                        localStorage.removeItem("playerName");
                        window.location.href = `/join`;
                    }
                })
                .catch((error) => {
                    console.error("Failed to get game state: ", error);
                });
        };

        const intervalId = setInterval(
            fetchParticipants && getGameStatus,
            2000
        ); // Fetch every 2 seconds

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [gameId]);

    return (
        <div className="min-h-screen bg-gray-600 flex flex-col">
            <TopNavbar
                navigation_items={[
                    { name: "Dashboard", href: "/", current: false },
                    { name: "Host", href: "/host", current: false },
                    { name: "Join", href: "/join", current: true },
                    {
                        name: "Game History",
                        href: "/game-history",
                        current: false
                    }
                ]}
            />
            {!inLobby && (
                <div className="flex flex-1 items-center justify-center">
                    <div className="bg-gray-700 shadow-lg rounded-lg p-8 w-full max-w-md">
                        <h1 className="text-2xl font-bold text-center text-gray-100 mb-4">
                            Join a Game
                        </h1>
                        <p className="text-center text-gray-100 mb-6">
                            Enter the 6-letter game code to join an existing
                            game.
                        </p>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter Player Name"
                                maxLength="20"
                                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                            />
                            <input
                                type="text"
                                value={gameCode}
                                onChange={(e) =>
                                    setGameCode(e.target.value.toUpperCase())
                                }
                                placeholder="GAME CODE"
                                maxLength="6"
                                className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono font-extrabold text-xl tracking-widest text-center transition-all duration-200 shadow-lg"
                                style={{
                                    textTransform: "uppercase",
                                    color: "#000",
                                    letterSpacing: "0.5em"
                                }}
                            />
                            <button
                                onClick={handleJoinGame}
                                className={`w-full py-2 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 ${
                                    loading
                                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                        : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
                                }`}
                                disabled={loading}>
                                {loading ? (
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
                                                strokeWidth="4"></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                        </svg>
                                        <span className="ml-2 flex items-center">
                                            <AnimatedText text="Joining..." />
                                        </span>
                                    </div>
                                ) : (
                                    <p>Join Game</p>
                                )}
                            </button>
                        </div>
                        {/* {tip && <p className="text-gray-100 text-center mt-4">{tip}</p>} */}
                        {error && (
                            <p className="text-red-500 text-center mt-4">
                                {error}
                            </p>
                        )}
                    </div>
                </div>
            )}
            {inLobby && (
                <div className="flex flex-1 items-center justify-center">
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
                            onClick={() => {}}
                            className={`w-full py-2 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 bg-gray-400 text-gray-200 cursor-not-allowed`}
                            disabled={true}
                            style={{ marginTop: "1em" }}>
                            {currentState == "starting" ? (
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
                                            strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                    </svg>
                                    <span className="ml-2 flex items-center">
                                        <AnimatedText text="Game Starting..." />
                                    </span>
                                </div>
                            ) : (
                                <AnimatedText text="Waiting for Host to Start..." />
                            )}
                        </button>
                        {error && (
                            <p
                                className="text-red-500 text-center mt-4"
                                style={{ marginBottom: "0px" }}>
                                {error}
                            </p>
                        )}
                    </div>
                </div>
            )}
            {/* Animated dots CSS */}
            <style>
                {`
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

export default Join;
