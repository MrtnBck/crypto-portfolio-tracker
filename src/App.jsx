import axios from "axios";

import Portfolio from "./components/Portfolio";

const coinGeckoBaseUrl = "https://api.coingecko.com/api/v3";

const coinGeckoRequest = async (endpoint, params) => {
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
};

function App() {
  return (
    <>
      <header className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
        Crypto Portfolio Tracker
      </header>
      <main className="w-3/4 mx-auto mt-8">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => coinGeckoRequest("/coins/list", { query: e.target.value })}
        />
        <div className="flex flex-col max-w-sm mt-2 ">
          <button className="bg-amber-300 px-3 py-1 rounded-xl mb-2" onClick={() => coinGeckoRequest("/coins/list")}>
            Coin List
          </button>
          <button
            className="bg-amber-300 px-3 py-1 rounded-xl mb-2"
            onClick={() => coinGeckoRequest("/search", { query: "sol" })}
          >
            Search for Bitcoin
          </button>
        </div>
        <Portfolio />
      </main>
    </>
  );
}

export default App;
