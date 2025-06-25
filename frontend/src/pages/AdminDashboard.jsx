import { useState } from "react";
import { axiosInstance } from "../lib/axios.js";

const AdminDashboard = () => {
  const [userInput, setUserInput] = useState("");
  const [amount, setAmount] = useState("");
  const [deductAmount, setDeductAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdateBalance = async (isDeducting = false) => {
    if (!userInput.trim()) {
      setMessage("❌ Enter a valid user ID or username");
      
      return;
    }

    const value = isDeducting ? Number(deductAmount) : Number(amount);
    if (!value || value <= 0) {
      setMessage("❌ Enter a valid amount");
      return;
    }

    const isUsername = isNaN(userInput);
    const payload = {
      amount: value,
      ...(isUsername ? { username: userInput } : { userId: userInput }),
    };
    const apiUrl = isDeducting
      ? "/users/admin/user/deduct"
      : "/users/admin/user/add";

    try {
      const { data } = await axiosInstance.put(apiUrl, payload);
      setMessage(`✅ ${data.message}`);
      isDeducting ? setDeductAmount("") : setAmount("");
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || "Failed to update balance"}`);
    }
  };
  
  return (
    <div className="flex flex-col items-center p-4 sm:p-6 w-full max-w-md mx-auto bg-white shadow-lg rounded-lg mt-20">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Admin Dashboard</h2>

      <input
        type="text"
        placeholder="User ID or Username"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="border p-2 mb-2 w-full rounded-md"
      />

      <div className="mb-4 w-full text-center">
        <h3 className="text-lg font-semibold mb-2">Increase Balance</h3>
        <input
          type="number"
          placeholder="Amount to Add"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 mb-2 w-full rounded-md"
        />
        <button
          onClick={() => handleUpdateBalance(false)}
          className="bg-green-500 text-white p-2 rounded-md w-full hover:bg-green-600 transition"
        >
          Add Balance
        </button>
      </div>

      <div className="mb-4 w-full text-center">
        <h3 className="text-lg font-semibold mb-2">Deduct Balance</h3>
        <input
          type="number"
          placeholder="Amount to Deduct"
          value={deductAmount}
          onChange={(e) => setDeductAmount(e.target.value)}
          className="border p-2 mb-2 w-full rounded-md"
        />
        <button
          onClick={() => handleUpdateBalance(true)}
          className="bg-red-500 text-white p-2 rounded-md w-full hover:bg-red-600 transition"
        >
          Deduct Balance
        </button>
      </div>

      {message && (
        <p className="mt-4 text-lg text-center text-gray-700">{message}</p>
      )}
    </div>
  );
};

export default AdminDashboard;
