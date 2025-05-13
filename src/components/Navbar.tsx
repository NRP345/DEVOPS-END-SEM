
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Home, FileText, Wallet, TrendingUp, BarChart, User } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useUser();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Expenses", path: "/expenses", icon: FileText },
    { name: "Savings", path: "/savings", icon: Wallet },
    { name: "Investments", path: "/investments", icon: TrendingUp },
    { name: "Insights", path: "/insights", icon: BarChart },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <header className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 max-w-7xl mx-auto">
        <div className="mr-4 flex items-center">
          <NavLink to="/dashboard" className="flex items-center space-x-2">
            <Wallet className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">FinTrack</span>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <ul className="flex space-x-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    )
                  }
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <Button variant="outline" size="sm" onClick={logout}>
              Log out
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <div className="flex items-center space-x-2">
            <ModeToggle />
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-primary/5"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t animate-slide-in">
          <ul className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={toggleMobileMenu}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    )
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              </li>
            ))}
            <li className="px-3 py-3 mt-2 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout} 
                className="w-full justify-start"
              >
                Log out
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
