import { useState, createContext, useEffect } from "react";

const PortfolioContext = createContext({
  assets: [],
  addAsset: () => {},
  removeAsset: () => {},
});

export function PortfolioContextProvider({ children }) {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    //TODO: get from the DB
    const storedAssets = JSON.parse(localStorage.getItem("assets"));
    if (storedAssets && storedAssets.length) setAssets(storedAssets);
  }, []);

  function addAsset(newAsset) {
    //console.log(newAsset);

    setAssets((existingAssets) => {
      const updatedAssets = [...existingAssets, newAsset];

      //TODO: save in to the DB
      localStorage.setItem("assets", JSON.stringify(updatedAssets));
      return updatedAssets;
    });
  }

  function removeAsset(id) {
    setAssets((existingAssets) => {
      const updatedAssets = existingAssets.filter((asset) => asset.id !== id);
      localStorage.setItem("assets", JSON.stringify(updatedAssets));
      return updatedAssets;
    });
  }

  const portfolioContext = {
    assets,
    addAsset,
    removeAsset,
  };

  return <PortfolioContext.Provider value={portfolioContext}>{children}</PortfolioContext.Provider>;
}

export default PortfolioContext;
