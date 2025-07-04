import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { axiosInstance } from "../lib/axios.js";

const AdminRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState("");
  const [role, setRole] = useState("user");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user || user.role !== "admin") {
      setError("❌ Only admins can register new users.");
      return;
    }

    try {
      const { data } = await axiosInstance.post("/auth/register", {
        username,
        email,
        password,
        role,
        balance,
      });

      setSuccess(`✅ ${data.message}`);
      setUsername("");
      setEmail("");
      setPassword("");
      setBalance("");
      setRole("user");
    } catch (err) {
      setError(err.response?.data?.message || "❌ Registration failed.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">Admin Register</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="number"
          placeholder="Balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          className="border p-2 w-full mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 w-full mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white w-full p-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Register User
        </button>
      </form>
    </div>
  );
};

export default AdminRegister;
