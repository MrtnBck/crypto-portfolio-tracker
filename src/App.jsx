import { useEffect, useState } from "react";

import Portfolio from "./components/Portfolio";
import SearchBar from "./components/SearchBar";
import FormCoin from "./components/FormCoin";

import { PortfolioContextProvider } from "./store/PortfolioContext"; // New import

/* const coinGeckoRequest = async (endpoint, params) => {
  const coinGeckoBaseUrl = "https://api.coingecko.com/api/v3";
  const options = {
    method: "GET",
    url: coinGeckoBaseUrl + endpoint,
    params: { x_cg_demo_api_key: import.meta.env.REACT_APP_COIN_GECKO_API_KEY, ...params },
    headers: { accept: "application/json" },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}; */

function App() {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);

  function addCoinToPortfolioHandler(coin) {
    setSelectedCoin(null);
    setPortfolio((existingPortfolio) => {
      const updatedPortfolio = [...existingPortfolio, coin];
      localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));
      return updatedPortfolio;
    });
  }

  function onCoinSelect(coin) {
    setSelectedCoin(coin);
  }

  function coinRemoveHandler(coinId) {
    setPortfolio((existingPortfolio) => {
      const updatedPortfolio = existingPortfolio.filter((coin) => coin.id !== coinId);
      localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));
      return updatedPortfolio;
    });
  }

  useEffect(() => {
    const storedPortfolio = JSON.parse(localStorage.getItem("portfolio"));

    storedPortfolio && setPortfolio(storedPortfolio);
  }, []);

  return (
    <PortfolioContextProvider>
      <header className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
        Crypto Portfolio Tracker
      </header>
      <main className="w-3/4 mx-auto mt-8">
        <SearchBar onSelect={onCoinSelect} />
        {selectedCoin && <FormCoin coin={selectedCoin} onAddMyCoin={addCoinToPortfolioHandler} />}
        <Portfolio items={portfolio} onRemove={coinRemoveHandler} />
      </main>
    </PortfolioContextProvider>
  );
}

export default App;
