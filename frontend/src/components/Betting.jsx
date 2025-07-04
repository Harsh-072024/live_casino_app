import { useContext, useState, useEffect } from "react";
import {
  notifySuccess,
  notifyError,
  notifyBetResult,
} from "../Utils/toastNotify.js";

import { BalanceContext } from "../context/BalanceContext";
import { axiosInstance } from "../lib/axios.js";

const predefinedBets = [100, 200, 500, 1000, 2000];

const Betting = ({ betOn, setBetOn, roundId, winner, user, timer, bettingOpen, gameType }) => {
  const { balance, setBalance, exposure, setExposure, fetchBalance } = useContext(BalanceContext);
  const [betAmount, setBetAmount] = useState(predefinedBets[0]);

  // ✅ Handle result when winner changes
  useEffect(() => {
  const handleResult = async () => {
    if (!winner || !betOn || exposure <= 0) return;

    const isWin = winner === betOn;
    const result = isWin ? "win" : "lose";

    notifyBetResult(result, exposure);
    await fetchBalance(user._id);

    setExposure(0);
    setBetOn(null);
    setBetAmount(predefinedBets[0]);
  };
  handleResult();
}, [winner]);


const placeBet = async (selection) => {
  if (!roundId) {
    return notifyError("Round not ready yet!");
  }
  if (!bettingOpen || timer <= 0) {
    return notifyError("Betting is closed for this round!");
  }
  if (!betAmount || betAmount <= 0 || isNaN(betAmount)) {
    return notifyError("Invalid bet amount!");
  }
  if (betAmount > balance) {
    return notifyError("Insufficient balance!");
  }

  try {
    await axiosInstance.post("/bets", {
      roundId,
      gameType,
      selection,
      amount: betAmount,
    });

    setBalance((prev) => prev - betAmount);
    setBetOn(selection);
    setExposure(betAmount);

    notifySuccess(`Bet on ${selection} placed!`);
  } catch (err) {
    console.error("Error placing bet:", err?.response?.data || err.message);
    notifyError(err?.response?.data?.error || "Error placing bet!");
  }
};




  const isDisabled = betOn || !bettingOpen || timer === 0;

  return (
    <div className="flex flex-col items-center mt-4">
      <input
        type="number"
        className="w-48 p-2 border border-gray-300 rounded-md text-center"
        value={betAmount}
        onChange={(e) => {
          const value = Number(e.target.value) || 0;
          setBetAmount(value > 0 ? value : 0);
        }}
        disabled={isDisabled}
        min="1"
      />

      <div className="flex flex-wrap justify-center gap-2 my-4">
        {predefinedBets.map((preAmount) => (
          <button
            key={preAmount}
            className={`px-4 py-2 rounded-md ${betAmount === preAmount ? "bg-green-500 text-white" : "bg-gray-300"}`}
            onClick={() => setBetAmount(preAmount)}
            disabled={isDisabled || preAmount > balance}
          >
            ₹{preAmount}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          className={`px-5 py-2 rounded-md font-semibold ${betOn === "A" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          onClick={() => placeBet("A")}
          disabled={isDisabled || betAmount > balance}
        >
          Bet on A
        </button>
        <button
          className={`px-5 py-2 rounded-md font-semibold ${betOn === "B" ? "bg-red-600 text-white" : "bg-gray-300"}`}
          onClick={() => placeBet("B")}
          disabled={isDisabled || betAmount > balance}
        >
          Bet on B
        </button>
      </div>
    </div>
  );
};

export default Betting;
