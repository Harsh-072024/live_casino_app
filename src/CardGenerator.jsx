import React, { useState, useEffect, useContext } from "react";
import { Button } from "reactstrap";
import CardComponent from "./components/CardComponent.jsx";
import WinnerDisplay from "./components/WinnerDisplay";
import Timer from "./components/Timer";
import PreviousWinners from "./components/PreviousWinners";
import Betting from "./components/Betting"; // Import Betting Component
import { BalanceContext } from "./context/BalanceContext.jsx";
import { getTwoRandomCards, determineWinner } from "./Utils/CardUtils.js";

const CardGenerator = () => {
  const [cards, setCards] = useState([{ suit: "", value: "" }, { suit: "", value: "" }]);
  const [winner, setWinner] = useState("");
  const [previousWinners, setPreviousWinners] = useState([]);
  const [timer, setTimer] = useState(10);
  const { balance, setBalance, exposure, setExposure } = useContext(BalanceContext);
  const [betOn, setBetOn] = useState(null);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      generateNewCards();
    }
  }, [timer]);

  const generateNewCards = () => {
    const [cardA, cardB] = getTwoRandomCards();
    setCards([cardA, { suit: "", value: "" }]); // Show Card A first

    setTimeout(() => {
      setCards([cardA, cardB]); // Show Card B after 2 seconds
      const newWinner = determineWinner(cardA, cardB);
      setWinner(newWinner);
      setTimer(10);

      setBalance((prevBalance) => {
        let updatedBalance = prevBalance;
        if (betOn && exposure > 0) {
          if (newWinner === betOn) {
            updatedBalance += exposure * 2;
          } else if (newWinner !== "Tie") {
            updatedBalance = Math.max(updatedBalance, 0);
          }
        }
        setExposure(0);
        return updatedBalance;
      });

      setPreviousWinners((prevWinners) => {
        const updatedWinners = [newWinner, ...prevWinners];
        return updatedWinners.length > 7 ? updatedWinners.slice(0, 7) : updatedWinners;
      });

      setTimeout(() => {
        setBetOn(null);
      }, 1000);
    }, 2000);
  };

  return (
    <div className="d-flex flex-column align-items-center mt-20">
      <Timer timer={timer} setTimer={setTimer} />

      <div className="d-flex gap-2">
        <CardComponent title="Card A" card={cards[0]} isWinner={winner === "A"} />
        <CardComponent title="Card B" card={cards[1]} isWinner={winner === "B"} />
      </div>

      <WinnerDisplay winner={winner === "A" ? "Winner: A" : winner === "B" ? "Winner: B" : "It's a Tie!"} />
      <PreviousWinners previousWinners={previousWinners} />

      {/* Reused Betting Component */}
      <Betting 
        balance={balance} 
        setBalance={setBalance} 
        exposure={exposure} 
        setExposure={setExposure} 
        betOn={betOn} 
        setBetOn={setBetOn} 
        timer={timer} 
      />

      <Button className="mt-2" color="primary" onClick={generateNewCards}>
        Generate New Cards
      </Button>
    </div>
  );
};

export default CardGenerator;
