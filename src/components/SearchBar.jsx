import { useState, useRef, useEffect } from "react";

import axios from "axios";

import debounce from "lodash.debounce";

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  //if showDropdown active and user clicks outside of dropdown, close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const searchCoins = async (endpoint, params) => {
      const coinGeckoBaseUrl = "https://api.coingecko.com/api/v3";
      const options = {
        method: "GET",
        url: coinGeckoBaseUrl + endpoint,
        params: { x_cg_demo_api_key: import.meta.env.REACT_APP_CG_DEMO_API_KEY, ...params },
        headers: { accept: "application/json" },
      };

      try {
        const response = await axios.request(options);
        return response.data;
      } catch (error) {
        console.error(error);
        return [];
      }
    };

    const fetchData = async () => {
      if (query.trim() === "") {
        setFilteredItems([]);
        setShowDropdown(false);
        return;
      }

      const results = await searchCoins("/search", { query: query.toLowerCase() });

      const coins = results.coins;
      setFilteredItems(coins);
      setShowDropdown(coins.length > 0);
    };

    const debouncedFetchData = debounce(fetchData, 500);

    debouncedFetchData();

    return () => {
      debouncedFetchData.cancel();
    };
  }, [query]);

  return (
    <div className="relative w-full max-w-md mx-auto" ref={dropdownRef}>
      {/* Search Input */}
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Search cryptocurrency..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(filteredItems.length > 0)}
      />

      {/* Dropdown Results */}
      {showDropdown && (
        <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-auto">
          {filteredItems.map((item, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setQuery("");
                setShowDropdown(false);
                onSelect(item);
              }}
            >
              {item.id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
