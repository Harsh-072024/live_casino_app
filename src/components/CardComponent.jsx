import React from "react";
import "../styles/CardComponent.css";

const CardComponent = ({ title, card, isWinner }) => {
  const isRedSuit = card.suit === "♥" || card.suit === "♦";
  const isCardEmpty = !card.value; // Check if card has no value

  return (
    <div className={`card-container ${isWinner ? "winner" : ""}`}>
      <div className="card-title">{title}</div> {/* Show "Card A" & "Card B" */}
      {isCardEmpty ? (
        <div className="waiting-text">Waiting...</div> // Show "Waiting..." before reveal
      ) : (
        <>
          <div className={`card-header ${isRedSuit ? "red-suit" : ""}`}>{card.suit}</div>
          <div className={`card-value ${isRedSuit ? "red-suit" : ""}`}>{card.value}</div>
          <div className={`card-footer ${isRedSuit ? "red-suit" : ""}`}>{card.suit}</div>
        </>
      )}
    </div>
  );
};

export default CardComponent;
