import { createContext, useState } from "react";

export const BalanceContext = createContext();

export const BalanceProvider = ({ children }) => {
  const [balance, setBalance] = useState(1500);
  const [exposure, setExposure] = useState(0);

  return (
    <BalanceContext.Provider value={{ balance, setBalance, exposure, setExposure }}>
      {children}
    </BalanceContext.Provider>
  );
};
