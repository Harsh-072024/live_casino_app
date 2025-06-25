import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";

import { useAuth } from "../context/AuthContext";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); // Store error messages
  const [success, setSuccess] = useState(""); // Store success messages
  const [loading, setLoading] = useState(false);
  const {logout} = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client‑side validations
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await axiosInstance.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      console.log("res.change", response.data);

      // ✅ Here it's a SUCCESS.
      setSuccess(response.data?.message || "Password updated successfully!");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      logout();
    } catch (err) {
      // ✅ Here it's an ERROR.
      setError(err.response?.data?.message || "An error occurred. Try again.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg bg-white shadow mt-20">
      <h1 className="text-3xl font-bold text-gray-800">Change Password</h1>
      <p className="mt-2 text-gray-600">
        Enter your current password and new password below:
      </p>

      {error && (
        <div className="bg-red-100 text-red-700 font-bold text-sm p-2 rounded mt-2">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 font-bold text-sm p-2 rounded mt-2">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full mt-1 p-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            placeholder="Re-enter new password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 p-2 rounded font-bold text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
