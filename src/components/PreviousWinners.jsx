import React from "react";

const PreviousWinners = ({ previousWinners }) => {
  return (
    <div className="mt-4 text-center">
      <h4>Previous Winners</h4>
      <div className="d-flex justify-content-center gap-2 flex-wrap">
        {previousWinners.map((winner, index) => (
          <span
            key={index}
            className={`px-3 py-1 rounded-pill text-white fw-bold ${
              winner === "Player A" ? "bg-primary" : "bg-danger"
            }`}
          >
            {winner === "Player A" ? "A" : "B"}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PreviousWinners;
