"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X, ArrowRight, RotateCcw, Building2 } from "lucide-react";
import type { JobDescription, LinkedInFilter } from "@/types";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface LinkedInFilterInterfaceProps {
  jobDescription: JobDescription | null;
  onOptimize: (
    filters: LinkedInFilter[],
    jobDescription: JobDescription | null
  ) => void;
  onBack: () => void;
  onFiltersChange: (filters: LinkedInFilter[]) => void;
}

interface LocationSuggestion {
  urn: string;
  text: string;
  countryCode?: string;
  type?: string;
  selectionType?: string;
  displayValue?: string;
}

interface CompanySuggestion {
  id: string;
  name: string;
  industry?: string;
  employeeCount?: string;
  revenue?: string;
}

export function LinkedInFilterInterface({
  jobDescription,
  onOptimize,
  onBack,
  onFiltersChange,
}: LinkedInFilterInterfaceProps) {
  const [filters, setFilters] = useState<LinkedInFilter[]>([]);
  const [searchInputs, setSearchInputs] = useState({
    jobTitle: "",
    company: "",
    location: "",
    keyword: "",
  });
  const [jobTitleSuggestions, setJobTitleSuggestions] = useState<string[]>([]);
  const [companySuggestions, setCompanySuggestions] = useState<
    CompanySuggestion[]
  >([]);
  const [locationSuggestions, setLocationSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState<{
    jobTitle: boolean;
    company: boolean;
    location: boolean;
  }>({ jobTitle: false, company: false, location: false });
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJobTitleSuggestions, setShowJobTitleSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
  const [companyError, setCompanyError] = useState<string | null>(null);

  const jobTitleRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = async (type: string, value: string) => {
    if (!value.trim()) {
      console.log("🔄 Empty value, clearing suggestions");
      if (type === "jobTitle") setJobTitleSuggestions([]);
      if (type === "location") setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }

    console.log(`🔍 Fetching ${type} suggestions for:`, value);
    setLoadingSuggestions((prev) => ({ ...prev, [type]: true }));
    setError(null);

    try {
      if (type === "jobTitle") {
        console.log("📤 Making request to job titles API with query:", value);
        const { data } = await axios.post("/api/linkedin-job-titles", {
          query: value,
        });

        console.log(
          "📥 Received job title suggestions:",
          JSON.stringify(data, null, 2)
        );

        if (!data.suggestions) {
          throw new Error("Invalid response format: missing suggestions array");
        }

        const suggestions = data.suggestions.map(
          (suggestion: any) => suggestion.text
        );
        console.log("✨ Processed suggestions:", suggestions);

        setJobTitleSuggestions(suggestions);
        setShowJobTitleSuggestions(true);
      } else if (type === "location") {
        console.log("📤 Making request to location API with query:", value);
        const { data } = await axios.get("/api/linkedin-filters", {
          params: { keyword: value },
        });

        console.log(
          "📥 Received location suggestions from API:",
          JSON.stringify(data, null, 2)
        );

        if (!data.suggestions) {
          throw new Error("Invalid response format: missing suggestions array");
        }

        const locationSuggestions = data.suggestions.map((item: any) => ({
          urn: item.urn,
          text: item.text,
          type: "location",
          displayValue: item.text,
        }));

        console.log(
          "✨ Processed location suggestions (before setting state):",
          JSON.stringify(locationSuggestions, null, 2)
        );
        setLocationSuggestions(locationSuggestions);
        setShowLocationSuggestions(true);
        console.log(
          "✅ Location suggestions set and showLocationSuggestions is true."
        );
      }
    } catch (err: any) {
      console.error(`❌ Error fetching ${type} suggestions:`, {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack,
      });

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.details?.message ||
        err.message ||
        `Failed to fetch ${type} suggestions`;

      setError(errorMessage);
      if (type === "jobTitle") setJobTitleSuggestions([]);
      if (type === "location") setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    } finally {
      setLoadingSuggestions((prev) => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    console.log(
      "🔍 Triggering fetchSuggestions for jobTitle with:",
      searchInputs.jobTitle
    );
    const handler = setTimeout(() => {
      fetchSuggestions("jobTitle", searchInputs.jobTitle);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInputs.jobTitle]);

  useEffect(() => {
    console.log(
      "🔍 Triggering fetchSuggestions for company with:",
      searchInputs.company
    );
    const handler = setTimeout(() => {
      fetchSuggestions("company", searchInputs.company);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInputs.company]);

  useEffect(() => {
    console.log(
      "🔍 Triggering fetchSuggestions for location with:",
      searchInputs.location
    );
    const handler = setTimeout(() => {
      fetchSuggestions("location", searchInputs.location);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInputs.location]);

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
        setSuggestions(data.suggestions || []);
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

  const fetchCompanySuggestions = async (value: string) => {
    if (!value.trim()) {
      console.log("🔄 Empty company search, clearing suggestions");
      setCompanySuggestions([]);
      setShowCompanySuggestions(false);
      return;
    }

    console.log(`🔍 Fetching company suggestions for: ${value}`);
    setLoadingSuggestions((prev) => ({ ...prev, company: true }));
    setCompanyError(null);

    try {
      console.log("📤 Making request to company API with query:", value);
      const { data } = await axios.get("/api/linkedin-company", {
        params: { query: value },
      });

      console.log(
        "📥 Received company suggestions:",
        JSON.stringify(data, null, 2)
      );

      if (!data.suggestions) {
        throw new Error("Invalid response format: missing suggestions array");
      }

      const companies = data.suggestions.map((company: any) => ({
        id: company.id,
        name: company.name,
        industry: company.industry || "",
        employeeCount: company.employeeCount || "",
        revenue: company.revenue || "",
      }));

      console.log(
        "✨ Processed company suggestions:",
        JSON.stringify(companies, null, 2)
      );
      setCompanySuggestions(companies);
      setShowCompanySuggestions(true);
    } catch (err: any) {
      console.error("❌ Error fetching companies:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack,
      });
      setCompanyError(
        err.response?.data?.error || err.message || "Failed to fetch companies"
      );
      setCompanySuggestions([]);
      setShowCompanySuggestions(false);
    } finally {
      setLoadingSuggestions((prev) => ({ ...prev, company: false }));
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCompanySuggestions(searchInputs.company);
    }, 800);
    return () => clearTimeout(handler);
  }, [searchInputs.company]);

  const addFilter = (
    category: LinkedInFilter["category"],
    value: string,
    type: "include" | "exclude"
  ) => {
    const newFilter: LinkedInFilter = {
      type,
      category,
      value,
      priority: "medium",
    };
    setFilters([...filters, newFilter]);
    setSearchInputs({ ...searchInputs, [category]: "" });
    clearCategorySuggestions(category);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const clearAllFilters = () => {
    setFilters([]);
    setSearchInputs({ jobTitle: "", company: "", location: "", keyword: "" });
    clearCategorySuggestions("jobTitle");
    clearCategorySuggestions("company");
    clearCategorySuggestions("location");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSearchInputs((prev) => ({ ...prev, [id]: value }));
  };

  const clearCategorySuggestions = (category: string) => {
    if (category === "jobTitle") setJobTitleSuggestions([]);
    if (category === "company") setCompanySuggestions([]);
    if (category === "location") setLocationSuggestions([]);
  };

  const handleSuggestionClick = (
    category: "jobTitle" | "company" | "location",
    suggestion: string | LocationSuggestion,
    type: "include" | "exclude"
  ) => {
    if (category === "location" && typeof suggestion !== "string") {
      addFilter(category, suggestion.text, type);
      setSearchInputs((prev) => ({ ...prev, location: suggestion.text }));
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    } else if (category === "jobTitle" && typeof suggestion === "string") {
      addFilter(category, suggestion, type);
      setSearchInputs((prev) => ({ ...prev, [category]: suggestion }));
      setJobTitleSuggestions([]);
      setShowJobTitleSuggestions(false);
    } else if (category === "company" && typeof suggestion === "string") {
      addFilter(category, suggestion, type);
      setSearchInputs((prev) => ({ ...prev, [category]: suggestion }));
      setCompanySuggestions([]);
      setShowCompanySuggestions(false);
    }
  };

  const handleJobTitleSuggestionClick = (
    title: string,
    type: "include" | "exclude"
  ) => {
    addFilter("jobTitle", title, type);
    setSearchInputs((prev) => ({ ...prev, jobTitle: title }));
    setJobTitleSuggestions([]);
    setShowJobTitleSuggestions(false);
  };

  const handleCompanySuggestionClick = (
    suggestion: CompanySuggestion,
    type: "include" | "exclude"
  ) => {
    addFilter("company", suggestion.name, type);
    setSearchInputs((prev) => ({ ...prev, company: suggestion.name }));
    setCompanySuggestions([]);
    setShowCompanySuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        jobTitleRef.current &&
        !jobTitleRef.current.contains(event.target as Node)
      ) {
        console.log("🚪 Closing jobTitle suggestions via outside click.");
        setShowJobTitleSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [jobTitleRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        companyRef.current &&
        !companyRef.current.contains(event.target as Node)
      ) {
        console.log("🚪 Closing company suggestions via outside click.");
        setShowCompanySuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [companyRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        console.log("🚪 Closing location suggestions via outside click.");
        setShowLocationSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [locationRef]);

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  return (
    <div className="space-y-8 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl relative">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Refine Your Talent Search
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Filter Inputs */}
        <Card className="flex flex-col gap-6 lg:w-2/3 p-4 bg-white/5 border-white/10 rounded-xl shadow-inner">
          <h3 className="text-xl font-semibold text-white">Filter Options</h3>
          {/* Search Inputs Section */}
          <div className="flex flex-col gap-6">
            {/* Job Title Search */}
            <div className="relative" ref={jobTitleRef}>
              <Label
                htmlFor="jobTitle"
                className="text-sm font-medium text-slate-300"
              >
                Job Title
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="jobTitle"
                  type="text"
                  placeholder="Search job titles..."
                  value={searchInputs.jobTitle}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchInputs((prev) => ({
                      ...prev,
                      jobTitle: e.target.value,
                    }))
                  }
                  onFocus={() => {
                    console.log(
                      "💡 Job Title input focused. Setting showJobTitleSuggestions to true."
                    );
                    setShowJobTitleSuggestions(true);
                  }}
                  className="pl-10 bg-white/5 border-white/20 text-white"
                />
                {loadingSuggestions.jobTitle && (
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              {/* Job Title Suggestions */}
              {jobTitleSuggestions.length > 0 && showJobTitleSuggestions && (
                <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-zinc-900 opacity-100 border-slate-700">
                  <div className="p-2">
                    {jobTitleSuggestions.map((title, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 hover:bg-slate-700 rounded-lg"
                      >
                        <span className="text-slate-200 text-sm">{title}</span>
                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              handleSuggestionClick(
                                "jobTitle",
                                title,
                                "include"
                              )
                            }
                            className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-600/30 px-2 py-1 text-xs"
                          >
                            Include
                          </Button>
                          <Button
                            onClick={() =>
                              handleSuggestionClick(
                                "jobTitle",
                                title,
                                "exclude"
                              )
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
            {/* END Job Title Search */}

            {/* Company Search */}
            <div className="relative" ref={companyRef}>
              <Label
                htmlFor="company"
                className="text-sm font-medium text-slate-300"
              >
                Company Name
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="company"
                  type="text"
                  placeholder="Search companies..."
                  value={searchInputs.company}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchInputs((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  onFocus={() => {
                    console.log(
                      "💡 Company input focused. Setting showCompanySuggestions to true."
                    );
                    setShowCompanySuggestions(true);
                  }}
                  className="pl-10 bg-white/5 border-white/20 text-white"
                />
                {loadingSuggestions.company && (
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              {companyError && (
                <p className="text-sm text-red-500 mt-1">
                  Error: {companyError}
                </p>
              )}

              {companySuggestions.length > 0 && showCompanySuggestions && (
                <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-zinc-900 opacity-100 border-slate-700">
                  <div className="p-2">
                    {companySuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 hover:bg-slate-700 rounded-lg"
                      >
                        <div className="flex flex-col">
                          <span className="text-slate-200 text-sm">
                            {suggestion.name}
                          </span>
                          <span className="text-slate-400 text-xs">
                            {suggestion.industry}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() =>
                              handleSuggestionClick(
                                "company",
                                suggestion.name,
                                "include"
                              )
                            }
                            className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-600/30 px-2 py-1 text-xs"
                          >
                            Include
                          </Button>
                          <Button
                            onClick={() =>
                              handleSuggestionClick(
                                "company",
                                suggestion.name,
                                "exclude"
                              )
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
            {/* END Company Search */}

            {/* Location Search */}
            <div className="space-y-2" ref={locationRef}>
              <Label
                htmlFor="location"
                className="text-sm font-medium text-gray-300"
              >
                Location
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="location"
                  type="text"
                  placeholder="Search locations..."
                  value={searchInputs.location}
                  onChange={(e) =>
                    setSearchInputs((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  onFocus={() => {
                    console.log(
                      "💡 Location input focused. Setting showLocationSuggestions to true."
                    );
                    setShowLocationSuggestions(true);
                  }}
                  className="pl-10 bg-white/5 border-white/20 text-white"
                />
                {loadingSuggestions.location && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <Card className="absolute z-10 w-3/5 mt-1 max-h-60 overflow-auto bg-zinc-900 opacity-100 border-white/20">
                  <div className="p-2">
                    {locationSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer"
                        onClick={() =>
                          handleSuggestionClick(
                            "location",
                            suggestion,
                            "include"
                          )
                        }
                      >
                        <div className="flex flex-col">
                          <span className="text-gray-300 text-sm">
                            {suggestion.displayValue || suggestion.text}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleSuggestionClick(
                                "location",
                                suggestion,
                                "include"
                              )
                            }
                            className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-600/30 px-2 py-1 text-xs"
                          >
                            Include
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleSuggestionClick(
                                "location",
                                suggestion,
                                "exclude"
                              )
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
            {/* END Location Search */}

            {/* Keyword Search (Optional) */}
            <div className="relative">
              <Label
                htmlFor="keyword"
                className="text-sm font-medium text-slate-300"
              >
                Search Tags
              </Label>
              <div className="relative flex gap-2">
                <Input
                  id="keyword"
                  type="text"
                  placeholder="Add generic search tags..."
                  value={searchInputs.keyword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSearchInputs((prev) => ({
                      ...prev,
                      keyword: e.target.value,
                    }))
                  }
                  className="flex-1 bg-white/5 border-white/20 text-white"
                />
                <Button
                  onClick={() =>
                    addFilter("keyword", searchInputs.keyword, "include")
                  }
                  className="bg-green-600/20 hover:bg-green-600/30 text-black-400 border-blue-600/30 px-4 py-2 text-sm"
                >
                  Add Keyword
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column: Applied Filters */}
        <Card className="lg:w-1/3 flex flex-col space-y-4 p-4 bg-white/5 border-white/10 rounded-xl shadow-inner">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">
              Applied Filters
            </h3>
            {filters.length > 0 && (
              <Button
                onClick={clearAllFilters}
                variant="ghost"
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" /> Clear All
              </Button>
            )}
          </div>
          {filters.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <Badge
                  key={index}
                  className={`px-3 py-1 text-sm rounded-full flex items-center cursor-pointer transition-colors w-40 flex-none min-w-0 overflow-hidden \
                    ${
                      filter.type === "include"
                        ? "bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30"
                        : "bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30"
                    }`}
                  onClick={() => removeFilter(index)}
                >
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {filter.category}: {filter.value}
                  </span>
                  <X className="ml-1 w-3 h-3 flex-shrink-0" />
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No filters applied yet.</p>
          )}
        </Card>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
        <Button
          onClick={onBack}
          variant="outline"
          className="text-white border-white/20 hover:bg-white/10"
        >
          ← Back to Job Description
        </Button>
        <Button
          onClick={(e) => onOptimize(filters, jobDescription)}
          className="bg-white text-black hover:bg-white/90 hover:scale-105 transition-transform duration-200"
        >
          Optimize with AI <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
