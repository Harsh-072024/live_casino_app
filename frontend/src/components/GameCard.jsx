import React from "react";
import { Link } from "react-router-dom";

const GameCard = ({ imageSrc, link }) => {
  return (
    <Link
      to={link}
      className="aspect-square w-full max-w-[150px] bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
    >
      <img
        src={imageSrc}
        alt="Game"
        className="w-full h-full object-cover"
      />
    </Link>
  );
};

export default GameCard;
