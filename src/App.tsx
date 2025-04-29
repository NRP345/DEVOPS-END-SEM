
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ExpenseTracker from "./pages/ExpenseTracker";
import SavingsTracker from "./pages/SavingsTracker";
import InvestmentTracker from "./pages/InvestmentTracker";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

// Components
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "./components/Layout";
import { UserProvider } from "./contexts/UserContext";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userLoggedIn = localStorage.getItem("fintrack_user");
    setIsLoggedIn(!!userLoggedIn);
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="fintrack-theme">
      <UserProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isLoggedIn ? <Dashboard /> : <Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/expenses" element={<ExpenseTracker />} />
              <Route path="/savings" element={<SavingsTracker />} />
              <Route path="/investments" element={<InvestmentTracker />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
