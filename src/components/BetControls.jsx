import React from "react";
import { Button } from "reactstrap";

const BetControls = ({ betAmount, setBetAmount, placeBet, betOn }) => {
  return (
    <div className="mt-3 d-flex flex-column align-items-center">
      <input
        type="number"
        placeholder="Enter Bet Amount"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
      />
      <div className="mt-2 d-flex gap-3">
        <Button color="success" onClick={() => placeBet("A")}>Bet on A</Button>
        <Button color="warning" onClick={() => placeBet("B")}>Bet on B</Button>
      </div>
      {betOn && <p className="mt-2">You bet ₹{betAmount} on {betOn}</p>}
    </div>
  );
};

export default BetControls;
