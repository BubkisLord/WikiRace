import React, { useState } from "react";
import TopNavbar from "../components/top_navbar";
import { getGameByJoinCode, joinGameByJoinCode } from "../database";

const Join = () => {
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [error, setError] = useState("");
  // const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(false);

  // React.useEffect(() => {
  //   if (loading) {
  //     const interval = setInterval(() => {
  //       const randomTip = tips[Math.floor(Math.random() * tips.length)];
  //       setTip(randomTip);
  //     }, 3000);

  //     return () => clearInterval(interval);
  //   } else {
  //     setTip("");
  //   }
  // }, [loading]);

  const handleJoinGame = () => {
    if (gameCode.length === 6 && playerName.trim() !== "") {
      setError("");
      setLoading(true);
      getGameByJoinCode(gameCode)
        .then((game_id) => {
          if (!game_id) {
            throw new Error("Game not found");
          }
          return joinGameByJoinCode(gameCode, playerName.trim());
        })
        .then(() => {
          localStorage.setItem("playerName", playerName.trim());
          window.location.href = `/game/${gameCode}`;
        })
        .catch((err) => {
          setError("Failed to join game. Please check the code and try again.");
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (gameCode.length === 6) {
      setError("You must enter in a player name.");
    } else {
      setError("Game code must be exactly 6 characters.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-600 flex flex-col">
      <TopNavbar
        navigation_items={[
          { name: "Dashboard", href: "/", current: false },
          { name: "Host", href: "/host", current: false },
          { name: "Join", href: "/join", current: true },
          { name: "Game History", href: "/game-history", current: false },
        ]}
      />
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-gray-700 shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-100 mb-4">Join a Game</h1>
          <p className="text-center text-gray-100 mb-6">
            Enter the 6-letter game code to join an existing game.
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
              type="text"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              placeholder="Enter Game Code"
              maxLength="6"
              className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleJoinGame}
              className={`w-full py-2 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 ${
                loading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500"
              }`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span className="ml-2">Joining...</span>
                </div>
              ) : (
                "Join Game"
              )}
            </button>
          </div>
          {/* {tip && <p className="text-gray-100 text-center mt-4">{tip}</p>} */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Join;
