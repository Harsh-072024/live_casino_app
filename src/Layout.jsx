import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BalanceProvider } from "./context/BalanceContext";

const Layout = () => {
  return (
    <BalanceProvider>
      <div className=" w-full min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow w-full p-4 bg-gray-100">
          <Outlet />
        </main>
        <Footer />
      </div>
    </BalanceProvider>
  );
};

export default Layout;
