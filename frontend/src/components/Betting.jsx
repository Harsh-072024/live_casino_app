import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
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
      const winnings = isWin ? exposure * 2 : 0;

      toast[isWin ? "success" : "error"](
        isWin ? `🎉 You won ₹${winnings}!` : "❌ You lost the bet!",
        { position: "top-center" }
      );

      await fetchBalance(user._id);

      setExposure(0);
      setBetOn(null);
      setBetAmount(predefinedBets[0]);
    };
    handleResult();
  }, [winner]);

const placeBet = async (selection) => {
  if (!roundId) {
    toast.error("⛔ Round not ready yet!", { position: "top-center" });
    return;
  }
  if (!bettingOpen || timer <= 0) {
    toast.error("⚠️ Betting is closed for this round!", { position: "top-center" });
    return;
  }
  if (!betAmount || betAmount <= 0 || isNaN(betAmount)) {
    toast.error("⚠️ Invalid bet amount!", { position: "top-center" });
    return;
  }
  if (betAmount > balance) {
    toast.error("⚠️ Insufficient balance!", { position: "top-center" });
    return;
  }

  try {
    await axiosInstance.post("/bets", {
      roundId,
      gameType, // ✅ Use the actual passed prop
      selection,
      amount: betAmount,
    });
    setBalance((prev) => prev - betAmount);
    setBetOn(selection);
    setExposure(betAmount);
    toast.success(`🎰 Bet on ${selection} placed!`, {
      position: "top-center",
    });
  } catch (err) {
    console.error("❌ Error placing bet:", err?.response?.data || err.message);
    toast.error(`⚠ ${err?.response?.data?.error || "Error placing bet!"}`, {
      position: "top-center",
    });
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
