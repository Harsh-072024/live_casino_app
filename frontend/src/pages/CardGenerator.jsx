import React, { useState, useEffect, useContext, useCallback } from "react";

import { axiosInstance } from "../lib/axios.js";
import CardComponent from "../components/CardComponent.jsx";
import WinnerDisplay from "../components/WinnerDisplay.jsx";
import PreviousWinners from "../components/PreviousWinners.jsx";
import Betting from "../components/Betting.jsx";
import Timer from "../components/Timer.jsx";
import { BalanceContext } from "../context/BalanceContext.jsx";
import {useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "../socket.js";


const CardGenerator = () => {
  const [cards, setCards] = useState([
    { suit: "", value: "" },
    { suit: "", value: "" },
  ]);
  const [winner, setWinner] = useState("");
  const [previousWinners, setPreviousWinners] = useState([]);
  const [timer, setTimer] = useState(0);
  const [bettingOpen, setBettingOpen] = useState(false);
  const [roundKey, setRoundKey] = useState(0);
  const [roundId, setRoundId] = useState(null);

  const { balance, setBalance, exposure, setExposure, fetchBalance } =
    useContext(BalanceContext);
  const { user } = useAuth();
  const [betOn, setBetOn] = useState(null);

  useEffect(() => {
    const fetchPreviousWinners = async () => {
      try {
        const res = await axiosInstance.get("/rounds/recent-winners");
        const winners = res.data.data.map((round) => round.winner);
        setPreviousWinners(winners);
      } catch (error) {
        console.error("Error fetching previous winners:", error);
      }
    };

    // ✅ Do the initial fetch
    fetchPreviousWinners();

    // ✅ Then set up polling every 30 seconds
    const intervalId = setInterval(fetchPreviousWinners, 22000);

    // ✅ Cleanup interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const updatePreviousWinners = useCallback((newWinner) => {
    setPreviousWinners((prev) =>
      prev[0] !== newWinner ? [newWinner, ...prev].slice(0, 7) : prev
    );
  }, []);

  const handleBalanceUpdate = useCallback(
  async (newWinner) => {
    // console.log("handleBalanceUpdate called:", {
    //   user,
    //   betOn,
    //   exposure,
    //   newWinner,
    // });

    // ✅ Guard clause for invalid state
    if (!user?._id || !betOn || exposure <= 0) {
      // console.warn("Invalid state, skipping balance update.");
      return;
    }

    try {
      // console.log("Fetching balance for:", user._id);
      const updatedBalance = await fetchBalance(user._id);
      // console.log("Updated balance:", updatedBalance);

      // ✅ Outcome Messages
      if (newWinner === betOn) {
        const wonAmount = exposure * 2;
        toast.success(`🎉 You won ₹${wonAmount}! New Balance: ${updatedBalance}`, {
          position: "top-center",
        });
      } else if (newWinner === "tie") {
        toast.info("🤝 It's a tie! Bet refunded.", {
          position: "top-center",
        });
      } else {
        toast.error("❌ You lost the bet!", {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("❌ Balance update failed:", err);
      toast.error("⚠ Failed to update balance", {
        position: "top-center",
      });
    } finally {
      // ✅ Always reset bet and exposure
      setExposure(0);
      setBetOn(null);
    }
  },
  [user, betOn, exposure, fetchBalance, setExposure, setBetOn]
);


  // ✅ Socket Event Listeners
  useEffect(() => {
    let intervalId;

  const handleBettingRound = (round) => {
  if (round.gameType !== "two-card") return;

  setRoundId(round.roundId);
  setCards([
    { suit: "", value: "" },
    { suit: "", value: "" },
  ]);
  setWinner("");
  setRoundKey((prev) => prev + 1);
  setBettingOpen(true);

  const endTime = round.roundStartTime + 20000;

  clearInterval(intervalId);
  intervalId = setInterval(() => {
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
    setTimer(remaining);
    if (remaining <= 0) {
      clearInterval(intervalId);
      setBettingOpen(false);
    }
  }, 1000);
};

const handleRoundResult = (result) => {
  if (result.gameType !== "two-card") return;

  setCards([result.card1, result.card2]);
  setWinner(result.winner);
  updatePreviousWinners(result.winner);
  handleBalanceUpdate(result.winner);
  setRoundKey((prev) => prev + 1);
};

    socket.on("bettingRound", handleBettingRound);
    socket.on("roundResult", handleRoundResult);

    return () => {
      clearInterval(intervalId);
      socket.off("bettingRound", handleBettingRound);
      socket.off("roundResult", handleRoundResult);
    };
  }, [updatePreviousWinners, handleBalanceUpdate]);

  // ✅ Get bet data when user and roundId available
  useEffect(() => {
    if (!user || !roundId) return;

    const fetchUserBet = async () => {
      try {
        const res = await axiosInstance.get(
          `/bets/user/${user._id}/round/${roundId}`
        );
        const bet = res.data;

        if (bet && bet.amount && bet.selection) {
          console.log("✅ Bet restored:", bet);
          setExposure(bet.amount);
          setBetOn(bet.selection);
        } else {
          setExposure(0);
          setBetOn(null);
        }
      } catch (error) {
        if (error?.response?.status === 404) {
          setExposure(0);
          setBetOn(null);
        } else {
          console.error("Error fetching user bet:", error);
        }
      }
    };
    fetchUserBet();
  }, [user, roundId]);

  // ✅ NEW: Get Current Round Status
  useEffect(() => {
    const fetchCurrentRound = async () => {
  try {
    const res = await axiosInstance.get("/rounds/current");
    const { roundId: currentRoundId, endTime } = res.data.data;

    if (currentRoundId && endTime) {
      setRoundId(currentRoundId);

      const intervalId = setInterval(() => {
        const now = Date.now();
        const secondsLeft = Math.max(0, Math.ceil((endTime - now) / 1000));

        if (secondsLeft <= 0) {
          clearInterval(intervalId);
          setBettingOpen(false);
          setTimer(0);
        } else {
          setBettingOpen(true);
          setTimer(secondsLeft);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      setBettingOpen(false);
      setTimer(0);
    }
  } catch (error) {
    console.error("Error fetching current round:", error);
    setBettingOpen(false);
    setTimer(0);
  }
};

    fetchCurrentRound();
  }, []);

return (
  <div className="flex flex-col items-center mt-20">
    <Timer timer={timer} setTimer={setTimer} />

    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <h4 className="text-lg font-bold mb-2">Card A</h4>
        <CardComponent card={cards[0]} isWinner={winner === "A"} />
      </div>
      <div className="flex flex-col items-center">
        <h4 className="text-lg font-bold mb-2">Card B</h4>
        <CardComponent card={cards[1]} isWinner={winner === "B"} />
      </div>
    </div>

    <WinnerDisplay
      winner={
        winner === "A"
          ? "Winner: A"
          : winner === "B"
          ? "Winner: B"
          : winner === "tie"
            ? "It's a Tie!"
            : ""
      }
    />

    <PreviousWinners previousWinners={previousWinners} />

    {user ? (
      <Betting
        balance={balance}
        setBalance={setBalance}
        exposure={exposure}
        setExposure={setExposure}
        betOn={betOn}
        setBetOn={setBetOn}
        timer={timer}
        bettingOpen={bettingOpen}
        user={user}
        roundId={roundId}
        gameType="two-card"
      />
    ) : (
      <p className="text-red-500 text-lg mt-4">Please log in to place bets.</p>
    )}
  </div>
);


};

export default CardGenerator;
