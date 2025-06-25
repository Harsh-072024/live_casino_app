import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext"; // ✅ Import AuthContext
import {axiosInstance} from "../lib/axios.js"

const AdminRegister = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role is "user"
  const { user, token } = useContext(AuthContext); // ✅ Get token from context

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("Retrieved Token:", token); // ✅ Debugging Step

    if (!token) {
      console.error("No token found. Please log in as an admin first.");
      return;
    }

    if (!user || user.role !== "admin") {
      console.error("Access denied. Only admins can register new users.");
      return;
    }

    try {
      const { data } = await axiosInstance.post(
        "/auth/register",
        { username, password, role },
        { headers: { Authorization: `Bearer ${token}` } } // ✅ Use token from context
      );

      console.log("Admin registered successfully:", data);
    } catch (error) {
      console.error("Registration error:", error.response?.data?.message || error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">Admin Register</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
