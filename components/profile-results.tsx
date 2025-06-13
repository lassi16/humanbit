"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MapPin,
  Building,
  Star,
  ExternalLink,
  Mail,
  Filter,
  Grid,
  List,
  RotateCcw,
  CircleUser,
  Linkedin,
} from "lucide-react";
import type { ProfileData, LinkedInFilter } from "@/types";

interface ProfileResultsProps {
  onNewSearch: () => void;
  onRefineFilters: () => void;
  selectedFilters: LinkedInFilter[];
  optimizedProfiles: { name: string; linkedin_profile: string }[];
}

export function ProfileResults({
  onNewSearch,
  onRefineFilters,
  selectedFilters,
  optimizedProfiles,
}: ProfileResultsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"relevance" | "experience" | "location">(
    "relevance"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 6;

  // Add null check and default to empty array if optimizedProfiles is undefined
  const profiles = optimizedProfiles || [];
  const totalPages = Math.ceil(profiles.length / profilesPerPage);
  const currentProfiles = profiles.slice(
    (currentPage - 1) * profilesPerPage,
    currentPage * profilesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to results section
    const resultsSection = document.getElementById("candidate-results");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth" });
      // Add a small offset to account for any fixed headers
      window.scrollTo(0, window.scrollY - 100);
    }
  };

  const ProfileCard = ({
    profile,
  }: {
    profile: { name: string; linkedin_profile: string };
  }) => {
    const cardClasses = `bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 ${
      viewMode === "grid"
        ? "flex flex-col justify-between"
        : "flex items-center justify-between space-x-4 py-4 px-6"
    }`;
    const profileInfoClasses = `${
      viewMode === "grid"
        ? "flex items-start space-x-4 mb-4"
        : "flex items-center space-x-4"
    }`;
    const userIconClasses = `${
      viewMode === "grid" ? "w-16 h-16" : "w-10 h-10"
    } text-gray-400 rounded-full object-cover border-2 border-white/30 bg-white/10`;
    const nameClasses = `${
      viewMode === "grid" ? "text-lg" : "text-base"
    } font-semibold text-white`;
    const buttonContainerClasses = `flex justify-center w-full ${
      viewMode === "grid" ? "mt-auto" : "ml-auto"
    }`;
    const buttonClasses = `bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors duration-200 ${
      viewMode === "grid" ? "max-w-sm" : "py-1 px-3 min-w-[180px] flex-shrink-0"
    }`;
    const linkedinIconClasses = `${
      viewMode === "grid" ? "" : "fill-[#0A66C2]"
    } w-4 h-4 text-[#0A66C2]`;

    return (
      <div className={cardClasses}>
        <div className={profileInfoClasses}>
          <CircleUser className={userIconClasses} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className={nameClasses}>{profile.name}</h3>
            </div>
          </div>
        </div>

        <div className={buttonContainerClasses}>
          <Button asChild variant="secondary" className={buttonClasses}>
            <a
              href={profile.linkedin_profile}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className={linkedinIconClasses} />
              View LinkedIn Profile
            </a>
          </Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const title = document.getElementById("candidate-results-title");
    if (title) {
      window.scrollTo({
        top: title.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  }, [currentPage]);

  return (
    <div className="space-y-8 p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl relative">
      <h2
        id="candidate-results-title"
        className="text-3xl font-bold text-white mb-6 text-center"
      >
        Candidate Results
      </h2>

      {/* Filters and View Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button
            onClick={onRefineFilters}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" /> Refine Filters
          </Button>
          <Button
            onClick={onNewSearch}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> New Search
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort By (Optional) */}
          {/* <Button
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
            onClick={() =>
              setSortBy((prev) =>
                prev === "relevance" ? "experience" : "relevance"
              )
            }
          >
            Sort by: {sortBy === "relevance" ? "Relevance" : "Experience"}
          </Button> */}

          <Button
            onClick={() => setViewMode("grid")}
            variant={viewMode === "grid" ? "secondary" : "outline"}
            className="text-white border-white/20 hover:bg-white/10"
            size="icon"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setViewMode("list")}
            variant={viewMode === "list" ? "secondary" : "outline"}
            className="text-white border-white/20 hover:bg-white/10"
            size="icon"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Applied Filters Display (Existing code) */}
      {selectedFilters.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            Applied Filters:
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.map((filter, index) => (
              <Badge
                key={index}
                className={`px-3 py-1 text-sm rounded-full flex items-center \
                  ${
                    filter.type === "include"
                      ? "bg-green-600/20 text-green-400 border-green-600/30"
                      : "bg-red-600/20 text-red-400 border-red-600/30"
                  }`}
              >
                {filter.category}: {filter.value}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Profile Display */}
      {profiles.length > 0 ? (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {currentProfiles.map((profile, index) => (
            <ProfileCard key={index} profile={profile} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">
            No candidates found for the current filters.
          </p>
          <Button
            onClick={onRefineFilters}
            className="mt-4 bg-white/10 text-white hover:bg-white/20"
          >
            Adjust Filters
          </Button>
        </div>
      )}

      {/* Pagination (Optional) */}
      {profiles.length > profilesPerPage && (
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="text-sm text-gray-400">
            Showing{" "}
            {Math.min((currentPage - 1) * profilesPerPage + 1, profiles.length)}
            -{Math.min(currentPage * profilesPerPage, profiles.length)} of{" "}
            {profiles.length} candidates
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={
                  currentPage === index + 1
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-gray-700 text-white hover:bg-gray-600 border-white/20"
                }
                size="sm"
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
