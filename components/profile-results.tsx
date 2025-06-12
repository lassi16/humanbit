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
} from "lucide-react";
import type { ProfileData, LinkedInFilter } from "@/types";

interface ProfileResultsProps {
  onNewSearch: () => void;
  onRefineFilters: () => void;
  selectedFilters: LinkedInFilter[];
}

export function ProfileResults({
  onNewSearch,
  onRefineFilters,
  selectedFilters,
}: ProfileResultsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"relevance" | "experience" | "location">(
    "relevance"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 6;
  const [displayedProfiles, setDisplayedProfiles] = useState<ProfileData[]>([]);

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
    {
      id: "7",
      name: "Ananya Mehta",
      headline: "Senior React Developer at Google",
      company: "Google",
      location: "Bangalore, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["React", "TypeScript", "Node.js", "GraphQL", "GCP"],
      experience: "7 years",
      connectionDegree: 2,
      relevanceScore: 95,
    },
    {
      id: "8",
      name: "Rohan Kapoor",
      headline: "Full Stack Engineer at Razorpay",
      company: "Razorpay",
      location: "Remote, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["React", "Python", "PostgreSQL", "Docker", "Kubernetes"],
      experience: "5 years",
      connectionDegree: 1,
      relevanceScore: 92,
    },
    {
      id: "9",
      name: "Isha Verma",
      headline: "Frontend Architect at Zomato",
      company: "Zomato",
      location: "Gurugram, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["React", "Vue.js", "TypeScript", "Webpack", "Jest"],
      experience: "8 years",
      connectionDegree: 3,
      relevanceScore: 89,
    },
    {
      id: "10",
      name: "Aditya Narayan",
      headline: "Senior Software Engineer at Amazon",
      company: "Amazon",
      location: "Hyderabad, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["React", "Go", "Kubernetes", "AWS", "Microservices"],
      experience: "6 years",
      connectionDegree: 2,
      relevanceScore: 87,
    },
    {
      id: "11",
      name: "Sneha Reddy",
      headline: "React Native Developer at Swiggy",
      company: "Swiggy",
      location: "Bangalore, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["React Native", "React", "JavaScript", "iOS", "Android"],
      experience: "4 years",
      connectionDegree: 1,
      relevanceScore: 84,
    },
    {
      id: "12",
      name: "Pranav Joshi",
      headline: "Lead Frontend Developer at Flipkart",
      company: "Flipkart",
      location: "Bangalore, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["React", "Redux", "TypeScript", "Node.js", "GraphQL"],
      experience: "9 years",
      connectionDegree: 3,
      relevanceScore: 82,
    },
    {
      id: "7",
      name: "Abhishek Malhotra",
      headline: "Backend Engineer at Zoho",
      company: "Zoho",
      location: "Bangalore, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["Vue.js", "Android", "AWS", "Webpack", "Jest"],
      experience: "9 years",
      connectionDegree: 3,
      relevanceScore: 91,
    },
    {
      id: "8",
      name: "Varun Agarwal",
      headline: "Backend Engineer at Microsoft",
      company: "Microsoft",
      location: "Hyderabad, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["Redux", "Go", "JavaScript", "Node.js", "GCP"],
      experience: "7 years",
      connectionDegree: 2,
      relevanceScore: 93,
    },
    {
      id: "9",
      name: "Arjun Kapoor",
      headline: "React Developer at Infosys",
      company: "Infosys",
      location: "Gurugram, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["Webpack", "JavaScript", "MongoDB", "Node.js", "Microservices"],
      experience: "2 years",
      connectionDegree: 3,
      relevanceScore: 84,
    },
    {
      id: "7",
      name: "Abhishek Malhotra",
      headline: "Backend Engineer at Zoho",
      company: "Zoho",
      location: "Bangalore, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["Vue.js", "Android", "AWS", "Webpack", "Jest"],
      experience: "9 years",
      connectionDegree: 3,
      relevanceScore: 91,
    },
    {
      id: "8",
      name: "Varun Agarwal",
      headline: "Backend Engineer at Microsoft",
      company: "Microsoft",
      location: "Hyderabad, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["Redux", "Go", "JavaScript", "Node.js", "GCP"],
      experience: "7 years",
      connectionDegree: 2,
      relevanceScore: 93,
    },
    {
      id: "9",
      name: "Arjun Kapoor",
      headline: "React Developer at Infosys",
      company: "Infosys",
      location: "Gurugram, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["Webpack", "JavaScript", "MongoDB", "Node.js", "Microservices"],
      experience: "2 years",
      connectionDegree: 3,
      relevanceScore: 84,
    },
    {
      id: "10",
      name: "Arjun Reddy",
      headline: "Full Stack Developer at Amazon",
      company: "Amazon",
      location: "Ahmedabad, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["Kubernetes", "GCP", "Go", "Docker", "Vue.js"],
      experience: "8 years",
      connectionDegree: 2,
      relevanceScore: 70,
    },
    {
      id: "11",
      name: "Priya Malhotra",
      headline: "React Developer at Accenture",
      company: "Accenture",
      location: "Noida, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["GraphQL", "AWS", "GCP", "Node.js", "Android"],
      experience: "9 years",
      connectionDegree: 2,
      relevanceScore: 84,
    },
    {
      id: "12",
      name: "Ravi Mishra",
      headline: "Backend Engineer at Flipkart",
      company: "Flipkart",
      location: "Kolkata, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["AWS", "Vue.js", "TypeScript", "Webpack", "iOS"],
      experience: "5 years",
      connectionDegree: 3,
      relevanceScore: 83,
    },
    {
      id: "13",
      name: "Saurabh Jain",
      headline: "React Developer at Zomato",
      company: "Zomato",
      location: "Pune, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["Python", "TypeScript", "MongoDB", "iOS", "Docker"],
      experience: "8 years",
      connectionDegree: 2,
      relevanceScore: 83,
    },
    {
      id: "14",
      name: "Manish Verma",
      headline: "Software Engineer at Google",
      company: "Google",
      location: "Bangalore, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["Vue.js", "GCP", "React", "iOS", "Microservices"],
      experience: "5 years",
      connectionDegree: 1,
      relevanceScore: 94,
    },
    {
      id: "15",
      name: "Rajat Mehta",
      headline: "Full Stack Developer at Accenture",
      company: "Accenture",
      location: "Chennai, India",
      profileUrl: "#",
      imageUrl: "/placeholder.svg?height=80&width=80",
      skills: ["Node.js", "Jest", "Webpack", "GCP", "PostgreSQL"],
      experience: "6 years",
      connectionDegree: 2,
      relevanceScore: 85,
    },
    {
      id: "16",
      name: "Ananya Sharma",
      headline: "Frontend Developer at TCS",
      company: "TCS",
      location: "Pune, India",
      profileUrl: "https://www.linkedin.com/in/ananya-sharma",
      imageUrl: "https://randomuser.me/api/portraits/women/1.jpg",
      skills: ["React", "JavaScript", "HTML", "CSS"],
      experience: "3 years",
      connectionDegree: 2,
      relevanceScore: 89,
    },
    {
      id: "17",
      name: "Rohan Mehta",
      headline: "Backend Engineer at Infosys",
      company: "Infosys",
      location: "Bangalore, India",
      profileUrl: "https://www.linkedin.com/in/rohan-mehta",
      imageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
      skills: ["Node.js", "Express", "MongoDB"],
      experience: "4 years",
      connectionDegree: 1,
      relevanceScore: 85,
    },
    {
      id: "18",
      name: "Pooja Singh",
      headline: "Full Stack Developer at Wipro",
      company: "Wipro",
      location: "Hyderabad, India",
      profileUrl: "https://www.linkedin.com/in/pooja-singh",
      imageUrl: "https://randomuser.me/api/portraits/women/3.jpg",
      skills: ["React", "Node.js", "PostgreSQL"],
      experience: "5 years",
      connectionDegree: 3,
      relevanceScore: 92,
    },
    {
      id: "20",
      name: "Sahil Verma",
      headline: "Software Engineer at HCL Tech",
      company: "HCL Technologies",
      location: "Noida, India",
      profileUrl: "https://www.linkedin.com/in/sahil-verma",
      imageUrl: "https://randomuser.me/api/portraits/men/4.jpg",
      skills: ["Java", "Spring Boot", "MySQL"],
      experience: "2 years",
      connectionDegree: 2,
      relevanceScore: 78,
    },
    {
      id: "21",
      name: "Nikita Deshmukh",
      headline: "DevOps Engineer at Cognizant",
      company: "Cognizant",
      location: "Mumbai, India",
      profileUrl: "https://www.linkedin.com/in/nikita-deshmukh",
      imageUrl: "https://randomuser.me/api/portraits/women/5.jpg",
      skills: ["Docker", "Kubernetes", "AWS"],
      experience: "4 years",
      connectionDegree: 1,
      relevanceScore: 90,
    },
    {
      id: "22",
      name: "Amitabh Das",
      headline: "Machine Learning Engineer at Google",
      company: "Google",
      location: "Bangalore, India",
      profileUrl: "https://www.linkedin.com/in/amitabh-das",
      imageUrl: "https://randomuser.me/api/portraits/men/6.jpg",
      skills: ["Python", "TensorFlow", "Deep Learning"],
      experience: "6 years",
      connectionDegree: 1,
      relevanceScore: 95,
    },
    {
      id: "23",
      name: "Isha Kapoor",
      headline: "Data Analyst at Deloitte",
      company: "Deloitte",
      location: "Gurgaon, India",
      profileUrl: "https://www.linkedin.com/in/isha-kapoor",
      imageUrl: "https://randomuser.me/api/portraits/women/7.jpg",
      skills: ["SQL", "Power BI", "Excel"],
      experience: "3 years",
      connectionDegree: 3,
      relevanceScore: 84,
    },
    {
      id: "24",
      name: "Vikram Joshi",
      headline: "Cloud Architect at Amazon AWS",
      company: "Amazon",
      location: "Hyderabad, India",
      profileUrl: "https://www.linkedin.com/in/vikram-joshi",
      imageUrl: "https://randomuser.me/api/portraits/men/8.jpg",
      skills: ["AWS", "Terraform", "Python"],
      experience: "7 years",
      connectionDegree: 2,
      relevanceScore: 91,
    },
    {
      id: "25",
      name: "Ritika Sen",
      headline: "UI/UX Designer at Swiggy",
      company: "Swiggy",
      location: "Bangalore, India",
      profileUrl: "https://www.linkedin.com/in/ritika-sen",
      imageUrl: "https://randomuser.me/api/portraits/women/9.jpg",
      skills: ["Figma", "Sketch", "Adobe XD"],
      experience: "4 years",
      connectionDegree: 1,
      relevanceScore: 88,
    },
    {
      id: "26",
      name: "Arjun Khanna",
      headline: "Mobile App Developer at Paytm",
      company: "Paytm",
      location: "Noida, India",
      profileUrl: "https://www.linkedin.com/in/arjun-khanna",
      imageUrl: "https://randomuser.me/api/portraits/men/10.jpg",
      skills: ["Flutter", "React Native", "Firebase"],
      experience: "5 years",
      connectionDegree: 2,
      relevanceScore: 86,
    },
  ];

  useEffect(() => {
    const shuffleArray = (array: ProfileData[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const shuffled = shuffleArray([...mockProfiles]);
    setDisplayedProfiles(shuffled.slice(0, 20));
  }, []); // Run only once on mount

  const totalPages = Math.ceil(displayedProfiles.length / profilesPerPage);
  const currentProfiles = displayedProfiles.slice(
    (currentPage - 1) * profilesPerPage,
    currentPage * profilesPerPage
  );

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
              <span className="text-sm text-gray-300">
                {profile.relevanceScore}%
              </span>
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
            <Badge
              key={index}
              variant="secondary"
              className="bg-white/10 text-white border-white/20 text-xs"
            >
              {skill}
            </Badge>
          ))}
          {profile.skills.length > 4 && (
            <Badge
              variant="secondary"
              className="bg-white/10 text-white border-white/20 text-xs"
            >
              +{profile.skills.length - 4} more
            </Badge>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 bg-white text-black hover:bg-gray-100"
        >
          <Mail className="w-4 h-4 mr-2" />
          Contact
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-white mr-3" />
            <div>
              <h3 className="text-2xl font-bold text-white">
                Candidate Results
              </h3>
              <p className="text-gray-400">
                Found {displayedProfiles.length} candidates matching your
                criteria
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-white/20 text-white"
                    : "text-gray-400"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-white/20 text-white"
                    : "text-gray-400"
                }`}
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
                {selectedFilters.length > 0 ? (
                  selectedFilters.map((filter, index) => (
                    <Badge
                      key={index}
                      className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 \
                        ${
                          filter.type === "include"
                            ? "bg-green-600/20 text-green-400 border-green-600/30"
                            : "bg-red-600/20 text-red-400 border-red-600/30"
                        }`}
                    >
                      {filter.category}: {filter.value}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">None</span>
                )}
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
        <div
          className={`grid gap-6 mb-8 ${
            viewMode === "grid"
              ? "md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {currentProfiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div className="text-sm text-gray-400">
            Showing{" "}
            {Math.min(
              (currentPage - 1) * profilesPerPage + 1,
              displayedProfiles.length
            )}
            -{Math.min(currentPage * profilesPerPage, displayedProfiles.length)}{" "}
            of {displayedProfiles.length} candidates
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
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
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Next
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-white/10">
          <Button
            onClick={onNewSearch}
            variant="outline"
            className="w-full py-3 text-lg border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Start New Search
          </Button>
          <Button
            onClick={onRefineFilters}
            className="bg-white text-black hover:bg-white/90"
          >
            Export Results
          </Button>
        </div>
      </div>
    </div>
  );
}
