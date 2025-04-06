import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;

// Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "wikirace-79bde.firebaseapp.com",
  projectId: "wikirace-79bde",
  storageBucket: "wikirace-79bde.firebasestorage.app",
  messagingSenderId: "90797917790",
  appId: "1:90797917790:web:96780f8286f0bf273816cf",
  measurementId: "G-B25WSKJBTX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

/**
 * Creates a new game collection in the database with a unique UUID.
 * @returns {string} The UUID of the created game.
 */
export async function createGame() {
  const gameId = uuidv4();
  const gameRef = doc(db, "games", gameId);

  await setDoc(gameRef, {
    players: [], // Initialize players array
  });

  return gameId;
}

/**
 * Logs a visited Wikipedia link to the specified game in the database.
 * @param {string} gameId - The UUID of the game.
 * @param {string} link - The Wikipedia link to log.
 */
export async function logVisitedLink(gameId, link) {
  const gameRef = doc(db, "games", gameId);

  await updateDoc(gameRef, {
    visitedLinks: arrayUnion(link), // Add the link to the visitedLinks array
  });
}

/**
 * Retrieves the list of players in a specified game.
 * @param {string} gameId - The UUID of the game.
 * @returns {Promise<string[]>} A promise that resolves to an array of player names.
 */
export async function getPlayersInGame(gameId) {
  const gameRef = doc(db, "games", gameId);
  const gameDoc = await getDoc(gameRef);

  if (gameDoc.exists()) {
    const data = gameDoc.data();
    return data.players || []; // Return players array or an empty array if not present
  } else {
    throw new Error("Game not found");
  }
}

/**
 * Adds a player to the specified game.
 * @param {string} gameId - The UUID of the game.
 * @param {string} playerName - The name of the player to add.
 */
export async function addPlayerToGame(gameId, playerName) {
  const gameRef = doc(db, "games", gameId);

  await updateDoc(gameRef, {
    players: arrayUnion(playerName), // Add the player to the players array
  });
}

/**
 * Sets a join code for a specified game in the database.
 * @param {string} gameId - The UUID of the game.
 * @param {string} joinCode - The join code to associate with the game.
 */
export async function setGameJoinCode(gameId, joinCode) {
  const gameRef = doc(db, "games", gameId);

  await updateDoc(gameRef, {
    joinCode: joinCode, // Set the join code for the game
  });
}

/**
 * Retrieves a game ID using the join code.
 * @param {string} joinCode - The join code of the game.
 * @returns {Promise<string>} A promise that resolves to the game ID.
 */
export async function getGameByJoinCode(joinCode) {
  const gamesRef = collection(db, "games");
  const q = query(gamesRef, where("joinCode", "==", joinCode));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const gameDoc = querySnapshot.docs[0];
    return gameDoc.id; // Return the game ID
  } else {
    throw new Error("Game with the specified join code not found");
  }
}

/**
 * Joins a game using the join code by adding a player.
 * @param {string} joinCode - The join code of the game.
 * @param {string} playerName - The name of the player to add.
 */
export async function joinGameByJoinCode(joinCode, playerName) {
  const gameId = await getGameByJoinCode(joinCode);
  await addPlayerToGame(gameId, playerName);
}

/**
 * Starts the game by setting the game status to "started".
 * @param {string} gameId - The UUID of the game.
 */
export async function startGame(gameId) {
  const gameRef = doc(db, "games", gameId);

  await updateDoc(gameRef, {
    status: "started", // Set the game status to "started"
  });
}

/**
 * Retrieves the current state of a game using the join code.
 * @param {string} joinCode - The join code of the game.
 * @returns {Promise<Object>} A promise that resolves to the game state object.
 */
export async function getGameStateByJoinCode(joinCode) {
  const gameId = await getGameByJoinCode(joinCode); // Retrieve the game ID using the join code
  const gameRef = doc(db, "games", gameId);
  const gameDoc = await getDoc(gameRef);

  if (gameDoc.exists()) {
    return gameDoc.data().status; // Return the game state object
  } else {
    throw new Error("Game not found");
  }
}

/**
 * Sets the starting and ending Wikipedia pages for a game.
 * @param {string} gameId - The UUID of the game.
 */
export async function setStartAndEndPages(gameId) {
  const gameRef = doc(db, "games", gameId);

  // Function to get a random Wikipedia page title
  const getRandomPage = async () => {
    const response = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        action: "query",
        list: "random",
        rnnamespace: 0, // Only get pages in the main namespace
        rnlimit: 1, // Get one random page
        format: "json",
        origin: "*",
      },
    });

    return response.data.query.random[0].title; // Return the title of the random page
  };
  console.log("Getting random pages");

  // Get two random pages
  const startPage = await getRandomPage();
  const endPage = await getRandomPage();

  // Ensure the pages are not the same
  if (startPage === endPage) {
    return setStartAndEndPages(gameId);
  }

  // Update the game document with the starting and ending pages
  await updateDoc(gameRef, {
    startPage: startPage,
    endPage: endPage,
  });
}

/**
 * Sets the starting and ending Wikipedia pages for a game.
 * @param {string} gameId - The UUID of the game.
 */
export async function setFixedStartAndEndPages(gameId, startPage, endPage) {
  const gameRef = doc(db, "games", gameId);

  // Update the game document with the starting and ending pages
  await updateDoc(gameRef, {
    startPage: startPage,
    endPage: endPage,
  });
}

/**
 * Retrieves the starting and ending Wikipedia pages for a game using the join code.
 * @param {string} joinCode - The join code of the game.
 * @returns {Promise<Object>} A promise that resolves to an object containing the start and end pages.
 */
export async function getStartAndEndPagesByJoinCode(joinCode) {
  const gameId = await getGameByJoinCode(joinCode); // Retrieve the game ID using the join code
  const gameRef = doc(db, "games", gameId);
  const gameDoc = await getDoc(gameRef);

  if (gameDoc.exists()) {
    const data = gameDoc.data();
    return {
      startPage: data.startPage || null,
      endPage: data.endPage || null,
    };
  } else {
    throw new Error("Game not found");
  }
}

/**
 * Adds a page name to the VisitedLinks array in the game's data using the join code.
 * @param {string} joinCode - The join code of the game.
 * @param {string} playerName - The username of the player which is visiting the link.
 * @param {string} pageName - The name of the page to add.
 */
export async function addVisitedLinkByJoinCode(
  joinCode,
  playerName,
  pageName,
  endPage
) {
  const gameId = await getGameByJoinCode(joinCode); // Retrieve the game ID using the join code
  const gameRef = doc(db, "games", gameId);

  await updateDoc(gameRef, {
    [`visitedLinks_${playerName}`]: arrayUnion(pageName), // Add the page name to the VisitedLinks array
  });

  if (pageName === endPage) {
    await updateDoc(gameRef, {
      winner: playerName,
      status: "ended", // Set the game status to "ended"
    });
  }
}

/**
 * Retrieves the winner of a game using the join code.
 * @param {string} joinCode - The join code of the game.
 * @returns {Promise<string|null>} A promise that resolves to the winner's name or null if no winner.
 */
export async function getWinnerByJoinCode(joinCode) {
  const gameId = await getGameByJoinCode(joinCode); // Retrieve the game ID using the join code
  const gameRef = doc(db, "games", gameId);
  const gameDoc = await getDoc(gameRef);

  if (gameDoc.exists()) {
    const data = gameDoc.data();
    return data.winner || null; // Return the winner's name or null if no winner
  } else {
    throw new Error("Game not found");
  }
}

/**
 * Retrieves the visited links of all players in a game using the join code.
 * @param {string} joinCode - The join code of the game.
 * @returns {Promise<Object>} A promise that resolves to a dictionary where keys are player names and values are arrays of visited links.
 */
export async function getVisitedLinksByJoinCode(joinCode) {
  const gameId = await getGameByJoinCode(joinCode); // Retrieve the game ID using the join code
  const gameRef = doc(db, "games", gameId);
  const gameDoc = await getDoc(gameRef);

  if (gameDoc.exists()) {
    const data = gameDoc.data();
    const visitedLinks = {};

    // Extract all keys starting with "visitedLinks_" and map them to player names
    Object.keys(data).forEach((key) => {
      if (key.startsWith("visitedLinks_")) {
        const playerName = key.replace("visitedLinks_", "");
        visitedLinks[playerName] = data[key] || [];
      }
    });

    return visitedLinks;
  } else {
    throw new Error("Game not found");
  }
}
