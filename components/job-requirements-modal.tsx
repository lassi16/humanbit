"use client";

import type React from "react";
import { useState } from "react";
import { X, Loader2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { JobDescription } from "@/types";

interface JobRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobGenerated: (job: JobDescription) => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
}

export function JobRequirementsModal({
  isOpen,
  onClose,
  onJobGenerated,
  isGenerating,
  setIsGenerating,
}: JobRequirementsModalProps) {
  const [jobInput, setJobInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (jobInput.trim().length < 50) {
      setError(
        "Please provide a more detailed job description (minimum 50 characters)"
      );
      return;
    }

    setIsGenerating(true);
    setError("");

    try {
      // Simulate API call to OpenAI
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock generated job description
      const mockJob: JobDescription = {
        jobTitle: "Senior React Developer",
        location: "San Francisco, CA",
        workType: "Full-time",
        minYearsExperience: 5,
        maxYearsExperience: 10,
        salaryRange: { min: 120000, max: 180000, currency: "USD" },
        jobDescription: jobInput,
        requiredSkills: ["React", "TypeScript", "Node.js", "GraphQL"],
        preferredSkills: ["Next.js", "AWS", "Docker", "Jest"],
        responsibilities: [
          "Develop and maintain React applications",
          "Collaborate with design and backend teams",
          "Write clean, maintainable code",
          "Mentor junior developers",
        ],
        positions: 1,
        maxNoticePeriod: "Immediate",
        dateClosingApplication: "2025-01-25",
        isPublic: true,
        jobCategories: ["Software Development"],
        benefits: ["Health Insurance", "Flexible Hours"],
        companySize: "Startup",
      };

      onJobGenerated(mockJob);
    } catch (err) {
      setError("Failed to generate job description. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-gray-900/95 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          disabled={isGenerating}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="flex items-center mb-6">
            <Brain className="w-8 h-8 text-white mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-white">
                Describe Your Ideal Candidate
              </h2>
              <p className="text-gray-400">
                AI will analyze and optimize your requirements
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="job-input"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Job Requirements & Description
              </label>
              <Textarea
                id="job-input"
                value={jobInput}
                onChange={(e) => setJobInput(e.target.value)}
                placeholder="Example: We're looking for a Senior React Developer with 5+ years of experience in building scalable web applications. The ideal candidate should have expertise in TypeScript, Next.js, and modern state management solutions. They should be comfortable working in an agile environment and have experience with cloud platforms like AWS..."
                className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-white/30 focus:ring-white/20"
                disabled={isGenerating}
              />
              <div className="flex justify-between items-center mt-2">
                <div
                  className={`text-sm ${
                    jobInput.length < 50 ? "text-red-400" : "text-gray-400"
                  }`}
                >
                  {jobInput.length}/50 characters minimum
                </div>
              </div>
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isGenerating}
                className="flex-1 border-white/20 text-gray-300 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isGenerating || jobInput.length < 50}
                className="flex-1 bg-white text-black hover:bg-gray-100"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Job Description"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
