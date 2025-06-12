"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { Button } from "./ui/button";

interface CompanySuggestion {
  id: string;
  name: string;
  subtitle: string;
  image: string;
}

export default function LinkedinFilterInterface() {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!keyword) {
      setSuggestions([]);
      return;
    }

    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get("/api/linkedin-filters", {
          params: { query: keyword },
        });
        setSuggestions(data.suggestions);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.error || err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchCompanies, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  return (
    <div className="p-4 bg-[#0B0B0B] rounded-2xl shadow-lg w-full max-w-md border border-[#1e1e1e]">
      <label
        htmlFor="company-search"
        className="block text-sm font-semibold text-white"
      >
        Search Company
      </label>
      <input
        id="company-search"
        type="text"
        value={keyword}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setKeyword(e.target.value)
        }
        placeholder="Search companies..."
        className="mt-2 block w-full rounded-md border border-[#2c2c2c] bg-[#1a1a1a] text-white placeholder:text-gray-500 focus:border-[#3b82f6] focus:ring-[#3b82f6] focus:outline-none px-3 py-2 text-sm"
      />

      {loading && <p className="mt-2 text-sm text-gray-400">Loading…</p>}
      {error && <p className="mt-2 text-sm text-red-500">Error: {error}</p>}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setKeyword("")}
        className="mt-3 bg-[#111111] text-white hover:bg-[#1a1a1a]"
      >
        Clear
      </Button>

      <ul className="mt-4 max-h-48 overflow-auto border border-[#2c2c2c] rounded-md">
        {suggestions.map((c) => (
          <li
            key={c.id}
            className="p-2 hover:bg-[#1a1a1a] cursor-pointer flex items-center gap-3 text-white"
            onClick={() => console.log("Selected company:", c)}
          >
            {c.image && (
              <img
                src={c.image}
                alt={c.name}
                className="h-6 w-6 rounded-full"
              />
            )}
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-gray-400">{c.subtitle}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
