"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface JobRequirementsFormProps {
  onClose: () => void
}

export function JobRequirementsForm({ onClose }: JobRequirementsFormProps) {
  const [jobDescription, setJobDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (jobDescription.trim().length < 50) {
      setError("Please provide a more detailed job description (minimum 50 characters)")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // TODO: Implement API call to generate job description
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate API call

      // For now, just close the modal
      onClose()
    } catch (err) {
      setError("Failed to generate job description. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const characterCount = jobDescription.length
  const minCharacters = 50

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-2 font-['Encode_Sans']">Describe Your Ideal Candidate</h2>
      <p className="text-gray-300 mb-6 font-['Nunito']">
        Tell us about the role and the type of person you're looking for. Our AI will analyze your requirements and
        generate an optimized job description.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="job-description" className="block text-sm font-medium text-gray-300 mb-2 font-['Nunito']">
            Job Requirements & Description
          </label>
          <Textarea
            id="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Example: We're looking for a Senior React Developer with 5+ years of experience in building scalable web applications. The ideal candidate should have expertise in TypeScript, Next.js, and modern state management solutions..."
            className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20 font-['Nunito']"
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-2">
            <div
              className={`text-sm ${characterCount < minCharacters ? "text-red-400" : "text-gray-400"} font-['Nunito']`}
            >
              {characterCount}/{minCharacters} characters minimum
            </div>
            <div className="text-sm text-gray-400 font-['Nunito']">{characterCount} characters</div>
          </div>
        </div>

        {error && <div className="text-red-400 text-sm font-['Nunito']">{error}</div>}

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 border-white/20 text-gray-300 hover:bg-white/5 font-['Encode_Sans']"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || characterCount < minCharacters}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-['Encode_Sans']"
          >
            {isLoading ? (
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
  )
}
