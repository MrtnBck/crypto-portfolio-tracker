import { useState, createContext, useEffect } from "react";

const PortfolioContext = createContext({
  assets: [],
  addAsset: () => {},
});

export function PortfolioContextProvider({ children }) {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const storedAssets = JSON.parse(localStorage.getItem("assets"));
    if (storedAssets && storedAssets.length) setAssets(storedAssets);
  }, []);

  function addAsset(newAsset) {
    setAssets((existingAssets) => {
      const updatedAssets = [...existingAssets, newAsset];

      //TODO: save in to the DB
      localStorage.setItem("assets", JSON.stringify(updatedAssets));
      return updatedAssets;
    });
  }

  const portfolioContext = {
    assets,
    addAsset,
  };

  return <PortfolioContext.Provider value={portfolioContext}>{children}</PortfolioContext.Provider>;
}

export default PortfolioContext;
