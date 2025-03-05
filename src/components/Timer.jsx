import React, { useEffect } from "react";

const Timer = ({ timer, setTimer }) => {
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer, setTimer]);

  return <h3 className="mb-3">Next Draw in: {timer}s</h3>;
};

export default Timer;
