import React from "react";
import "../styles/Teenpati_20.css";

const TeenpattiCard = ({ card, isWinner }) => {
  
  if (!card) {
    return (
      <div className="teenpatti-card-container back-card">
        <img
          src="https://opengameart.org/sites/default/files/card%20back%20black.png"
          alt="back of card"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: "5px",
          }}
        />
      </div>
    );
  }

  const isRedSuit = card.suit === "♥" || card.suit === "♦"; // Check for red suits

  return (
    <div className={`teenpatti-card-container ${isWinner ? "winner-card" : ""}`} >
      <div
        className={`card-text ${isRedSuit ? "red-suit" : ""}`}
        style={{ fontSize: "18px" }}
      >
        {card.value} {card.suit}
      </div>
    </div>
  );
};

export default TeenpattiCard;
