import axios from "axios";

import { useState, useEffect, useContext } from "react";

import IconClose from "/public/icons/close.svg";

import PortfolioContext from "../store/PortfolioContext";

export default function Portfolio() {
  const { assets, removeAsset } = useContext(PortfolioContext);

  const [sortedAssets, setSortedAssets] = useState([]);
  const [coinsMarketData, setCoinsMarketData] = useState([]);

  useEffect(() => {
    async function fetchCoinsMarketData(assets) {
      const coinGeckoBaseUrl = "https://api.coingecko.com/api/v3";

      const coinIds = assets.map((item) => item.id).join(",");
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

        //console.log(response.data);
        setCoinsMarketData(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    const sorted = [...assets].sort((a, b) => a.market_cap_rank - b.market_cap_rank);
    setSortedAssets(sorted);

    fetchCoinsMarketData(sorted);
    const coinFetchInterval = setInterval(() => {
      fetchCoinsMarketData(sorted);
    }, 1 * 60 * 1000);

    return () => clearInterval(coinFetchInterval);
  }, [assets]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  function formattedPrice(coinId) {
    const coin = coinsMarketData.find((coin) => coin.id === coinId);
    if (!coin) return "N/A";

    return formatCurrency(coin.current_price);
  }

  function calculateValue(coinId) {
    const coin = coinsMarketData.find((coin) => coin.id === coinId);
    if (!coin) return "N/A";

    const myAsset = sortedAssets.find((item) => item.id === coinId).myAsset;
    return formatCurrency(coin.current_price * myAsset.amount);
  }

  function calculateAllocation(coinId) {
    const coin = coinsMarketData.find((coin) => coin.id === coinId);
    if (!coin) return "N/A";

    const myAsset = sortedAssets.find((item) => item.id === coinId).myAsset;

    const totalPortfolioValue = coinsMarketData.reduce((acc, coin) => {
      const myAsset = sortedAssets.find((item) => item.id === coin.id).myAsset;
      return acc + coin.current_price * myAsset.amount;
    }, 0);

    const allocation = ((coin.current_price * myAsset.amount) / totalPortfolioValue) * 100;

    return `${allocation.toFixed(2)}%`;
  }

  function calculateAvarageBuyPrice(coinId) {
    const avaragePrice = sortedAssets.find((item) => item.id === coinId).myAsset.avaragePrice;
    return formatCurrency(avaragePrice);
  }

  function removeAssetHandler(coinId) {
    setCoinsMarketData(coinsMarketData.filter((coin) => coin.id !== coinId));
    removeAsset(coinId);
  }

  function editAsset(coinId) {
    console.log("Edit item", coinId);
  }

  return (
    <>
      <h3>Balances ({sortedAssets.length})</h3>
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
          {sortedAssets.map((asset) => (
            <tr key={asset.id} className="group">
              {/* Ranks */}
              <td className="px-6 py-4 whitespace-nowrap flex items-center">
                <p>{asset.market_cap_rank}</p>
              </td>
              {/* Coin */}
              <td className="px-6 py-4 whitespace-nowrap">
                <img src={asset.thumb} alt={asset.id} className="inline mr-2 w-6 h-6 rounded-full" />
                <p className="inline text-sm font-medium text-gray-900">{asset.name}</p>
                <p className="inline text-sm text-gray-500"> ({asset.symbol.toUpperCase()})</p>
              </td>
              {/* Price */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formattedPrice(asset.id)}</td>
              {/* Allocation */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateAllocation(asset.id)}</td>
              {/* Amount */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asset.myAsset.amount}</td>
              {/* ABP */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {calculateAvarageBuyPrice(asset.id)}
              </td>
              {/* Value */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{calculateValue(asset.id)}</td>
              <td className="w-[30px] px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex justify-end">
                <div className="flex items-center justify-end group">
                  <button
                    className="hidden mr-2 group-hover:flex bg-stone-400 w-[25px] h-[25px] text-white rounded cursor-pointer  items-center justify-center"
                    onClick={() => editAsset(asset.id)}
                  >
                    <p>Edit</p>
                  </button>

                  <button
                    className="hidden group-hover:flex  bg-red-600 w-[25px] h-[25px] text-white rounded cursor-pointer  items-center justify-center"
                    onClick={() => removeAssetHandler(asset.id)}
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
