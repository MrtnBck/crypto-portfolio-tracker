import axios from "axios";
import { useState, useEffect, useCallback } from "react";

export default function Portfolio({ items }) {
  const [coinsMarketData, setCoinsMarketData] = useState([]);

  const itemsSorted = items.sort((a, b) => {
    return a.market_cap_rank - b.market_cap_rank;
  });

  const fetchCoinsMarketData = useCallback(async () => {
    const coinGeckoBaseUrl = "https://api.coingecko.com/api/v3";

    const coinIds = items.map((item) => item.id).join(",");
    if (coinIds.length === 0) return;

    const options = {
      method: "GET",
      url: coinGeckoBaseUrl + "/coins/markets",
      params: {
        vs_currency: "usd",
        ids: coinIds,
        x_cg_demo_api_key: import.meta.env.REACT_APP_COIN_GECKO_API_KEY,
      },
      headers: { accept: "application/json" },
    };

    try {
      const response = await axios.request(options);

      console.log(response.data);
      setCoinsMarketData(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [items]);

  useEffect(() => {
    fetchCoinsMarketData();
    const coinFetchInterval = setInterval(fetchCoinsMarketData, 60000);

    return () => clearInterval(coinFetchInterval);
  }, [fetchCoinsMarketData]);

  function formattedPrice(coinId) {
    const coin = coinsMarketData.find((coin) => coin.id === coinId);
    if (!coin) return "N/A";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(coin.current_price);
  }

  function calculateValue(coinId) {
    const coin = coinsMarketData.find((coin) => coin.id === coinId);
    if (!coin) return "N/A";

    const myAsset = items.find((item) => item.id === coinId).myAsset;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(coin.current_price * myAsset.amount);
  }

  function calculateAllocation(coinId) {
    const coin = coinsMarketData.find((coin) => coin.id === coinId);
    if (!coin) return "N/A";

    const myAsset = items.find((item) => item.id === coinId).myAsset;

    const totalPortfolioValue = coinsMarketData.reduce((acc, coin) => {
      const myAsset = items.find((item) => item.id === coin.id).myAsset;
      return acc + coin.current_price * myAsset.amount;
    }, 0);

    const allocation = ((coin.current_price * myAsset.amount) / totalPortfolioValue) * 100;

    return `${allocation.toFixed(2)}%`;
  }

  return (
    <>
      <h3>Balances ({items.length})</h3>
      <table className="w-full mt-2 divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Allocation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {itemsSorted.map((item) => (
            <tr key={item.id}>
              {/* Ranks */}
              <td className="px-6 py-4 whitespace-nowrap flex items-center">
                <p>{item.market_cap_rank}</p>
              </td>
              {/* Coin */}
              <td className="px-6 py-4 whitespace-nowrap ">
                <img src={item.thumb} alt={item.id} className="mr-2 w-6 h-6 rounded-full" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.symbol.toUpperCase()}</div>
                </div>
              </td>
              {/* Price */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formattedPrice(item.id)}</td>
              {/* Allocation */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateAllocation(item.id)}</td>
              {/* Amount */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.myAsset.amount}</td>
              {/* Value */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateValue(item.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
