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
} from "../database"; // Import Firebase functions

const Host = () => {
  const [isHosting, setIsHosting] = useState(false);
  const [gameCode, setGameCode] = useState(""); // Replace public IP with game code
  const [playerName, setPlayerName] = useState("");
  const [participants, setParticipants] = useState([]);
  const [gameId, setGameId] = useState(""); // Store the game ID

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

  // Simulate adding participants (replace with real-time logic in production)
  const addParticipant = async () => {
    const newParticipant = `Participant ${participants.length + 1}`;
    setParticipants((prev) => [...prev, newParticipant]);

    // Add participant to Firebase
    if (gameId) {
      await addPlayerToGame(gameId, newParticipant);
    }
  };

  const startHosting = async () => {
    try {
      const newGameId = await createGame(); // Create a new game in Firebase
      setGameId(newGameId);
      setIsHosting(true);

      // Add the host to the game
      setParticipants([playerName]);
      await addPlayerToGame(newGameId, playerName);
    } catch (error) {
      console.error("Failed to start hosting:", error);
    }
  };

  const _startGame = async () => {
    if (participants.length >= 2) {
      await startGame(gameId);
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
    } else {
      alert("At least 2 participants are required to start the game.");
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
    <div className="bg-gray-600 min-h-screen">
      <TopNavbar
        navigation_items={[
          { name: "Dashboard", href: "/", current: false },
          { name: "Host", href: "/host", current: true },
          { name: "Join", href: "/join", current: false },
          { name: "Game History", href: "/game-history", current: false },
        ]}
      />
      <div className="p-4 text-white">
        {!isHosting && (
          <div className="mb-4">
            <label htmlFor="hostName" className="block mb-2">
              Enter your name:
            </label>
            <input
              type="text"
              id="hostName"
              className="px-4 py-2 rounded text-black"
              placeholder="Your name"
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>
        )}
      </div>
      <div className="p-4 text-white">
        {!isHosting ? (
          <button
            onClick={startHosting}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Start Hosting
          </button>
        ) : (
          <div>
            <p>Game Join Code: {gameCode || "Fetching..."}</p>
            <button
              onClick={addParticipant}
              className="bg-green-500 px-4 py-2 rounded mt-4"
            >
              Add Participant
            </button>
            <p className="mt-4">Participants:</p>
            <ul>
              {participants.map((participant, index) => (
                <li key={index}>{participant}</li>
              ))}
            </ul>
            <button
              onClick={_startGame}
              className="bg-red-500 px-4 py-2 rounded mt-4"
            >
              Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Host;
