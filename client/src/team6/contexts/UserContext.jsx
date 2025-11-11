import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("loggedUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const saved = sessionStorage.getItem("loggedUser");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const logout = () => {
    sessionStorage.removeItem("loggedUser");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
