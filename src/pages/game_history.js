import React from "react";
import TopNavbar from "../components/top_navbar";

const GameHistory = () => {
  return (
    <div>
      <TopNavbar
        navigation_items={[
          { name: "Dashboard", href: "/", current: false },
          { name: "Host", href: "/host", current: false },
          { name: "Join", href: "/join", current: false },
          { name: "Game History", href: "/game-history", current: true },
        ]}
      />
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>Dashboard</h1>
        <p>
          Welcome to your dashboard! Here you can manage your activities and
          view insights.
        </p>
        <div style={{ marginTop: "20px" }}>
          <button
            style={{
              marginRight: "10px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            View Stats
          </button>
          <button style={{ padding: "10px 20px", cursor: "pointer" }}>
            Manage Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameHistory;
