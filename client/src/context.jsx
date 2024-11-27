import { createContext, useState } from "react";

export const GlobalData = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [isActiveUser, setIsActiveUser] = useState(null);

  const getUser = (user) => {
    setIsActiveUser(user);
  };
  return (
    <GlobalData.Provider value={{ getUser, isActiveUser }}>
      {children}
    </GlobalData.Provider>
  );
};
