import React, { useState } from "react";

const Betting = ({ onPlaceBet, balance, userBet, betAmount, exposure }) => {
  const [amount, setAmount] = useState("");

  const handleBet = (bet) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Enter a valid bet amount!");
      return;
    }
    onPlaceBet(bet, parseInt(amount));
    setAmount("");
  };

  return (
    <div className="mt-4 text-center">
      <h4>Balance: {balance} Points</h4>
      <h5>Exposure: {exposure} Points</h5>

      <input 
        type="number" 
        placeholder="Enter bet amount" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)}
        className="form-control w-50 mx-auto my-2"
      />

      <div className="d-flex gap-2 justify-content-center">
        <button className="btn btn-success" onClick={() => handleBet("A")}>Bet on A</button>
        <button className="btn btn-danger" onClick={() => handleBet("B")}>Bet on B</button>
      </div>
    </div>
  );
};

export default Betting;
