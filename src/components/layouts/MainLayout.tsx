import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "../Navbar";

const MainLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="pt-10">
        <Outlet />
      </main>
      <Toaster position="top-center" />
    </>
  );
};

export default MainLayout;
