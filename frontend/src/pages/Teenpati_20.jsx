import React, { useState, useEffect, useContext, useCallback } from "react";
import TeenpattiCard from "../components/TeenPattiCard.jsx";
import WinnerDisplay from "../components/WinnerDisplay.jsx";
import PreviousWinners from "../components/PreviousWinners.jsx";
import Betting from "../components/Betting.jsx";
import Timer from "../components/Timer.jsx";
import { BalanceContext } from "../context/BalanceContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import { axiosInstance } from "../lib/axios.js";
import socket from "../socket.js";
import { notifyBetResult, notifyError } from "../Utils/toastNotify.js";

const Teenpati_20 = () => {
  const [cardA, setCardA] = useState([]);
  const [cardB, setCardB] = useState([]);
  const [winner, setWinner] = useState("");
  const [previousWinners, setPreviousWinners] = useState([]);
  const [timer, setTimer] = useState(0);
  const [bettingOpen, setBettingOpen] = useState(false);
  const [roundId, setRoundId] = useState(null);

  const { balance, setBalance, exposure, setExposure, fetchBalance } =
    useContext(BalanceContext);
  const { user } = useContext(AuthContext);
  const [betOn, setBetOn] = useState(null);

  // ✅ 1️⃣ Fetch recent winners
  useEffect(() => {
    const fetchPreviousWinners = async () => {
      try {
        const res = await axiosInstance.get("/roundsTeenpatti/recent-winners");
        const winners = res.data.data.map((round) => round.winner);
        setPreviousWinners(winners);
      } catch (error) {
        console.error("Error fetching previous winners:", error);
      }
    };
    fetchPreviousWinners();
    const intervalId = setInterval(fetchPreviousWinners, 22000);
    return () => clearInterval(intervalId);
  }, []);

  // ✅ 2️⃣ Maintain previous winners
  const updatePreviousWinners = useCallback((newWinner) => {
    setPreviousWinners((prev) =>
      prev[0] !== newWinner ? [newWinner, ...prev].slice(0, 7) : prev
    );
  }, []);

  // ✅ 3️⃣ Balance update
const handleBalanceUpdate = useCallback(
  async (gameWinner) => {
    if (!user?._id || !betOn || exposure <= 0) return;

    try {
      const updatedBalance = await fetchBalance(user._id);

      const result =
        gameWinner === "tie"
          ? "tie"
          : gameWinner === betOn
          ? "win"
          : "lose";

      notifyBetResult(result, exposure, updatedBalance);
    } catch (err) {
      console.error("❌ Balance update failed:", err);
      notifyError("Failed to update balance");
    } finally {
      setExposure(0);
      setBetOn(null);
    }
  },
  [user, betOn, exposure, fetchBalance, setExposure, setBetOn]
);


  // ✅ 4️⃣ Socket listeners
  useEffect(() => {
    let intervalId;

    const handleBettingRound = (round) => {
      if (round.gameType !== "teenpatti") return;

      setRoundId(round.roundId);
      setCardA([]);
      setCardB([]);
      setWinner("");
      setBettingOpen(true);

      const endTime = round.roundStartTime + 20000;

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
      if (result.gameType !== "teenpatti") return;

      setCardA(Array.isArray(result.handA) ? result.handA : []);
      setCardB(Array.isArray(result.handB) ? result.handB : []);

      const formattedWinner =
        result.winner === "Player A"
          ? "A"
          : result.winner === "Player B"
          ? "B"
          : result.winner;

      setWinner(formattedWinner);
      updatePreviousWinners(formattedWinner);
      handleBalanceUpdate(formattedWinner);
    };
    socket.on("bettingRound", handleBettingRound);
    socket.on("roundResult", handleRoundResult);

    return () => {
      clearInterval(intervalId);
      socket.off("bettingRound", handleBettingRound);
      socket.off("roundResult", handleRoundResult);
    };
  }, [updatePreviousWinners, handleBalanceUpdate]);

  // ✅ 5️⃣ Restore user bet
  useEffect(() => {
    if (!user || !roundId) return;

    const fetchUserBet = async () => {
      try {
        const res = await axiosInstance.get(`/bets/user/${user._id}/round/${roundId}`);
        const bet = res.data;

        if (bet?.amount && bet?.selection) {
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
  }, [user, roundId, setExposure]);

  // ✅ 6️⃣ Get current round
  useEffect(() => {
    const fetchCurrentRound = async () => {
      try {
        const res = await axiosInstance.get("/roundsTeenpatti/current");
        const { roundId: currentRoundId, endTime } = res.data.data;

        if (currentRoundId && endTime) {
          setRoundId(currentRoundId);
          const secondsLeft = Math.max(
            0,
            Math.ceil((endTime - Date.now()) / 1000)
          );
          setBettingOpen(secondsLeft > 0);
          setTimer(secondsLeft);
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
    <div className="d-flex flex-column align-items-center mt-20">
      <Timer timer={timer} setTimer={setTimer} />
      <div className="d-flex gap-2">
        <div className="player-box">
          <h4>Card A</h4>
          <div className="card-group">
            {Array.from({ length: 3 }).map((_, index) => (
              <TeenpattiCard
                key={index}
                card={cardA[index] || null}
                isWinner={winner === "A"}
              />
            ))}
          </div>
        </div>
        <div className="player-box">
          <h4>Card B</h4>
          <div className="card-group">
            {Array.from({ length: 3 }).map((_, index) => (
              <TeenpattiCard
                key={index}
                card={cardB[index] || null}
                isWinner={winner === "B"}
              />
            ))}
          </div>
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
          gameType="teenpatti"
        />
      ) : (
        <p className="text-red-500 text-lg mt-4">
          Please log in to place bets.
        </p>
      )}
    </div>
  );
};

export default Teenpati_20;
