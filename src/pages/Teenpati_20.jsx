import React, { useState, useEffect, useContext } from "react";
import { Button } from "reactstrap";
import TeenPattiCard from "../components/TeenPattiCard.jsx";
import Timer from "../components/Timer";
import PreviousWinners from "../components/PreviousWinners";
import Betting from "../components/Betting";
import { getThreeRandomCards, determineTeenPattiWinner } from  "../Utils/TeenPattiUtils.js";
import { BalanceContext } from "../context/BalanceContext.jsx";
import "./../styles/Teenpati_20.css";

const predefinedBets = [100, 200, 500, 1000, 2000];

const Teenpati_20 = () => {
  const [playerA, setPlayerA] = useState([]);
  const [playerB, setPlayerB] = useState([]);
  const [winner, setWinner] = useState("");
  const [previousWinners, setPreviousWinners] = useState([]);
  const [timer, setTimer] = useState(10);
  const [betOn, setBetOn] = useState(null);
  const { balance, setBalance, exposure, setExposure } = useContext(BalanceContext);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      generateTeenPattiCards();
    }
  }, [timer]);

  const generateTeenPattiCards = () => {
    console.log("Dealing cards...");
    const handA = getThreeRandomCards();
    const handB = getThreeRandomCards();

    setPlayerA([]);
    setPlayerB([]);
    setWinner("");

    setTimeout(() => setPlayerA([handA[0]]), 1000);
    setTimeout(() => setPlayerB([handB[0]]), 2000);
    setTimeout(() => setPlayerA((prev) => [...prev, handA[1]]), 3000);
    setTimeout(() => setPlayerB((prev) => [...prev, handB[1]]), 4000);
    setTimeout(() => setPlayerA((prev) => [...prev, handA[2]]), 5000);
    setTimeout(() => setPlayerB((prev) => [...prev, handB[2]]), 6000);

    setTimeout(() => {
      console.log("Player A:", handA);
      console.log("Player B:", handB);

      const gameWinner = determineTeenPattiWinner(handA, handB);
      setWinner(gameWinner);
      console.log(`Winner: ${gameWinner}`);

      setBalance((prev) => (betOn === gameWinner ? prev + exposure * 2 : prev));
      setExposure(0);
      console.log("Updated Exposure: ₹0");

      setPreviousWinners((prevWinners) => [gameWinner, ...prevWinners].slice(0, 7));

      setTimeout(() => {
        setBetOn(null);
        setTimer(10); // Reset timer for the next round
        console.log("New round starting...");
      }, 3000);
    }, 7000);
  };

  return (
    <div className="mt-20">
      <div className="teenpatti-container">
        <h3 className="timer-text">Time left: {timer}</h3>
        <div className="player-section">
          <div className="player-box">
            <h4>Player A</h4>
            <div className="card-group">
              {playerA.map((card, index) => (
                <TeenPattiCard key={index} card={card} isWinner={winner === "Player A"} />
              ))}
            </div>
          </div>

          <div className="player-box">
            <h4>Player B</h4>
            <div className="card-group">
              {playerB.map((card, index) => (
                <TeenPattiCard key={index} card={card} isWinner={winner === "Player B"} />
              ))}
            </div>
          </div>
        </div>

        <h3 className="winner-text">{winner ? `Winner: ${winner}` : ""}</h3>

        <PreviousWinners previousWinners={previousWinners} />

        <Betting
          balance={balance}
          setBalance={setBalance}
          exposure={exposure}
          setExposure={setExposure}
          betOn={betOn}
          setBetOn={setBetOn}
          timer={timer}
        />
      </div>
    </div>
  );
};

export default Teenpati_20;