import React from "react";
import "@/styles/CardComponent.css";  // Use the alias for better path resolution


const CardComponent = ({ title, card, isWinner }) => {
  const isRedSuit = card.suit === "♥" || card.suit === "♦";

  return (
    <div className={`card-container ${isWinner ? "winner" : ""}`}>
      <div className={`card-header ${isRedSuit ? "red-suit" : ""}`}>{card.suit}</div>
      <div className={`card-value ${isRedSuit ? "red-suit" : ""}`}>{card.value}</div>
      <div className={`card-footer ${isRedSuit ? "red-suit" : ""}`}>{card.suit}</div>
    </div>
  );
};

export default CardComponent;
