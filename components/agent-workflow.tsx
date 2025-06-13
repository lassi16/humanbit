"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Brain,
  ArrowRight,
} from "lucide-react";
import type { JobDescription } from "@/types";

interface AgentWorkflowProps {
  jobDescription: JobDescription | null;
  onComplete: () => void;
  onBack: () => void;
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "running" | "completed" | "error";
  details?: string;
  resultCount?: number;
}

export function AgentWorkflow({
  jobDescription,
  onComplete,
  onBack,
}: AgentWorkflowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<WorkflowStep[]>([
    {
      id: "analyze_criteria",
      title: "Analyzing Search Criteria",
      description: "AI is processing your job description and applied filters",
      status: "pending",
    },
    {
      id: "form_query",
      title: "Forming Search Query",
      description:
        "Translating criteria into an optimized LinkedIn search query",
      status: "pending",
    },
    {
      id: "execute_search",
      title: "Executing LinkedIn Search",
      description: "Connecting to LinkedIn via SerpApi to fetch profiles",
      status: "pending",
    },
    {
      id: "process_results",
      title: "Processing Search Results",
      description: "Analyzing fetched profiles for relevance",
      status: "pending",
    },
    {
      id: "finalize_list",
      title: "Finalizing Candidate List",
      description: "Preparing the most relevant candidates for your review",
      status: "pending",
    },
  ]);

  useEffect(() => {
    const runWorkflow = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);

        // Update step to running
        setSteps((prev) =>
          prev.map((step, index) =>
            index === i ? { ...step, status: "running" } : step
          )
        );

        // Simulate processing time (increased duration)
        await new Promise((resolve) =>
          setTimeout(resolve, 4000 + Math.random() * 3000)
        );

        // Update step to completed with mock results
        setSteps((prev) =>
          prev.map((step, index) => {
            if (index === i) {
              const mockResults = {
                analyze_criteria: {
                  details:
                    "Successfully extracted key job requirements and filter preferences.",
                  resultCount: undefined,
                },
                form_query: {
                  details:
                    "Generated a precise LinkedIn search query based on criteria.",
                  resultCount: undefined,
                },
                execute_search: {
                  details:
                    "Successfully fetched profiles from LinkedIn via SerpApi.",
                  resultCount: 25,
                }, // Assuming 25 results from Python script
                process_results: {
                  details:
                    "Identified top relevant candidates based on optimization algorithms.",
                  resultCount: 20,
                },
                finalize_list: {
                  details: "Candidate list is ready for review.",
                  resultCount: 20,
                },
              };

              return {
                ...step,
                status: "completed",
                details:
                  mockResults[step.id as keyof typeof mockResults]?.details,
                resultCount:
                  mockResults[step.id as keyof typeof mockResults]?.resultCount,
              };
            }
            return step;
          })
        );
      }

      // Complete workflow
      setTimeout(() => {
        setCurrentStep(steps.length);
      }, 1000);
    };

    runWorkflow();
  }, []);

  const getStepIcon = (step: WorkflowStep, index: number) => {
    if (step.status === "completed") {
      return <CheckCircle className="w-6 h-6 text-green-400" />;
    } else if (step.status === "running") {
      return <Clock className="w-6 h-6 text-blue-400 animate-spin" />;
    } else if (step.status === "error") {
      return <AlertCircle className="w-6 h-6 text-red-400" />;
    } else {
      return <div className="w-6 h-6 rounded-full border-2 border-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8">
        <div className="flex items-center mb-8">
          <Brain className="w-8 h-8 text-white mr-3" />
          <div>
            <h3 className="text-2xl font-bold text-white">
              AI Agent Optimization
            </h3>
            <p className="text-gray-400">
              Optimizing your LinkedIn search for maximum relevance
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="space-y-6 mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 ${
                step.status === "running"
                  ? "bg-blue-500/10 border border-blue-500/20"
                  : step.status === "completed"
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-white/5 border border-white/10"
              }`}
            >
              <div className="flex-shrink-0 mt-1">
                {getStepIcon(step, index)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-semibold text-white">
                    {step.title}
                  </h4>
                  {step.resultCount && (
                    <div className="text-sm text-gray-300 bg-white/10 px-3 py-1 rounded-full">
                      {step.resultCount} candidates
                    </div>
                  )}
                </div>

                <p className="text-gray-400 mb-2">{step.description}</p>

                {step.details && (
                  <p className="text-sm text-gray-300 bg-white/5 px-3 py-2 rounded-lg">
                    {step.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Completion Status */}
        {currentStep >= steps.length && (
          <div className="text-center py-8 border-t border-white/10">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-white mb-2">
              Optimization Complete!
            </h4>
            <p className="text-gray-300 mb-6">
              Found 89 highly relevant candidates matching your requirements
            </p>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={onBack}
                variant="outline"
                className="border-white/20 text-gray-300 hover:bg-white/5"
              >
                Refine Filters
              </Button>
              <Button
                onClick={onComplete}
                className="bg-white text-black hover:bg-gray-100"
              >
                View Candidates
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>
              {Math.min(currentStep + 1, steps.length)}/{steps.length} steps
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  (Math.min(currentStep + 1, steps.length) / steps.length) * 100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
