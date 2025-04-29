
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useUser } from "@/contexts/UserContext";

const Layout = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  useEffect(() => {
    // Redirect to landing page if not logged in
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-6 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
