import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

import Routers from "../router/Routers";

const Layout = () => {
  return (
      <div className=" w-full min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow w-full p-4 bg-gray-100">
          <Routers />
        </main>
        <Footer />
      </div>

  );
};

export default Layout;
