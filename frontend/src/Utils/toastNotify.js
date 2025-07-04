// utils/toastNotify.js
import { toast } from 'react-toastify';

// 🎉 General Success
export const notifySuccess = (msg) => {
  toast.success(`✅ ${msg}`, {
    position: 'top-center',
    autoClose: 3000,
    pauseOnHover: true,
  });
};

// ❌ General Error
export const notifyError = (msg) => {
  toast.error(`❌ ${msg}`, {
    position: 'top-center',
    autoClose: 3000,
    pauseOnHover: true,
  });
};

// 🔔 Info Toast
export const notifyInfo = (msg) => {
  toast.info(`ℹ️ ${msg}`, {
    position: 'top-center',
    autoClose: 3000,
    pauseOnHover: true,
  });
};

// ⚠️ Warning Toast
export const notifyWarn = (msg) => {
  toast.warn(`⚠️ ${msg}`, {
    position: 'top-center',
    autoClose: 3000,
    pauseOnHover: true,
  });
};

// 🏆 Result-based feedback
export const notifyBetResult = (result, exposure, balance) => {
  if (result === "tie") {
    notifyInfo("It's a tie! Bet refunded.");
  } else if (result === "win") {
    notifySuccess(`You won ₹${exposure * 2}! New Balance: ₹${balance}`);
  } else {
    notifyError("You lost the bet.");
  }
};
