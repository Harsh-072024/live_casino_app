import React from "react";

const PreviousWinners = ({ previousWinners }) => {
  return (
    <div className="mt-4">
      <h4>Previous Winners</h4>
      <div className="d-flex gap-2">
        {previousWinners.map((winner, index) => (
          <span key={index} className="px-3 py-1 rounded-circle bg-danger text-white fw-bold">
            {winner}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PreviousWinners;
