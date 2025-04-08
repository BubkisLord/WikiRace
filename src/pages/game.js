import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getGameStateByJoinCode,
  getStartAndEndPagesByJoinCode,
  getVisitedLinksByJoinCode,
  getWinnerByJoinCode,
} from "../database";
import WikipediaNavigator from "../components/wiki_nav";

const GamePage = () => {
  const { joinCode } = useParams(); // Extract joinCode from the URL
  const [gameStatus, setGameStatus] = useState(null);

  const [pages, setPages] = useState({ startPage: "", endPage: "" });

  const [playerPaths, setPlayerPaths] = useState(null);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    const fetchStartAndEndPages = async () => {
      try {
        const fetchedPages = await getStartAndEndPagesByJoinCode(joinCode);
        setPages(fetchedPages);
      } catch (error) {
        console.error("Error fetching start and end pages:", error);
      }
    };

    fetchStartAndEndPages();
  }, [joinCode]);

  useEffect(() => {
    const fetchGameStatus = async () => {
      try {
        const status = await getGameStateByJoinCode(joinCode); // Fetch game status using joinCode
        setGameStatus(status);
      } catch (error) {
        console.error("Error fetching game status:", error);
      }
    };

    fetchGameStatus();
  }, [joinCode]);

  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 4 ? prevDots + "." : ""));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (gameStatus !== "started" && gameStatus !== "ended") {
      const interval = setInterval(async () => {
        try {
          const status = await getGameStateByJoinCode(joinCode);
          if (status === "started") {
            setPages(await getStartAndEndPagesByJoinCode(joinCode));
            setGameStatus("started");
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Error checking game status:", error);
        }
      }, 250); // Check every 0.25 seconds

      return () => clearInterval(interval);
    }
  }, [gameStatus, joinCode]);

  useEffect(() => {
    if (gameStatus === "started") {
      const interval = setInterval(async () => {
        try {
          const status = await getGameStateByJoinCode(joinCode);
          if (status === "ended") {
            clearInterval(interval);
            setWinner(await getWinnerByJoinCode(joinCode));
            setPlayerPaths(await getVisitedLinksByJoinCode(joinCode));
            setGameStatus("ended");
          }
        } catch (error) {
          console.error("Error checking game status:", error);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [gameStatus, joinCode]);

  const renderContent = () => {
    if (gameStatus === "ended") {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 text-gray-100">
          <h1 className="text-4xl font-bold mb-6">Game Over!</h1>
          <h2 className="text-2xl font-semibold mb-4">Winner: {winner}</h2>
          <div className="w-full max-w-4xl bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Player Paths:</h3>
            <ul className="space-y-4">
              {playerPaths &&
                Object.entries(playerPaths).map(([player, path], index) => (
                  <li key={index} className="bg-gray-700 p-3 rounded-lg">
                    <p className="font-semibold">{player}:</p>
                    <p className="text-sm text-gray-300">{path.join(" → ")}</p>
                  </li>
                ))}
            </ul>
          </div>
          <button
            onClick={() => (window.location.href = "/")}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Back to Main Page
          </button>
        </div>
      );
    }

    if (gameStatus !== "started" || !pages.endPage) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-700">
          <h2 className="text-6xl font-extrabold text-gray-100 text-center">
            {gameStatus === "started" && !pages.endPage ? "Getting Game Info" : "Waiting for the game to start"}
            <span className="inline-block w-8 text-left">{dots}</span>
          </h2>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
        <header className="w-full bg-blue-600 text-gray-100 py-4 shadow-md">
          <h1 className="text-center text-2xl font-bold">
            Target Page: {pages["endPage"]}
          </h1>
        </header>
        <main className="flex-grow w-full p-4">
          <WikipediaNavigator
            playerName={localStorage.getItem("playerName")}
            joinCode={joinCode}
            startPage={pages["startPage"]}
            endPage={pages["endPage"]}
          />
        </main>
        <footer className="w-full bg-gray-800 text-white py-2 text-center">
          <p className="text-sm">Wiki Race Game by BubkisLord</p>
        </footer>
      </div>
    );
  };

  return renderContent();
};

export default GamePage;
