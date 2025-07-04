import React, { useContext } from "react";
import { BalanceContext } from "../context/BalanceContext.jsx";

const BalanceDisplay = () => {
  const { balance, exposure,} = useContext(BalanceContext);

  return (
    <div className="balance-display" style={{ textAlign: "justify-center", marginBottom: "20px" }}>
      <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        Balance: ₹{balance} | Exposure: ₹{exposure}
      </p>
    </div>
  );
};

export default BalanceDisplay;
