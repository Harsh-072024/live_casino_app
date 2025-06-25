import React from "react";

const PreviousWinners = ({ previousWinners }) => {
  // console.log("Rendering PreviousWinners:", previousWinners); // ✅ Log updated state

  return (
    <div className="mt-4 text-center">
      <h4>Previous Winners</h4>
      <div className="d-flex justify-content-center gap-2 flex-wrap">
        {previousWinners.map((winner, index) => (  // ✅ No need to spread
          <span
            key={index}
            className={`px-3 py-1 rounded-pill text-white fw-bold ${
              winner === "A" ? "bg-primary" : "bg-danger"
            }`}
          >
            {winner}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PreviousWinners;
