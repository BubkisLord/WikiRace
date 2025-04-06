import React from "react";
import TopNavbar from "../components/top_navbar";
import UserStats from "../components/user_stats";


const Dashboard = () => {
  return (
    <div className="bg-gray-600 min-h-screen">
      <TopNavbar
        navigation_items={[
          { name: "Dashboard", href: "/", current: true },
          { name: "Host", href: "/host", current: false },
          { name: "Join", href: "/join", current: false },
          { name: "Game History", href: "/game-history", current: false },
        ]}
      />

      <UserStats stats={[
        { name: "Games Played", value: 0 },
        { name: "Games Won", value: 0 },
        { name: "Games Lost", value: 0 },
        { name: "Win Rate", value: "0%" },
        { name: "Average Score", value: 0 },
        { name: "Highest Score", value: 0 },
      ]}/>
    </div>
  );
};

export default Dashboard;
