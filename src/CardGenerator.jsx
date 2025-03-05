import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import CardComponent from "./components/CardComponent.jsx";
import WinnerDisplay from "./components/WinnerDisplay";
import Timer from "./components/Timer";
import BalanceDisplay from "./components/BalanceDisplay";
import { getTwoRandomCards, determineWinner } from "./Utils/CardUtils.js"
import PreviousWinners from "./components/PreviousWinners";
import BetControls from "./components/BetControls";


const predefinedBets = [100, 200, 500, 1000, 2000];

const CardGenerator = () => {
  const [cards, setCards] = useState([{ suit: "", value: "" }, { suit: "", value: "" }]);
  const [winner, setWinner] = useState("");
  const [previousWinners, setPreviousWinners] = useState([]);
  const [timer, setTimer] = useState(10);
  const [balance, setBalance] = useState(1500);
  const [betAmount, setBetAmount] = useState(predefinedBets[0]);
  const [betOn, setBetOn] = useState(null);
  const [exposure, setExposure] = useState(0);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    } else {
      generateNewCards();
    }
  }, [timer]);

  const addMoney = () => {
    setBalance((prevBalance) => prevBalance + 500);
    alert("₹500 added to balance.");
  };

  const placeBet = (betSelection) => {
    if (balance <= 0) {
      alert("⚠ Insufficient balance! Please add money to continue playing.");
      return;
    }
    if (betAmount > 0 && !betOn) {
      if (betAmount > balance) {
        alert("⚠ Bet amount exceeds balance! Enter a lower amount.");
        return;
      }
      setBetOn(betSelection);
      setExposure(betAmount);
      setBalance(prevBalance => prevBalance - betAmount); // Deduct balance immediately after placing bet
    }
  };
  

  const generateNewCards = () => {
    const [cardA, cardB] = getTwoRandomCards();
    setCards([cardA, { suit: "", value: "" }]); // Show Card A immediately, Card B is empty
    
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
        setExposure(0); // Reset exposure after round
        return updatedBalance;
      });

      setPreviousWinners((prevWinners) => {
        const updatedWinners = [newWinner, ...prevWinners];
        return updatedWinners.length > 7 ? updatedWinners.slice(0, 7) : updatedWinners;
      });

      setTimeout(() => {
        setBetAmount(predefinedBets[0]);
        setBetOn(null);
      }, 1000);
    }, 2000);
  };

  return (
    <div className="d-flex flex-column align-items-center mt-2">
      <BalanceDisplay balance={balance} exposure={exposure} addMoney={addMoney} />
      <Timer timer={timer} setTimer={setTimer} />
      
      <div className="d-flex gap-2">
        <CardComponent title="Card A" card={cards[0]} isWinner={winner === "A"} />
        <CardComponent title="Card B" card={cards[1]} isWinner={winner === "B"} />
      </div>

      <WinnerDisplay winner={winner === "A" ? "Winner: A" : winner === "B" ? "Winner: B" : "It's a Tie!"} />
      <PreviousWinners previousWinners={previousWinners} />
      <BetControls 
        betAmount={betAmount} 
        setBetAmount={setBetAmount} 
        placeBet={placeBet} 
        betOn={betOn} 
        predefinedBets={predefinedBets} 
      />
      <div className="mt-2">
        {predefinedBets.map((amount) => (
          <Button key={amount} color="secondary" className="m-1" onClick={() => setBetAmount(amount)}>
            {amount}
          </Button>
        ))}
      </div>
      <Button className="mt-1" color="primary" onClick={generateNewCards}>Generate New Cards</Button>
    </div>
  );
};

export default CardGenerator;
