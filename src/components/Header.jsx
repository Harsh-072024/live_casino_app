import React, { useContext } from "react";
import { Link } from "react-router-dom"; // Import Link
import { BalanceContext } from "../context/BalanceContext";

const Header = () => {
  const { balance, exposure } = useContext(BalanceContext);

  return (
    <header className="w-full bg-blue-600 text-white p-4 flex justify-between items-center shadow-md fixed top-0 left-0 z-50">
      {/* Home Link */}
      <Link to="/" className="text-xl font-bold hover:text-gray-200">🏠</Link>

      <div className="flex gap-4">
        <span>💰 Balance: ₹{balance}</span>
        <span>🎲 Exposure: ₹{exposure}</span>
      </div>
    </header>
  );
};

export default Header;
