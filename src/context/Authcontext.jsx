import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Simulated User DB
const USER_KEY = "spike_users";
const SESSION_KEY = "spike_session";
const DEFAULT_USER = {
  id: 1,
  name: "Admin User",
  email: "test@sureze.com",
  password: "password123",
  role: "admin",
  avatar: "AU",
};

function getUsers() {
  try {
    const stored = localStorage.getItem(USER_KEY);
    let users = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(users)) users = [];

    // Ensure default admin always exists in the system
    if (
      !users.some(
        (u) => u.email.toLowerCase() === DEFAULT_USER.email.toLowerCase(),
      )
    ) {
      users = [DEFAULT_USER, ...users];
    }
    return users;
  } catch {
    return [DEFAULT_USER];
  }
}

function saveUsers(users) {
  localStorage.setItem(USER_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      // Basic validation: must be an object with an id
      return parsed && parsed.id ? parsed : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const clearError = () => setError("");

  // Register
  const register = async ({ name, email, password }) => {
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800)); // simulate API

    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      setError("An account with this email already exists.");
      setLoading(false);
      return false;
    }
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: "admin",
      avatar: name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);

    const session = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    setLoading(false);
    return true;
  };

  // Login
  const login = async ({ email, password }) => {
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800)); // simulate API

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const users = getUsers();
    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail && u.password === cleanPassword,
    );

    if (!foundUser) {
      setError("Invalid email or password.");
      setLoading(false);
      return false;
    }

    console.log("Login successful for:", foundUser.email);

    const session = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
      avatar: foundUser.avatar,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    setLoading(false);
    return true;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        clearError,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
