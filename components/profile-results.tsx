"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Building, Star, ExternalLink, Mail, Filter, Grid, List } from "lucide-react"
import type { ProfileData } from "@/types"

interface ProfileResultsProps {
  onNewSearch: () => void
  onRefineFilters: () => void
}

export function ProfileResults({ onNewSearch, onRefineFilters }: ProfileResultsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"relevance" | "experience" | "location">("relevance")

  // Mock profile data
  const mockProfiles: ProfileData[] = [
    {
      id: "1",
      name: "Sarah Chen",
      headline: "Senior React Developer at Meta",
      company: "Meta",
      location: "San Francisco, CA",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
      experience: "6 years",
      connectionDegree: 2,
      relevanceScore: 95,
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      headline: "Full Stack Engineer at Stripe",
      company: "Stripe",
      location: "Remote",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["React", "Python", "PostgreSQL", "Docker", "Kubernetes"],
      experience: "5 years",
      connectionDegree: 1,
      relevanceScore: 92,
    },
    {
      id: "3",
      name: "Emily Johnson",
      headline: "Frontend Architect at Airbnb",
      company: "Airbnb",
      location: "San Francisco, CA",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["React", "Vue.js", "TypeScript", "Webpack", "Jest"],
      experience: "8 years",
      connectionDegree: 3,
      relevanceScore: 89,
    },
    {
      id: "4",
      name: "David Kim",
      headline: "Senior Software Engineer at Google",
      company: "Google",
      location: "Mountain View, CA",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["React", "Go", "Kubernetes", "GCP", "Microservices"],
      experience: "7 years",
      connectionDegree: 2,
      relevanceScore: 87,
    },
    {
      id: "5",
      name: "Lisa Wang",
      headline: "React Native Developer at Uber",
      company: "Uber",
      location: "New York, NY",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["React Native", "React", "JavaScript", "iOS", "Android"],
      experience: "4 years",
      connectionDegree: 1,
      relevanceScore: 84,
    },
    {
      id: "6",
      name: "James Thompson",
      headline: "Lead Frontend Developer at Netflix",
      company: "Netflix",
      location: "Los Angeles, CA",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["React", "Redux", "TypeScript", "Node.js", "GraphQL"],
      experience: "9 years",
      connectionDegree: 3,
      relevanceScore: 82,
    },
  ]

  const ProfileCard = ({ profile }: { profile: ProfileData }) => (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
      <div className="flex items-start space-x-4 mb-4">
        <img
          src={profile.imageUrl || "/placeholder.svg"}
          alt={profile.name}
          className="w-16 h-16 rounded-full bg-white/10"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-300">{profile.relevanceScore}%</span>
            </div>
          </div>
          <p className="text-gray-300 mb-2">{profile.headline}</p>
          <div className="flex items-center text-sm text-gray-400 space-x-4">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {profile.location}
            </div>
            <div className="flex items-center">
              <Building className="w-4 h-4 mr-1" />
              {profile.experience}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {profile.skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
              {skill}
            </Badge>
          ))}
          {profile.skills.length > 4 && (
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-xs">
              +{profile.skills.length - 4} more
            </Badge>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" className="flex-1 bg-white text-black hover:bg-gray-100">
          <Mail className="w-4 h-4 mr-2" />
          Contact
        </Button>
        <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-white mr-3" />
            <div>
              <h3 className="text-2xl font-bold text-white">Candidate Results</h3>
              <p className="text-gray-400">Found 89 candidates matching your criteria</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-white/20 text-white" : "text-gray-400"}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-white/20 text-white" : "text-gray-400"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="experience">Sort by Experience</option>
              <option value="location">Sort by Location</option>
            </select>
          </div>
        </div>

        {/* Filters Summary */}
        <div className="mb-6 p-4 bg-white/5 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-300">Active Filters:</span>
              <div className="flex space-x-2">
                <Badge className="bg-green-600/20 text-green-400 border-green-600/30">React Developer</Badge>
                <Badge className="bg-green-600/20 text-green-400 border-green-600/30">San Francisco</Badge>
                <Badge className="bg-red-600/20 text-red-400 border-red-600/30">Exclude: Junior</Badge>
              </div>
            </div>
            <Button
              onClick={onRefineFilters}
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Refine Filters
            </Button>
          </div>
        </div>

        {/* Results Grid */}
        <div className={`grid gap-6 mb-8 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {mockProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="text-sm text-gray-400">Showing 1-6 of 89 candidates</div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              Next
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
          <Button onClick={onNewSearch} variant="outline" className="border-white/20 text-gray-300 hover:bg-white/5">
            Start New Search
          </Button>
          <Button onClick={onRefineFilters} className="bg-white text-black hover:bg-gray-100">
            Export Results
          </Button>
        </div>
      </div>
    </div>
  )
}
