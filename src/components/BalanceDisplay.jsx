import React from "react";

const BalanceDisplay = ({ balance, exposure }) => {
  return (
    <div className="text-center">
      <h3>Balance: ₹{balance}</h3>
      <h4>Exposure: ₹{exposure}</h4>
    </div>
  );
};

export default BalanceDisplay;
