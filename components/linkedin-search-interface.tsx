"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Suggestion {
  id: string;
  text: string;
  count?: number;
  industry?: string;
  location?: string;
  type?: string;
  selectionType?: string;
  displayValue?: string;
  image?: string;
  name?: string;
  subtitle?: string;
}

interface FilteredItem {
  id: string;
  name: string;
  type: "location" | "jobTitle" | "company";
  selectionType: "include" | "exclude";
}

interface SearchInputsState {
  location: FilteredItem[];
  jobTitle: FilteredItem[];
  company: FilteredItem[];
}

export function LinkedInSearchInterface() {
  console.log("🔄 LinkedInSearchInterface - Component rendered");

  const [locationInput, setLocationInput] = useState<string>("");
  const [jobTitleInput, setJobTitleInput] = useState<string>("");
  const [companyInput, setCompanyInput] = useState<string>("");

  const [locationSuggestions, setLocationSuggestions] = useState<Suggestion[]>(
    []
  );
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState<Suggestion[]>(
    []
  );
  const [companySuggestions, setCompanySuggestions] = useState<Suggestion[]>(
    []
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestionsFor, setShowSuggestionsFor] = useState<
    "location" | "jobTitle" | "company" | null
  >(null);

  const [searchInputs, setSearchInputs] = useState<SearchInputsState>({
    location: [],
    jobTitle: [],
    company: [],
  });

  const fetchSuggestions = async (type: string, query: string) => {
    console.log(
      `\n=== 🔄 STARTING ${type.toUpperCase()} SUGGESTIONS FETCH ===`
    );
    console.log(`📝 Query: "${query}"`);

    if (!query.trim()) {
      console.log("⚠️ Empty query, clearing suggestions");
      if (type === "location") setLocationSuggestions([]);
      if (type === "jobTitle") setJobTitleSuggestions([]);
      if (type === "company") setCompanySuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let endpoint: string;
      let params: Record<string, string> = {};

      if (type === "location") {
        endpoint = `/api/linkedin-filters`;
        params = { keyword: query, type: "location" };
      } else if (type === "jobTitle") {
        endpoint = `/api/linkedin-job-titles`;
        params = { query: query };
      } else if (type === "company") {
        endpoint = `/api/linkedin-company`;
        params = { query: query };
      } else {
        console.error(`❌ Unknown suggestion type: ${type}`);
        setError(`Unknown search category: ${type}`);
        setLoading(false);
        return; // Exit the function if type is invalid
      }

      console.log(`🌐 Making request to: ${endpoint} with params:`, params);

      const response = await axios.get(endpoint, { params });
      console.log(`📡 Response status: ${response.status}`);

      const data = response.data;

      console.log("\n=== 📦 API RESPONSE ===");
      console.log("FULL RESPONSE:", data);

      if (data.suggestions) {
        console.log(`\n=== ✨ SUGGESTIONS FOUND ===`);
        console.log(`Total suggestions: ${data.suggestions.length}`);

        const mappedSuggestions = data.suggestions.map((s: any) => ({
          id: s.id || s.urn,
          text: s.text || s.name || s.displayValue,
          displayValue: s.displayValue || s.text || s.name,
          image: s.image,
          subtitle: s.subtitle,
          count: s.count,
          industry: s.industry,
          location: s.location,
          type: s.type,
          selectionType: s.selectionType, // Assuming API might return this
        }));

        if (type === "location") setLocationSuggestions(mappedSuggestions);
        if (type === "jobTitle") setJobTitleSuggestions(mappedSuggestions);
        if (type === "company") setCompanySuggestions(mappedSuggestions);
      } else {
        console.error(`\n=== ❌ NO SUGGESTIONS FOUND ===`);
        console.error("Response data:", data);
        if (type === "location") setLocationSuggestions([]);
        if (type === "jobTitle") setJobTitleSuggestions([]);
        if (type === "company") setCompanySuggestions([]);
      }
    } catch (err: any) {
      console.error(`\n=== ❌ ERROR OCCURRED ===`);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        stack: err.stack,
      });
      setError(err.response?.data?.error || err.message || "Unknown error");
      if (type === "location") setLocationSuggestions([]);
      if (type === "jobTitle") setJobTitleSuggestions([]);
      if (type === "company") setCompanySuggestions([]);
    } finally {
      setLoading(false);
      console.log("\n=== 🔄 FETCH COMPLETED ===\n");
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (locationInput) {
        fetchSuggestions("location", locationInput);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [locationInput]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (jobTitleInput) {
        fetchSuggestions("jobTitle", jobTitleInput);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [jobTitleInput]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (companyInput) {
        fetchSuggestions("company", companyInput);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [companyInput]);

  const handleAddFilter = (
    type: "location" | "jobTitle" | "company",
    suggestion: Suggestion,
    selectionType: "include" | "exclude" = "include"
  ) => {
    console.log(
      `👆 handleAddFilter - Adding ${selectionType} ${type} filter:`,
      suggestion
    );

    const newItem: FilteredItem = {
      id: suggestion.id,
      name: suggestion.displayValue || suggestion.text || "Unknown",
      type: type,
      selectionType: selectionType,
    };

    setSearchInputs((prev) => ({
      ...prev,
      [type]: [...prev[type], newItem],
    }));

    // Clear input and close suggestions after adding
    if (type === "location") setLocationInput("");
    if (type === "jobTitle") setJobTitleInput("");
    if (type === "company") setCompanyInput("");

    setShowSuggestionsFor(null);
  };

  const removeFilter = (
    type: "location" | "jobTitle" | "company",
    id: string
  ) => {
    setSearchInputs((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }));
  };

  const totalFiltersApplied = [
    ...searchInputs.location,
    ...searchInputs.jobTitle,
    ...searchInputs.company,
  ].length;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left Column: LinkedIn Search Filters */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">
          LinkedIn Search Filters
        </h3>

        <div className="space-y-4">
          {/* Current Title Search */}
          <h4 className="font-semibold text-white">Current Title</h4>
          <div className="relative">
            <div className="flex items-center space-x-2 bg-white/5 border border-white/20 rounded-xl px-4 py-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search job titles..."
                value={jobTitleInput}
                onChange={(e) => setJobTitleInput(e.target.value)}
                onFocus={() => setShowSuggestionsFor("jobTitle")}
                onBlur={() =>
                  setTimeout(() => setShowSuggestionsFor(null), 100)
                }
                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
              {loading && showSuggestionsFor === "jobTitle" && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                </div>
              )}
            </div>
            {showSuggestionsFor === "jobTitle" &&
              jobTitleSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-md shadow-lg border border-gray-700 max-h-60 overflow-y-auto">
                  <ul className="py-1">
                    {jobTitleSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.id}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
                        onClick={() => handleAddFilter("jobTitle", suggestion)}
                      >
                        <div>
                          <div className="font-medium text-white">
                            {suggestion.displayValue ||
                              suggestion.text ||
                              "No title"}
                          </div>
                          {suggestion.count && (
                            <div className="text-sm text-gray-400">
                              {suggestion.count} results
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {error && showSuggestionsFor === "jobTitle" && (
              <div className="text-red-500 text-sm mt-1">{error}</div>
            )}
          </div>

          {/* Company Search */}
          <h4 className="font-semibold text-white">Company</h4>
          <div className="relative">
            <div className="flex items-center space-x-2 bg-white/5 border border-white/20 rounded-xl px-4 py-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                value={companyInput}
                onChange={(e) => setCompanyInput(e.target.value)}
                onFocus={() => setShowSuggestionsFor("company")}
                onBlur={() =>
                  setTimeout(() => setShowSuggestionsFor(null), 100)
                }
                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
              {loading && showSuggestionsFor === "company" && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                </div>
              )}
            </div>
            {showSuggestionsFor === "company" &&
              companySuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-md shadow-lg border border-gray-700 max-h-60 overflow-y-auto">
                  <ul className="py-1">
                    {companySuggestions.map((suggestion) => (
                      <li
                        key={suggestion.id}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
                        onClick={() => handleAddFilter("company", suggestion)}
                      >
                        {suggestion.image && (
                          <img
                            src={suggestion.image}
                            alt={suggestion.name || suggestion.text}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium text-white">
                            {suggestion.text}
                          </div>
                          {suggestion.subtitle && (
                            <div className="text-sm text-gray-400">
                              {suggestion.subtitle}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {error && showSuggestionsFor === "company" && (
              <div className="text-red-500 text-sm mt-1">{error}</div>
            )}
          </div>

          {/* Location Search */}
          <h4 className="font-semibold text-white">Location</h4>
          <div className="relative">
            <div className="flex items-center space-x-2 bg-white/5 border border-white/20 rounded-xl px-4 py-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onFocus={() => setShowSuggestionsFor("location")}
                onBlur={() =>
                  setTimeout(() => setShowSuggestionsFor(null), 100)
                }
                placeholder="Search locations..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
              {loading && showSuggestionsFor === "location" && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                </div>
              )}
            </div>
            {showSuggestionsFor === "location" &&
              locationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-md shadow-lg border border-gray-700 max-h-60 overflow-y-auto">
                  <ul className="py-1">
                    {locationSuggestions.map((suggestion: any) => (
                      <li
                        key={suggestion.id}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
                        onClick={() => handleAddFilter("location", suggestion)}
                      >
                        {suggestion.image && (
                          <img
                            src={suggestion.image}
                            alt={suggestion.name || suggestion.text}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium text-white">
                            {suggestion.text}
                          </div>
                          {suggestion.subtitle && (
                            <div className="text-sm text-gray-400">
                              {suggestion.subtitle}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {error && showSuggestionsFor === "location" && (
              <div className="text-red-500 text-sm mt-1">{error}</div>
            )}
          </div>

          {/* Reset Button */}
          <Button
            onClick={() => {
              setSearchInputs({ location: [], jobTitle: [], company: [] });
              setLocationInput("");
              setJobTitleInput("");
              setCompanyInput("");
              setLocationSuggestions([]);
              setJobTitleSuggestions([]);
              setCompanySuggestions([]);
              setShowSuggestionsFor(null);
            }}
            className="w-full flex items-center justify-center py-2 bg-white/5 text-gray-400 hover:bg-white/10 rounded-xl mt-6 border border-white/20"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Reset
          </Button>
        </div>
      </div>

      {/* Right Column: Selected Filters */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Selected Filters</h3>
          <span className="text-gray-400 text-sm">
            {totalFiltersApplied} filters applied
          </span>
        </div>

        {totalFiltersApplied === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
            <Search className="w-12 h-12 mb-4" />
            <p className="text-lg font-semibold">No filters applied yet</p>
            <p className="text-sm">
              Add filters from the sidebar to refine your search
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {searchInputs.jobTitle.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-2">Job Titles</h4>
                <div className="flex flex-wrap gap-2">
                  {searchInputs.jobTitle.map((filter) => (
                    <Badge
                      key={filter.id}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        filter.selectionType === "exclude"
                          ? "bg-red-900 text-red-100 border border-red-700"
                          : "bg-blue-900 text-blue-100 border border-blue-700"
                      }`}
                    >
                      <span>{filter.name}</span>
                      <button
                        onClick={() => removeFilter("jobTitle", filter.id)}
                        className="text-white hover:text-gray-300"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {searchInputs.company.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-2">Companies</h4>
                <div className="flex flex-wrap gap-2">
                  {searchInputs.company.map((filter) => (
                    <Badge
                      key={filter.id}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        filter.selectionType === "exclude"
                          ? "bg-red-900 text-red-100 border border-red-700"
                          : "bg-blue-900 text-blue-100 border border-blue-700"
                      }`}
                    >
                      <span>{filter.name}</span>
                      <button
                        onClick={() => removeFilter("company", filter.id)}
                        className="text-white hover:text-gray-300"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {searchInputs.location.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-2">Locations</h4>
                <div className="flex flex-wrap gap-2">
                  {searchInputs.location.map((filter) => (
                    <Badge
                      key={filter.id}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                        filter.selectionType === "exclude"
                          ? "bg-red-900 text-red-100 border border-red-700"
                          : "bg-blue-900 text-blue-100 border border-blue-700"
                      }`}
                    >
                      <span>{filter.name}</span>
                      <button
                        onClick={() => removeFilter("location", filter.id)}
                        className="text-white hover:text-gray-300"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-between mt-8 gap-4 w-full max-w-5xl">
        <Button
          onClick={() => {
            /* Add navigation logic for Back to Job Description */
          }}
          className="flex-1 bg-gray-800 text-white hover:bg-gray-700 py-3 rounded-xl"
        >
          Back to Job Description
        </Button>
        <Button
          onClick={() => {
            /* Add optimization logic for Optimize with AI */
          }}
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700 py-3 rounded-xl flex items-center justify-center"
        >
          Optimize with AI <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
