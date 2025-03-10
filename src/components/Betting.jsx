import React, { useState } from "react";
import toast from "react-hot-toast";

const predefinedBets = [100, 200, 500, 1000, 2000];

const Betting = ({ balance, setBalance, exposure, setExposure, betOn, setBetOn, timer }) => {
  const [betAmount, setBetAmount] = useState(predefinedBets[0]); // Default bet amount

  const placeBet = (selection) => {
    if (timer === 0) {
      toast.error("⚠ Betting is closed! Wait for the next round.", { position: "top-center" });
      return;
    }
    if (balance <= 0) {
      toast.error("⚠ Insufficient balance! Please add money.", { position: "top-center" });
      return;
    }
    if (betAmount <= 0) {
      toast.error("⚠ Please enter a valid bet amount.", { position: "top-center" });
      return;
    }
    if (!betOn) {
      if (betAmount > balance) {
        toast.error("⚠ Bet amount exceeds balance! Please recharge.", { position: "top-center" });
        return;
      }
      setBetOn(selection);
      setExposure(betAmount);
      setBalance(balance - betAmount);
      
      toast.success(`🎰 Bet on ${selection} placed!`, {
        position: "top-center",
        duration: 2000,
        style: {
          background: "#22c55e",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: "8px",
          padding: "10px",
        },
      });
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      {/* Input for custom bet amount */}
      <input
        type="number"
        className="w-48 p-2 border border-gray-300 rounded-md text-center"
        placeholder="Enter bet amount"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        disabled={betOn || timer === 0}
      />

      {/* Predefined bet amount buttons */}
      <div className="flex flex-wrap justify-center gap-2 my-4">
        {predefinedBets.map((amount) => (
          <button
            key={amount}
            className={`px-4 py-2 rounded-md ${
              betAmount === amount ? "bg-green-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => setBetAmount(amount)}
            disabled={betOn || timer === 0}
          >
            ₹{amount}
          </button>
        ))}
      </div>

      {/* Bet buttons with amount display below */}
      <div className="flex gap-4">
        <div className="text-center">
          <button
            className={`px-5 py-2 rounded-md font-semibold ${
              betOn === "A" ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
            onClick={() => placeBet("A")}
            disabled={betOn || timer === 0}
          >
            Bet on A
          </button>
          {betOn === "A" && <div className="mt-1 text-green-500 font-bold">₹{betAmount}</div>}
        </div>

        <div className="text-center">
          <button
            className={`px-5 py-2 rounded-md font-semibold ${
              betOn === "B" ? "bg-red-600 text-white" : "bg-gray-300"
            }`}
            onClick={() => placeBet("B")}
            disabled={betOn || timer === 0}
          >
            Bet on B
          </button>
          {betOn === "B" && <div className="mt-1 text-red-500 font-bold">₹{betAmount}</div>}
        </div>
      </div>
    </div>
  );
};

export default Betting;
