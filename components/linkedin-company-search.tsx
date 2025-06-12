"use client";

import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Search, Building2 } from "lucide-react";
import axios from "axios";

interface CompanySuggestion {
  id: string;
  name: string;
  industry?: string;
  employeeCount?: string;
  revenue?: string;
}

export function LinkedinCompanySearch() {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (!keyword.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.post("/api/linkedin-company", {
          keyword,
          filters: [
            {
              type: "COMPANY_HEADCOUNT",
              values: [
                {
                  id: "E",
                  text: "201-500",
                  selectionType: "INCLUDED",
                },
              ],
            },
          ],
        });
        console.log("API Response:", data);

        // Transform the response data to match our interface
        const companies =
          data.companies?.map((company: any) => ({
            id: company.id,
            name: company.name,
            industry: company.industry,
            employeeCount: company.employeeCount,
            revenue: company.revenue,
          })) || [];

        setSuggestions(companies);
        setShowSuggestions(true);
      } catch (err: any) {
        console.error("Error fetching companies:", err);
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to fetch companies"
        );
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(fetchCompanies, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  const handleSuggestionClick = (
    suggestion: CompanySuggestion,
    action: "include" | "exclude"
  ) => {
    console.log("Selected company:", suggestion, "Action:", action);
    setKeyword(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="company" className="text-sm font-medium text-gray-300">
          Company
        </Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="company"
            type="text"
            placeholder="Search companies..."
            value={keyword}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="pl-10 bg-white/5 border-white/20 text-white"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              Loading...
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-white/5 border-white/20">
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg"
                >
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-sm">
                      {suggestion.name}
                    </span>
                    {suggestion.industry && (
                      <span className="text-gray-400 text-xs">
                        {suggestion.industry}
                      </span>
                    )}
                    {suggestion.employeeCount && (
                      <span className="text-gray-400 text-xs">
                        {suggestion.employeeCount} employees
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleSuggestionClick(suggestion, "include")
                      }
                      className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-600/30 px-2 py-1 text-xs"
                    >
                      Include
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleSuggestionClick(suggestion, "exclude")
                      }
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-600/30 px-2 py-1 text-xs"
                    >
                      Exclude
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
