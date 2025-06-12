export interface JobDescription {
  jobTitle: string
  location: string
  workType: "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance" | "Temporary" | "Contract-to-hire" | "Volunteer"
  minYearsExperience: number
  maxYearsExperience: number
  salaryRange: {
    min: number
    max: number
    currency: string
  }
  jobDescription: string
  requiredSkills: string[]
  preferredSkills: string[]
  responsibilities: string[]
  positions: number
  maxNoticePeriod: string
  dateClosingApplication: string
  isPublic: boolean
  jobCategories: string[]
  benefits: string[]
  companySize: "Startup" | "Small" | "Medium" | "Large"
  searchTags?: string[]
  otherFields?: { [key: string]: string }
}

export interface LinkedInFilter {
  type: "include" | "exclude"
  category: "jobTitle" | "company" | "location" | "experience" | "keyword"
  value: string
  priority: "high" | "medium" | "low"
}

export interface SearchFilters {
  jobTitles: LinkedInFilter[]
  companies: LinkedInFilter[]
  locations: LinkedInFilter[]
  experienceLevels: LinkedInFilter[]
}

export interface ProfileData {
  id: string
  name: string
  headline: string
  company: string
  location: string
  profileUrl: string
  imageUrl?: string
  skills: string[]
  experience: string
  connectionDegree: number
  relevanceScore: number
}

export interface AgentConfig {
  maxOptimizationAttempts: number
  targetCandidateCount: number
  priorityWeights: {
    jobTitle: number
    experience: number
    skills: number
    location: number
    company: number
  }
}

export interface OptimizationResult {
  step: number
  action: string
  filtersApplied: LinkedInFilter[]
  resultCount: number
  reasoning: string
  success: boolean
}
