import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameCard from "../components/GameCard";
import { useAuth } from "../context/AuthContext"; // Import AuthContext

const games = [
  {
    imageSrc: "https://dataobj.ecoassetsservice.com/casino-icons/lc/teen20.jpg",
    link: "/teenpatti",
  },
  {
    imageSrc: "https://dataobj.ecoassetsservice.com/casino-icons/lc/teen120.jpg",
    link: "/one-card",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth(); // Get the status from context

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login"); // ✅ Redirect only when NOT loading and NOT authenticated
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center text-center p-4 mt-20">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">

        {games.map((game, index) => (
          <GameCard key={index} imageSrc={game.imageSrc} link={game.link} />
        ))}
      </div>
    </div>
  );
};

export default Home;
