import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth} from "../context/AuthContext";

const Login = () => {
  const { login , user} = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const loggedInUser = await login({ username, password }) // Get user object here
    // console.log(loggedInUser)

    if (loggedInUser.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/home");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
    console.error("Login error:", err);
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full mb-2"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
