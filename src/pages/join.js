import React, { useState } from 'react';
import TopNavbar from '../components/top_navbar';
import { getGameByJoinCode, joinGameByJoinCode } from '../database';

const Join = () => {
    const [playerName, setPlayerName] = useState('');
    const [gameCode, setGameCode] = useState('');
    const [error, setError] = useState('');

    const handleJoinGame = () => {
        if (gameCode.length === 6) {
            setError('');
            getGameByJoinCode(gameCode)
                .then(game_id => {
                    if (!game_id) {
                        throw new Error('Game not found');
                    }
                    return joinGameByJoinCode(gameCode, playerName);
                })
                .then(() => {
                    localStorage.setItem('playerName', playerName);
                    // Optionally, redirect to the game page or update state
                    window.location.href = `/game/${gameCode}`;
                })
                .catch(err => {
                    setError('Failed to join game. Please check the code and try again.');
                    console.error(err);
                });
        } else {
            setError('Game code must be exactly 6 characters.');
        }
    };

    return (
        <div>
            <TopNavbar navigation_items={
                [
                    { name: 'Dashboard', href: '/', current: false },
                    { name: 'Host', href: '/host', current: false },
                    { name: 'Join', href: '/join', current: true },
                    { name: 'Game History', href: '/game-history', current: false },
                ]
            } />
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <h1>Join a Game</h1>
                <p>Enter the 6-letter game code to join an existing game.</p>
                <div style={{ marginTop: '20px' }}>
                    <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Enter Player Name"
                        maxLength="20"
                        style={{ padding: '10px', marginRight: '10px' }}
                    />
                    <input
                        type="text"
                        value={gameCode}
                        onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                        placeholder="Enter game code"
                        maxLength="6"
                        style={{ padding: '10px', marginRight: '10px', textTransform: 'uppercase' }}
                    />
                    <button
                        onClick={handleJoinGame}
                        style={{ padding: '10px 20px', cursor: 'pointer' }}
                    >
                        Join Game
                    </button>
                </div>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </div>
        </div>
    );
};

export default Join;