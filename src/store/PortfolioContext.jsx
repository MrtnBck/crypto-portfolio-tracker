import { createContext } from "react";

const PortfolioContext = createContext({});

export function PortfolioContextProvider({ children }) {
  const portfolioContext = {};

  return <PortfolioContext.Provider value={portfolioContext}>{children}</PortfolioContext.Provider>;
}

export default PortfolioContext;
