// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect , useRef} from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Added loading state
  const hasRestored = useRef(false);
  
  // 🔐 Login function
  const login = async ({ username, password }) => {
  try {
    await axiosInstance.post("/auth/login", {
      username,
      password
    });

    const me = await axiosInstance.get("/auth/me");
    // console.log("lgin user data",me.data.data)
    setUser(me.data.data);
    toast.success("Logged in");
    return me.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
    throw err;
  }
};
// console.log("user login", user )

  // 🔓 Logout function
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (_) {}
    setUser(null);
    toast.success("Logged out");
  };

  const isAuthenticated = !!user;

  // 🔄 On app mount: refresh accessToken and get user
   useEffect(() => {
    const restoreSession = async () => {
      try {
        await axiosInstance.post("/auth/refresh-token");
        const res = await axiosInstance.get("/auth/me");
        setUser(res.data.data);
      } catch (err) {
        setUser(null);
        toast.error("Session expired. Please log in again.");
      } finally {
        setLoading(false);
      }
    };
    if (!hasRestored.current) {
      hasRestored.current = true;
      restoreSession();
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        login,
        logout,
        loading, // ✅ Expose loading to consumers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
