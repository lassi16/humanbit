// components/ideal-candidate-modal.tsx
"use client";

import { useState } from "react";
import { Modal } from "./modal";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast"; // or your toast library of choice
import { Badge } from "./ui/badge";

interface IdealCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    enhancedDescription: string;
    requiredSkills: string[];
    keyResponsibilities: string[];
  }) => void;
}

export function IdealCandidateModal({
  isOpen,
  onClose,
  onSubmit,
}: IdealCandidateModalProps) {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [enhancedDescription, setEnhancedDescription] = useState("");
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [extractedResponsibilities, setExtractedResponsibilities] = useState<
    string[]
  >([]);

  const handleEnhanceDescription = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    try {
      console.log("Sending description to enhance:", description);
      const response = await fetch("/api/enhance-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();
      console.log("Received response:", data);

      if (!response.ok) {
        console.error("API Error:", response.status, data.error || response);
        throw new Error(
          `API ${response.status}: ${data.error || response.statusText}`
        );
      }

      // Expecting a JSON object with specific fields now
      if (
        typeof data.enhancedDescription !== "string" ||
        !Array.isArray(data.requiredSkills) ||
        !Array.isArray(data.keyResponsibilities)
      ) {
        console.error("Invalid server response format:", data);
        throw new Error(
          "Invalid response format from AI model. Expected structured JSON."
        );
      }

      console.log("Setting enhanced description:", data.enhancedDescription);
      setEnhancedDescription(data.enhancedDescription);
      setExtractedSkills(data.requiredSkills);
      setExtractedResponsibilities(data.keyResponsibilities);
    } catch (error: any) {
      console.error("Error enhancing description:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      enhancedDescription: enhancedDescription || description,
      requiredSkills: extractedSkills,
      keyResponsibilities: extractedResponsibilities,
    });
    setDescription("");
    setEnhancedDescription("");
    setExtractedSkills([]);
    setExtractedResponsibilities([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white">
          Describe the Ideal Candidate
        </h2>

        <div className="space-y-4">
          <Textarea
            placeholder="Enter a detailed description of your ideal candidate..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[200px] bg-gray-800/50 border-gray-700 text-white"
          />

          <Button
            onClick={handleEnhanceDescription}
            disabled={isLoading || !description.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enhancing...
              </>
            ) : (
              "Enhance Description with AI"
            )}
          </Button>

          {enhancedDescription && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Enhanced Description
              </h3>
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-gray-200 whitespace-pre-wrap">
                  {enhancedDescription}
                </p>
              </div>
              {extractedSkills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-md font-semibold text-white">
                    Suggested Required Skills:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {extractedSkills.map((skill, index) => (
                      <Badge
                        key={index}
                        className="bg-white/10 text-white border-white/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {extractedResponsibilities.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-md font-semibold text-white">
                    Suggested Key Responsibilities:
                  </h4>
                  <ul className="list-disc list-inside text-gray-200 pl-4">
                    {extractedResponsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              onClick={onClose}
              className="border-white/20 text-gray-300 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!description.trim() && !enhancedDescription}
            >
              Use Description
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// --- API Route example (Next.js App Router) ---
// app/api/enhance-description/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { description } = await req.json();
    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const openai = new OpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Please enhance the following candidate description for clarity and impact:\n\n${description}`,
        },
      ],
    });

    const enhancedDescription =
      completion.choices?.[0]?.message?.content ?? description;

    return NextResponse.json({ enhancedDescription });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
