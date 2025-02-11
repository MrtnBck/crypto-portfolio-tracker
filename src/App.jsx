import axios from "axios";

const coinGeckoBaseUrl = "https://api.coingecko.com/api/v3";

const coinGeckoPing = async () => {
  const options = {
    method: "GET",
    url: coinGeckoBaseUrl + "/ping",
    params: { x_cg_demo_api_key: import.meta.env.REACT_APP_COIN_GECKO_API_KEY },
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
      <h1 className="text-3xl font-bold underline">Crypto Project Tracker App</h1>
      <button onClick={coinGeckoPing}>Ping Coin Gecko</button>
    </>
  );
}

export default App;
