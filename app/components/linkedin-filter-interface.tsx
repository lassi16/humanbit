"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";

interface LocationSuggestion {
  urn: string;
  localizedName: string;
  countryCode: string;
}

export default function LinkedinFilterInterface() {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!keyword) {
      setSuggestions([]);
      return;
    }

    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get("/api/linkedin-filters", {
          params: { keyword },
        });
        setSuggestions(data.elements);
      } catch (err: any) {
        console.error("Fetch error:", err);
        const msg = err.response?.data?.error || err.message || "Unknown error";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    const debounceId = setTimeout(fetchLocations, 300);
    return () => clearTimeout(debounceId);
  }, [keyword]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full max-w-md">
      <label
        htmlFor="location-search"
        className="block text-sm font-medium text-gray-700"
      >
        Search Location
      </label>
      <input
        id="location-search"
        type="text"
        value={keyword}
        onChange={handleChange}
        placeholder="Type a city or region"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />

      {loading && <p className="mt-2 text-sm text-gray-500">Loading...</p>}
      {error && <p className="mt-2 text-sm text-red-500">Error: {error}</p>}

      <ul className="mt-2 max-h-40 overflow-auto border border-gray-200 rounded">
        {suggestions.map((loc) => (
          <li
            key={loc.urn}
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => console.log("Selected location:", loc)}
          >
            {loc.localizedName} ({loc.countryCode})
          </li>
        ))}
      </ul>
    </div>
  );
}
