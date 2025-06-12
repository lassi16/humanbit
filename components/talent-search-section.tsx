"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { JobRequirementsModal } from "@/components/job-requirements-modal";
import { JobDescriptionDisplay } from "@/components/job-description-display";
import { LinkedInFilterInterface } from "@/components/linkedin-filter-interface";
import { AgentWorkflow } from "@/components/agent-workflow";
import { ProfileResults } from "@/components/profile-results";
import { Brain, Search, Target, Users } from "lucide-react";
import type { JobDescription } from "@/types";

export function TalentSearchSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "input" | "generate" | "filters" | "optimize" | "results"
  >("input");
  const [jobDescription, setJobDescription] = useState<JobDescription | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (stepsRef.current) {
      stepsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep]);

  const handleJobGenerated = (job: JobDescription) => {
    setJobDescription(job);
    setCurrentStep("generate");
    setIsModalOpen(false);
  };

  const handleIdealCandidateDescriptionSubmit = (data: {
    enhancedDescription: string;
    requiredSkills: string[];
    keyResponsibilities: string[];
  }) => {
    setJobDescription((prevJobDescription) => {
      if (!prevJobDescription) {
        // If jobDescription is null, we need to initialize it with default values for other fields
        // This scenario should ideally be handled by the JobRequirementsModal providing an initial job.
        // For now, let's create a minimal JobDescription. You might want to refine this.
        return {
          jobTitle: "",
          location: "",
          workType: "Full-time",
          minYearsExperience: 0,
          maxYearsExperience: 0,
          salaryRange: { min: 0, max: 0, currency: "INR" },
          jobDescription: data.enhancedDescription,
          requiredSkills: data.requiredSkills || [],
          preferredSkills: [],
          responsibilities: data.keyResponsibilities || [],
          positions: 1,
          maxNoticePeriod: "Immediate",
          dateClosingApplication: "",
          isPublic: false,
          jobCategories: [],
          benefits: [],
          companySize: "Startup",
        };
      }

      return {
        ...prevJobDescription,
        jobDescription: data.enhancedDescription,
        requiredSkills:
          data.requiredSkills || prevJobDescription.requiredSkills,
        responsibilities:
          data.keyResponsibilities || prevJobDescription.responsibilities,
      };
    });
    setIsModalOpen(false); // Close the IdealCandidateModal
  };

  const handleProceedToFilters = () => {
    setCurrentStep("filters");
  };

  const handleOptimizeFilters = () => {
    setCurrentStep("optimize");
  };

  const handleShowResults = () => {
    setCurrentStep("results");
  };

  const resetSearch = () => {
    setCurrentStep("input");
    setJobDescription(null);
  };

  const steps = [
    {
      id: "input",
      title: "Job Requirements",
      icon: Search,
      description: "Describe your ideal candidate",
    },
    {
      id: "generate",
      title: "AI Generation",
      icon: Brain,
      description: "AI creates job description",
    },
    {
      id: "filters",
      title: "LinkedIn Filters",
      icon: Target,
      description: "Configure search filters",
    },
    {
      id: "optimize",
      title: "AI Optimization",
      icon: Brain,
      description: "AI optimizes search",
    },
    {
      id: "results",
      title: "Candidate Results",
      icon: Users,
      description: "View matched profiles",
    },
  ];

  return (
    <section id="talent-search" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            AI Talent Search
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our intelligent platform streamlines the entire recruitment process
            from job description to candidate discovery.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12 scroll-mt-32" ref={stepsRef}>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-3 px-4 py-2 rounded-full border transition-all duration-300 ${
                  currentStep === step.id
                    ? "bg-white/10 border-white/30 text-white"
                    : steps.findIndex((s) => s.id === currentStep) > index
                    ? "bg-white/5 border-white/20 text-gray-300"
                    : "border-white/10 text-gray-500"
                }`}
              >
                <step.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto scroll-mt-24" ref={contentRef}>
          {currentStep === "input" && (
            <div className="text-center">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-12 mb-8">
                <Brain className="w-16 h-16 text-white mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  Start Your AI-Powered Search
                </h3>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Describe the role and candidate you're looking for. Our AI
                  will analyze your requirements and create an optimized job
                  description.
                </p>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
                >
                  Describe Your Ideal Candidate
                </Button>
              </div>
            </div>
          )}

          {currentStep === "generate" && jobDescription && (
            <JobDescriptionDisplay
              jobDescription={jobDescription}
              onProceed={handleProceedToFilters}
              onEdit={() => setIsModalOpen(true)}
              onIdealCandidateDescriptionSubmit={
                handleIdealCandidateDescriptionSubmit
              }
            />
          )}

          {currentStep === "filters" && (
            <LinkedInFilterInterface
              jobDescription={jobDescription}
              onOptimize={handleOptimizeFilters}
              onBack={() => setCurrentStep("generate")}
            />
          )}

          {currentStep === "optimize" && (
            <AgentWorkflow
              jobDescription={jobDescription}
              onComplete={handleShowResults}
              onBack={() => setCurrentStep("filters")}
            />
          )}

          {currentStep === "results" && (
            <ProfileResults
              onNewSearch={resetSearch}
              onRefineFilters={() => setCurrentStep("filters")}
            />
          )}
        </div>

        {/* Reset Button */}
        {currentStep !== "input" && (
          <div className="text-center mt-8">
            <Button
              onClick={resetSearch}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Start New Search
            </Button>
          </div>
        )}
      </div>

      {/* Job Requirements Modal */}
      <JobRequirementsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJobGenerated={handleJobGenerated}
        isGenerating={isGenerating}
        setIsGenerating={setIsGenerating}
      />
    </section>
  );
}
