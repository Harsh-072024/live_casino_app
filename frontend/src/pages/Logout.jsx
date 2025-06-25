import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 border rounded shadow bg-light text-center">
        <h3>Are you sure you want to logout?</h3>
        <Button color="danger" onClick={handleLogout} className="mt-3">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Logout;
