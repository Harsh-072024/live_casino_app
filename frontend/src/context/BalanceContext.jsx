import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext, useAuth } from "./AuthContext";
import { axiosInstance } from "../lib/axios.js";

export const BalanceContext = createContext();

const BalanceProvider = ({ children }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [exposure, setExposure] = useState(0); // ✅ Track exposure
  // console.log("authcontext user",user)
  useEffect(() => {
    if (user?._id) {
      fetchBalance();
    }
  }, [user]);

  const fetchBalance = async () => {
  try {
    const { data } = await axiosInstance.get("/users/balance"); 
    setBalance(data.data.balance);
    return data.data.balance; // ✅ IMPORTANT: Add this line
  } catch (error) {
    console.error("❌ Error fetching balance:", error?.response?.data?.message || error.message);
    return null;
  }
};


  const updateBalance = async (amount) => {
    if (user?.role !== "admin") return alert("Only admins can update balance");

    try {
      await axiosInstance.put(`/users/${user._id}/balance`, { amount }); // 👈 no need for manual headers
      fetchBalance();
    } catch (error) {
      console.error("Error updating balance:", error?.response?.data?.message || error.message);
    }
  };

  return (
    <BalanceContext.Provider
      value={{ balance, setBalance, exposure, setExposure, fetchBalance, updateBalance }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

export default BalanceProvider;
