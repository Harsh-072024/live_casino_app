import React from "react";
import GameCard from "../components/GameCard";

const games = [
  { imageSrc: "https://dataobj.ecoassetsservice.com/casino-icons/lc/teen20.jpg", link: "/teenpatti" },
  { imageSrc: "https://dataobj.ecoassetsservice.com/casino-icons/lc/teen120.jpg", link: "/one-card" }
];

const Home = () => {
  return (
    <div className="w-full flex flex-col items-center text-center p-4 mt-20">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <GameCard key={index} imageSrc={game.imageSrc} link={game.link} />
        ))}
      </div>
    </div>
  );
};

export default Home;
