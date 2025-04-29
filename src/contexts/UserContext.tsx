
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  language: 'en' | 'hi';
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateLanguage: (language: 'en' | 'hi') => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('fintrack_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // In a real app, this would validate against a backend
    // For demo, we'll validate against localStorage or use a dummy user
    const storedUsers = localStorage.getItem('fintrack_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    const foundUser = users.find((u: any) => u.email === email);
    
    if (foundUser && foundUser.password === password) {
      // Don't store the password in the user state
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('fintrack_user', JSON.stringify(userWithoutPassword));
      toast.success("Login successful!");
      return true;
    }
    
    toast.error("Invalid email or password");
    return false;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    // In a real app, this would call an API
    // For demo, we'll store in localStorage
    const storedUsers = localStorage.getItem('fintrack_users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      toast.error("Email already registered");
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      language: 'en' as const
    };
    
    // Update users in localStorage
    users.push(newUser);
    localStorage.setItem('fintrack_users', JSON.stringify(users));
    
    // Log in the user (without password in state)
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('fintrack_user', JSON.stringify(userWithoutPassword));
    
    // Initialize empty data structures for the user
    localStorage.setItem(`fintrack_expenses_${newUser.id}`, JSON.stringify([]));
    localStorage.setItem(`fintrack_savings_${newUser.id}`, JSON.stringify([]));
    localStorage.setItem(`fintrack_investments_${newUser.id}`, JSON.stringify([]));
    
    toast.success("Account created successfully!");
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fintrack_user');
    toast.success("Logged out successfully");
    // Note: We don't clear other data to allow the user to log back in
  };

  const updateLanguage = (language: 'en' | 'hi') => {
    if (user) {
      const updatedUser = { ...user, language };
      setUser(updatedUser);
      localStorage.setItem('fintrack_user', JSON.stringify(updatedUser));
      
      // Update language in users array too
      const storedUsers = localStorage.getItem('fintrack_users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((u: any) => 
          u.id === user.id ? { ...u, language } : u
        );
        localStorage.setItem('fintrack_users', JSON.stringify(updatedUsers));
      }
      
      toast.success(`Language changed to ${language === 'en' ? 'English' : 'Hindi'}`);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, signup, logout, updateLanguage }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
