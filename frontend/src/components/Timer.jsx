import React, { useEffect } from "react";

const Timer = ({ timer, setTimer, onTimeEnd }) => {
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    } else if (timer === 0 && typeof onTimeEnd === "function") {
      onTimeEnd();
    }
  }, [timer, setTimer, onTimeEnd]);

  return <h3 className="timer-text">Time left: {timer}</h3>;
};

export default Timer;
