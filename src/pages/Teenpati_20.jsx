import React, { useState, useEffect, useContext } from "react";
import { Button } from "reactstrap";
import TeenpattiCard from "../components/TeenpattiCard.jsx";
import Timer from "../components/Timer";
import BalanceDisplay from "../components/BalanceDisplay";
import PreviousWinners from "../components/PreviousWinners";
import Betting from "../components/Betting";
import { getThreeRandomCards, determineTeenPattiWinner } from "../utils/TeenPattiUtils";
import { BalanceContext } from "../context/BalanceContext.jsx";
import "./../styles/Teenpati_20.css";

const predefinedBets = [100, 200, 500, 1000, 2000];

const Teenpati_20 = () => {
  const [playerA, setPlayerA] = useState([]);
  const [playerB, setPlayerB] = useState([]);
  const [winner, setWinner] = useState("");
  const [previousWinners, setPreviousWinners] = useState([]);
  const [timer, setTimer] = useState(10);
  const [betAmount, setBetAmount] = useState(predefinedBets[0]);
  const [betOn, setBetOn] = useState(null);
  const { balance, setBalance, exposure, setExposure } = useContext(BalanceContext);

  useEffect(() => {
    if (timer > 0 && betOn !== null) {
      const countdown = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0) {
      generateTeenPattiCards();
    }
  }, [timer, betOn]);

  const generateTeenPattiCards = () => {
    console.log("Dealing cards...");
    const handA = getThreeRandomCards();
    const handB = getThreeRandomCards();

    setPlayerA([]);
    setPlayerB([]);
    setWinner("");

    setTimeout(() => setPlayerA([handA[0]]), 2000);
    setTimeout(() => setPlayerB([handB[0]]), 4000);
    setTimeout(() => setPlayerA((prev) => [...prev, handA[1]]), 6000);
    setTimeout(() => setPlayerB((prev) => [...prev, handB[1]]), 8000);
    setTimeout(() => setPlayerA((prev) => [...prev, handA[2]]), 10000);
    setTimeout(() => setPlayerB((prev) => [...prev, handB[2]]), 12000);

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
        setBetAmount(predefinedBets[0]);
        setBetOn(null);
        setTimer(10);
        console.log("New round starting...");
      }, 3000);
    }, 14000);
  };

  return (
    <div className="mt-20">
    <div className="teenpatti-container">
      <Timer timer={timer} setTimer={setTimer} />

      <div className="player-section">
        <div className="player-box">
          <h4>Player A</h4>
          <div className="card-group">
            {playerA.map((card, index) => (
              <TeenpattiCard key={index} card={card} isWinner={winner === "Player A"} />
            ))}
          </div>
        </div>

        <div className="player-box">
          <h4>Player B</h4>
          <div className="card-group">
            {playerB.map((card, index) => (
              <TeenpattiCard key={index} card={card} isWinner={winner === "Player B"} />
            ))}
          </div>
        </div>
      </div>

      <h3 className="winner-text">{winner ? `Winner: ${winner}` : ""}</h3>

      <PreviousWinners previousWinners={previousWinners} />

      {/* Using Betting Component */}
      <Betting
        balance={balance}
        setBalance={setBalance}
        exposure={exposure}
        setExposure={setExposure}
        betOn={betOn}
        setBetOn={setBetOn}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
      />

      {/* <Button className="mt-1" color="primary" onClick={generateTeenPattiCards}>
        Generate New Cards
      </Button> */}
    </div>
    </div>
  );
};

export default Teenpati_20;
