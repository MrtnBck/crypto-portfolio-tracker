import axios from "axios";
import { useState, useEffect, useCallback } from "react";

import IconClose from "/public/icons/close.svg";

export default function Portfolio({ items, onRemove }) {
  const [coinsMarketData, setCoinsMarketData] = useState([]);
  let itemsSorted = [];
  if (items) {
    itemsSorted = items.sort((a, b) => {
      return a.market_cap_rank - b.market_cap_rank;
    });
  }

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

  function removeItem(coinId) {
    setCoinsMarketData(coinsMarketData.filter((coin) => coin.id !== coinId));
    onRemove(coinId);
  }

  function calculateAvarageBuyPrice(coinId) {
    const avaragePrice = items.find((item) => item.id === coinId).myAsset.avaragePrice;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(avaragePrice);
  }

  function editItem(coinId) {
    console.log("Edit item", coinId);
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ABP</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {itemsSorted.map((item) => (
            <tr key={item.id} className="group">
              {/* Ranks */}
              <td className="px-6 py-4 whitespace-nowrap flex items-center">
                <p>{item.market_cap_rank}</p>
              </td>
              {/* Coin */}
              <td className="px-6 py-4 whitespace-nowrap">
                <img src={item.thumb} alt={item.id} className="inline mr-2 w-6 h-6 rounded-full" />
                <p className="inline text-sm font-medium text-gray-900">{item.name}</p>
                <p className="inline text-sm text-gray-500"> ({item.symbol.toUpperCase()})</p>
              </td>
              {/* Price */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formattedPrice(item.id)}</td>
              {/* Allocation */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateAllocation(item.id)}</td>
              {/* Amount */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.myAsset.amount}</td>
              {/* ABP */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateAvarageBuyPrice(item.id)}</td>
              {/* Value */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateValue(item.id)}</td>
              <td className="w-[30px] px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex justify-end">
                <div className="flex items-center justify-end group">
                  <button
                    className="hidden mr-2 group-hover:flex bg-stone-400 w-[25px] h-[25px] text-white rounded cursor-pointer  items-center justify-center"
                    onClick={() => editItem(item.id)}
                  >
                    <p>Edit</p>
                  </button>

                  <button
                    className="hidden group-hover:flex  bg-red-600 w-[25px] h-[25px] text-white rounded cursor-pointer  items-center justify-center"
                    onClick={() => removeItem(item.id)}
                  >
                    <img src={IconClose} alt="remove" className="w-[15px] h-[15px]" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
