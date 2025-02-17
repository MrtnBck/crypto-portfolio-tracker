import { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import SearchBar from "../components/SearchBar";

import PortfolioContext from "../store/PortfolioContext";

export default function NewCoin({ coin }) {
  const navigate = useNavigate();

  const [amount, setAmount] = useState(0);
  const [avaragePrice, setAvaragePrice] = useState(0);

  const [isShowCoinForm, setIsShowCoinForm] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState({});

  const portfolioCtx = useContext(PortfolioContext);

  function handleAmountChange(event) {
    setAmount(parseFloat(event.target.value));
  }

  function handleAvaragePriceChange(event) {
    setAvaragePrice(parseFloat(event.target.value));
  }

  function onSelectCoin(coin) {
    setIsShowCoinForm(true);
    setSelectedCoin(coin);
  }

  function onSubmitHandler(event) {
    event.preventDefault();
    portfolioCtx.addAsset({ ...coin, myAsset: { amount, avaragePrice } });
    console.log("Asset successfully added to your portfolio.");
    navigate("/portfolio");
  }

  return (
    <section className="w-full bg-slate-200 p-2 rounded-md shadow-md flex items-center flex-col mb-4">
      <SearchBar onSelect={onSelectCoin} />
      {isShowCoinForm && (
        <form onSubmit={onSubmitHandler} className="flex flex-col">
          <h2 className="text-2xl text-center mb-4">
            Your <b>{selectedCoin.name}</b>
          </h2>
          <label htmlFor="amount" className="text-lg block">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            step="any"
            className="border border-gray-300 rounded-md p-2 mb-2"
            onChange={handleAmountChange}
          />
          <label htmlFor="avaragePrice" className="text-lg block">
            Average Buy Price (USD)
          </label>
          <input
            type="number"
            step="any"
            id="avaragePrice"
            className="border border-gray-300 rounded-md p-2 mb-2"
            onChange={handleAvaragePriceChange}
          />
          <button type="submit" className=" bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600">
            Add
          </button>
        </form>
      )}
    </section>
  );
}
