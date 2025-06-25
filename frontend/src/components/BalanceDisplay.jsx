import React, { useContext } from "react";
import { BalanceContext } from "../context/BalanceContext.jsx";

const BalanceDisplay = () => {
  const { balance, exposure, addMoney } = useContext(BalanceContext);

  return (
    <div className="balance-display" style={{ textAlign: "justify-center", marginBottom: "20px" }}>
      <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
        Balance: ₹{balance} | Exposure: ₹{exposure}
      </p>
      {/* <button onClick={addMoney} className="btn btn-success">
        Add ₹500
      </button> */}
    </div>
  );
};

export default BalanceDisplay;
