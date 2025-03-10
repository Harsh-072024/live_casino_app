import React from "react";
import "./../styles/Teenpati_20.css";

const TeenpattiCard = ({ card, isWinner }) => {
  if (!card || !card.suit || !card.value) return <div className="teenpatti-card-placeholder"></div>; 

  const isRedSuit = card.suit === "♥" || card.suit === "♦";

  return (
    <div className={`teenpatti-card-container ${isWinner ? "winner-card" : ""}`}>
      <div className={`teenpatti-card-header ${isRedSuit ? "red-suit" : ""}`}>
        {card.suit}
      </div>
      <div className={`teenpatti-card-value ${isRedSuit ? "red-suit" : ""}`}>
        {card.value}
      </div>
      <div className={`teenpatti-card-footer ${isRedSuit ? "red-suit" : ""}`}>
        {card.suit}
      </div>
    </div>
  );
};

export default TeenpattiCard;
