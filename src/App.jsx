import { PortfolioContextProvider } from "./store/PortfolioContext";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./components/RootLayout";

import Home from "./pages/Home";
import NewCoin from "./pages/NewCoin";
import Portfolio from "./pages/Portfolio";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/new", element: <NewCoin /> },
      { path: "/portfolio", element: <Portfolio /> },
    ],
  },
]);

function App() {
  /*   function coinRemoveHandler(coinId) {
    setPortfolio((existingPortfolio) => {
      const updatedPortfolio = existingPortfolio.filter((coin) => coin.id !== coinId);
      localStorage.setItem("portfolio", JSON.stringify(updatedPortfolio));
      return updatedPortfolio;
    });
  } */
  return (
    <PortfolioContextProvider>
      <RouterProvider router={router} />
    </PortfolioContextProvider>
  );

  // return (
  //   <PortfolioContextProvider>
  //     <header className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
  //       Crypto Portfolio Tracker
  //     </header>
  //     <main className="w-3/4 mx-auto mt-8">
  //       <SearchBar onSelect={onCoinSelect} />
  //       {selectedCoin && <FormCoin coin={selectedCoin} onAddMyCoin={addCoinToPortfolioHandler} />}
  //       <Portfolio items={portfolio} onRemove={coinRemoveHandler} />
  //     </main>
  //
  // );
}

export default App;
