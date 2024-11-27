import { createContext, useEffect, useState } from "react";

export const GlobalData = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [activeUser, setActiveUser] = useState(() => {
    const storedUser = localStorage.getItem("activeUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (activeUser) {
      localStorage.setItem("activeUser", JSON.stringify(activeUser));
    } else {
      localStorage.removeItem(activeUser);
    }
  }, [activeUser]);

  const getUser = (user) => {
    setActiveUser(user);
  };
  const signOutUser = () => {
    setActiveUser(null);
  };
  return (
    <GlobalData.Provider
      value={{ getUser, activeUser, setActiveUser, signOutUser }}
    >
      {children}
    </GlobalData.Provider>
  );
};
