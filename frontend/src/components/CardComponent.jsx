import React from "react";
import "../styles/CardComponent.css";

const CardComponent = ({ title, card, isWinner, onClick }) => {
  const isRedSuit = card?.suit === "♥" || card?.suit === "♦";
  const isCardEmpty = !card?.value;

  // Fallback for undefined or empty card
  if (!card || isCardEmpty) {
    return (
      <div
        className={`card-container ${isWinner ? "winner" : ""} card-empty`}
        onClick={onClick}
      >
        {/* {title && <div className="card-title">{title}</div>} */}
        <img
          src="https://opengameart.org/sites/default/files/card%20back%20black.png"
          alt="Back of card"
        />
      </div>
    );
  }

  return (
    <div
    className={`card-container ${isWinner ? "winner" : ""}`}
    onClick={onClick}
    >
      {/* {title && <div className="card-title">{title}</div>} */}
      <div className={`card-header ${isRedSuit ? "red-suit" : ""}`} >
        {card.suit}
      </div>
      <div className={`card-value ${isRedSuit ? "red-suit" : ""}`} >
        {card.value}
      </div>
      <div className={`card-footer ${isRedSuit ? "red-suit" : ""}`} >
        {card.suit}
      </div>
    </div>
  );
};

export default CardComponent;
