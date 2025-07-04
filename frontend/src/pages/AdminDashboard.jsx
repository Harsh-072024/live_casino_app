import { useState, useContext } from "react";
import { axiosInstance } from "../lib/axios.js";
import { AuthContext } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom"; // ✅ Import Link

const AdminDashboard = () => {
  const { token, user } = useContext(AuthContext);

  const [userInput, setUserInput] = useState("");
  const [amount, setAmount] = useState("");
  const [deductAmount, setDeductAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdateBalance = async (isDeducting = false) => {
    if (!user || user.role !== "admin") return setMessage("❌ Unauthorized");

    if (!userInput.trim()) return setMessage("❌ Enter a valid user ID or username");

    const value = isDeducting ? Number(deductAmount) : Number(amount);
    if (!value || value <= 0) return setMessage("❌ Enter a valid amount");

    const isUsername = isNaN(userInput);
    const payload = {
      amount: value,
      ...(isUsername ? { username: userInput } : { userId: userInput }),
    };

    const apiUrl = isDeducting
      ? "/users/admin/user/deduct"
      : "/users/admin/user/add";

    try {
      const { data } = await axiosInstance.put(apiUrl, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(`✅ ${data.message}`);
      isDeducting ? setDeductAmount("") : setAmount("");
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || "Failed to update balance"}`);
    }
  };

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
    <div className="w-full max-w-md bg-white/30 backdrop-blur-lg shadow-xl rounded-2xl p-6 border border-white/20">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        🛠 Admin Dashboard
      </h2>

      <input
        type="text"
        placeholder="Username"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {/* Add Balance */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">💰 Add Balance</h3>
        <input
          type="number"
          placeholder="Amount to Add"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-3 rounded-lg w-full mb-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={() => handleUpdateBalance(false)}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg w-full transition-transform active:scale-95"
        >
          ➕ Add Balance
        </button>
      </div>

      {/* Deduct Balance */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">💸 Deduct Balance</h3>
        <input
          type="number"
          placeholder="Amount to Deduct"
          value={deductAmount}
          onChange={(e) => setDeductAmount(e.target.value)}
          className="border p-3 rounded-lg w-full mb-2 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        <button
          onClick={() => handleUpdateBalance(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg w-full transition-transform active:scale-95"
        >
          ➖ Deduct Balance
        </button>
      </div>

      {/* Admin Register Link */}
      <Link
        to="/admin-register"
        className="block bg-indigo-500 hover:bg-indigo-600 text-white text-center py-2 rounded-lg transition-colors"
      >
        🧑‍💻 Go to Admin Register
      </Link>

      {/* Message */}
      {message && (
        <p className="mt-6 text-center text-sm text-gray-800 font-medium">
          {message}
        </p>
      )}
    </div>
  </div>
);

};

export default AdminDashboard;
