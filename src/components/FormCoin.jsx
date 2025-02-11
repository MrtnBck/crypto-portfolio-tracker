//import Modal from "./UI/Modal";

import { useState } from "react";

export default function FormCoin({ coin, onAddMyCoin }) {
  const [amount, setAmount] = useState(0);
  const [avaragePrice, setAvaragePrice] = useState(0);

  function handleAmountChange(event) {
    setAmount(parseFloat(event.target.value));
  }

  function handleAvaragePriceChange(event) {
    setAvaragePrice(parseFloat(event.target.value));
  }

  function onSubmitHandler(event) {
    event.preventDefault();

    console.log(event);

    const coinData = { ...coin, myAsset: { amount, avaragePrice } };

    onAddMyCoin(coinData);
  }

  return (
    <section className="w-full bg-slate-200 p-2 rounded-md shadow-md flex items-center flex-col mb-4">
      <h2 className="text-2xl text-center mb-4">
        Your <b>{coin.name}</b>
      </h2>
      <p className="text-center mb-6">Fill the form below to customize your portfolio</p>
      <div className="w-full max-w-sm ">
        <form className="flex flex-col" onSubmit={onSubmitHandler}>
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
      </div>
    </section>
  );
}
