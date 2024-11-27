import { createContext } from "react";

export const GlobalData = createContext();

export const GlobalContextProvider = ({ children }) => {
  return <GlobalData.Provider value={{}}>{children}</GlobalData.Provider>;
};
