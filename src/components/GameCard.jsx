import React from "react";
import { Link } from "react-router-dom";

const GameCard = ({ imageSrc, link }) => {
  return (
    <Link to={link} className="p-4 bg-white shadow-lg rounded-lg text-center hover:scale-105 transition-transform duration-300">
      <img 
        src={imageSrc} 
        className="w-32 h-32 object-cover rounded-lg mb-2"
      />
    </Link>
  );
};

export default GameCard;
