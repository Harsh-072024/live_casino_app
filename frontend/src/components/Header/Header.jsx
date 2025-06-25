import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BalanceContext } from "../../context/BalanceContext";
import { AuthContext } from "../../context/AuthContext";
import { FiFileText, FiLock, FiList, FiLogOut, FiHome } from "react-icons/fi";
import "../../styles/Header.css"; // ✅ Import the new stylesheet

const Header = () => {
  const { balance, exposure } = useContext(BalanceContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const handleToggle = () => setMenuOpen(!menuOpen);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="home-icon mr-2">
          <FiHome />
        </Link>
        {user && (
          <div className="user-details">
            {/* <span>{user.username}</span> */}
            <span>Balance: ₹{parseFloat(balance).toFixed(2)}</span>
            <span>Exposure: ₹{parseFloat(exposure).toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="header-right">
        {user ? (
          <div className="user-menu">
            <button onClick={handleToggle} className="user-button">
              <span>{user.username}</span>
              <span>{menuOpen ? "▲" : "▼"}</span>
            </button>
            {menuOpen && (
              <div className="user-menu-dropdown">
                <Link to="/account-statement" onClick={() => setMenuOpen(false)}>
                  <FiFileText /> <span>Account Statement</span>
                </Link>
                <Link to="/change-password" onClick={() => setMenuOpen(false)}>
                  <FiLock /> <span>Change Password</span>
                </Link>
                <Link to="/bets" onClick={() => setMenuOpen(false)}>
                  <FiList /> <span>My Bets</span>
                </Link>
                <hr />
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                >
                  <FiLogOut /> <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
