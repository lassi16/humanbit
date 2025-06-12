"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Edit,
  ArrowRight,
  Sparkles,
  Pencil,
  Check,
  X,
  ArrowDown,
  Plus,
} from "lucide-react";
import type { JobDescription } from "@/types";
import { IdealCandidateModal } from "@/components/ideal-candidate-modal";
import { Textarea } from "@/components/ui/textarea";

interface JobDescriptionDisplayProps {
  jobDescription: JobDescription;
  onProceed: () => void;
  onEdit: () => void;
  onIdealCandidateDescriptionSubmit: (data: {
    enhancedDescription: string;
    requiredSkills: string[];
    keyResponsibilities: string[];
  }) => void;
}

export function JobDescriptionDisplay({
  jobDescription,
  onProceed,
  onEdit,
  onIdealCandidateDescriptionSubmit,
}: JobDescriptionDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState<JobDescription>(() => {
    // Initialize with default values for safety
    return {
      ...jobDescription,
      jobCategories: jobDescription.jobCategories || [],
      benefits: jobDescription.benefits || [],
      requiredSkills: [], // Ensure skills are initialized
      responsibilities: [], // Ensure responsibilities are initialized
      jobDescription: jobDescription.jobDescription || "",
    };
  });

  const [isIdealCandidateModalOpen, setIsIdealCandidateModalOpen] =
    useState(false);
  const [isEditingJobDescription, setIsEditingJobDescription] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingResponsibilities, setIsEditingResponsibilities] =
    useState(false);
  const [editedDescription, setEditedDescription] = useState(
    jobDescription.jobDescription
  );
  const [editedSkills, setEditedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [editedResponsibilities, setEditedResponsibilities] = useState<
    string[]
  >([]);
  const [candidateDescription, setCandidateDescription] = useState<
    string | null
  >(null);

  const handleCopy = () => {
    const text = `${editedJob.jobTitle}\n\n${
      editedJob.jobDescription
    }\n\nRequired Skills: ${(editedJob.requiredSkills || []).join(
      ", "
    )}\n\nResponsibilities:\n${(editedJob.responsibilities || [])
      .map((r) => `• ${r}`)
      .join("\n")}`;
    navigator.clipboard.writeText(text);
  };

  const handleResponsibilitiesEdit = () => {
    if (editedJob) {
      setEditedResponsibilities(editedJob.responsibilities || []);
      setIsEditingResponsibilities(true);
    }
  };

  const handleSkillsEdit = () => {
    if (editedJob) {
      setEditedSkills(editedJob.requiredSkills || []);
      setIsEditingSkills(true);
    }
  };

  const handleResponsibilitiesSave = () => {
    if (editedJob) {
      setEditedJob({
        ...editedJob,
        responsibilities: editedResponsibilities,
      });
      setIsEditingResponsibilities(false);
    }
  };

  const handleSkillsSave = () => {
    if (editedJob) {
      setEditedJob({
        ...editedJob,
        requiredSkills: editedSkills,
      });
      setIsEditingSkills(false);
    }
  };

  const handleResponsibilitiesCancel = () => {
    setIsEditingResponsibilities(false);
  };

  const handleSkillsCancel = () => {
    setIsEditingSkills(false);
  };

  const handleResponsibilitiesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditedResponsibilities(
      e.target.value.split("\n").filter((line) => line.trim())
    );
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedSkills(e.target.value.split("\n").filter((line) => line.trim()));
  };

  const handleCopyToDescription = (content: string) => {
    if (editedJob) {
      setEditedDescription((prev) => {
        const newContent = prev ? `${prev}\n\n${content}` : content;
        setIsEditingJobDescription(true);
        return newContent;
      });
    }
  };

  const formatResponsibilitiesForDescription = () => {
    if (!editedJob?.responsibilities) return "";
    return editedJob.responsibilities.map((resp) => `• ${resp}`).join("\n");
  };

  const formatSkillsForDescription = () => {
    if (!editedJob?.requiredSkills) return "";
    return editedJob.requiredSkills.map((skill) => `• ${skill}`).join("\n");
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && editedJob) {
      setEditedSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleIdealCandidateDescriptionSubmit = (data: {
    enhancedDescription: string;
    requiredSkills: string[];
    keyResponsibilities: string[];
  }) => {
    setCandidateDescription(data.enhancedDescription);
    setEditedSkills(data.requiredSkills);
    setEditedResponsibilities(data.keyResponsibilities);
    // Update the editedJob state with the new responsibilities and skills
    setEditedJob((prev) => ({
      ...prev,
      responsibilities: data.keyResponsibilities,
      requiredSkills: data.requiredSkills,
      jobDescription: data.enhancedDescription,
    }));
    // Ensure we're not in editing mode
    setIsEditingResponsibilities(false);
    setIsEditingSkills(false);
    onIdealCandidateDescriptionSubmit(data);
    setIsIdealCandidateModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Job Details Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Skills Required Section */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Skills Required</h3>
              <div className="flex items-center gap-2">
                {!isEditingSkills ? (
                  <Button
                    onClick={handleSkillsEdit}
                    className="bg-[#0B0B0B] text-white hover:text-black hover:brightness-100 px-4 py-2"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSkillsSave}
                      className="bg-[#0B0B0B] text-white hover:text-black hover:brightness-100 px-4 py-2"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={handleSkillsCancel}
                      className="bg-[#0B0B0B] text-white hover:text-black hover:brightness-100 px-4 py-2"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {isEditingSkills ? (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a skill"
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    onClick={handleAddSkill}
                    className="bg-slate-900 text-white hover:bg-black px-2 py-1"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <textarea
                  value={editedSkills.join("\n")}
                  onChange={handleSkillsChange}
                  className="w-full h-32 p-4 bg-white/5 border border-white/20 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter skills (one per line)"
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {editedSkills.length > 0 ? (
                  editedSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-white/10 text-white border-white/20"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No skills added yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Job Details */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">Job Details</h3>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Job Title</h4>
              <p className="text-slate-300">{editedJob.jobTitle}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Work Type</h4>
              <p className="text-slate-300">{editedJob.workType}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Years of Experience</h4>
              <p className="text-slate-300">
                {editedJob.minYearsExperience} - {editedJob.maxYearsExperience}{" "}
                Years
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Salary Range</h4>
              <p className="text-slate-300">
                {editedJob.salaryRange.min} - {editedJob.salaryRange.max}{" "}
                {editedJob.salaryRange.currency}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Job Location</h4>
              <p className="text-slate-300">{editedJob.location}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Company Size</h4>
              <p className="text-slate-300">{editedJob.companySize}</p>
            </div>
            {editedJob.jobCategories && editedJob.jobCategories.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Job Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {editedJob.jobCategories.map((category, index) => (
                    <Badge
                      key={index}
                      className="bg-white/10 text-white border-white/20"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {editedJob.benefits && editedJob.benefits.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Benefits</h4>
                <div className="flex flex-wrap gap-2">
                  {editedJob.benefits.map((benefit, index) => (
                    <Badge
                      key={index}
                      className="bg-white/10 text-white border-white/20"
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Positions</h4>
              <p className="text-slate-300">{editedJob.positions}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Max Notice Period</h4>
              <p className="text-slate-300">{editedJob.maxNoticePeriod}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">
                Date Closing Application
              </h4>
              <p className="text-slate-300">
                {editedJob.dateClosingApplication}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Public Job</h4>
              <p className="text-slate-300">
                {editedJob.isPublic ? "Yes" : "No"}
              </p>
            </div>
            {editedJob.searchTags && editedJob.searchTags.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-white">Search Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {editedJob.searchTags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="bg-white/10 text-white border-white/20"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {editedJob.otherFields &&
              Object.keys(editedJob.otherFields).length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-white">Other Fields</h4>
                  {Object.entries(editedJob.otherFields).map(([key, value]) => (
                    <div key={key}>
                      <h5 className="text-slate-300 font-medium">{key}:</h5>
                      <p className="text-slate-400">{value}</p>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Responsibilities Section */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Key Responsibilities
              </h3>
              <div className="flex items-center gap-2">
                {!isEditingResponsibilities ? (
                  <Button
                    key="edit-responsibilities-button"
                    onClick={handleResponsibilitiesEdit}
                    className="bg-[#0B0B0B] text-white hover:text-black hover:brightness-100 px-4 py-2"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleResponsibilitiesSave}
                      className="text-green-400 hover:text-green-300 px-2 py-1 text-sm"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      onClick={handleResponsibilitiesCancel}
                      className="text-red-400 hover:text-red-300 px-2 py-1 text-sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {isEditingResponsibilities ? (
              <textarea
                value={editedResponsibilities.join("\n")}
                onChange={handleResponsibilitiesChange}
                className="w-full h-40 p-4 bg-white/5 border border-white/20 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter responsibilities (one per line)"
              />
            ) : (
              <div>
                {editedJob.responsibilities &&
                editedJob.responsibilities.length > 0 ? (
                  <ul className="space-y-1">
                    {editedJob.responsibilities.map((resp, index) => (
                      <li
                        key={index}
                        className="text-slate-300 flex items-start"
                      >
                        <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0" />
                        {resp}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-400 text-sm">
                    No key responsibilities provided yet.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Job Description Section */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                Generated Job Description
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    setIsEditingJobDescription(!isEditingJobDescription)
                  }
                  className="bg-[#0B0B0B] text-white hover:text-black hover:brightness-100 px-4 py-2"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditingJobDescription
                    ? "Save Description"
                    : "Edit Description"}
                </Button>
                <Button
                  onClick={handleCopy}
                  className="bg-[#0B0B0B] text-white hover:text-black hover:brightness-100 px-4 py-2"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  {editedJob.jobTitle}
                </h4>
                <p className="text-slate-300 mb-4">
                  {editedJob.location} • {editedJob.workType}
                </p>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-2">
                  Job Description
                </h5>
                {isEditingJobDescription ? (
                  <Textarea
                    value={editedJob.jobDescription}
                    onChange={(e) =>
                      setEditedJob({
                        ...editedJob,
                        jobDescription: e.target.value,
                      })
                    }
                    className="min-h-[200px] bg-slate-800/50 border-slate-700 text-white"
                  />
                ) : (
                  <p className="text-slate-300 leading-relaxed">
                    {editedJob.jobDescription}
                  </p>
                )}
              </div>

              <div>
                <h5 className="font-semibold text-white mb-2">
                  Required Skills
                </h5>
                <div className="flex flex-wrap gap-2">
                  {editedJob.requiredSkills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-[#0B0B0B] text-white hover:text-black hover:brightness-100 px-4 py-2"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-2">
                  Key Responsibilities
                </h5>
                <ul className="space-y-1">
                  {editedJob.responsibilities.map((resp, index) => (
                    <li key={index} className="text-slate-300 flex items-start">
                      <span className="w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* New Section for Ideal Candidate Description */}
              <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700 flex items-center justify-between">
                <p className="text-slate-300">
                  Refine your candidate search with AI.
                </p>
                <Button
                  key="describe-candidate-button"
                  onClick={() => setIsIdealCandidateModalOpen(true)}
                  className="w-fit flex items-center justify-center px-6 py-3 text-lg bg-slate-700 text-white hover:bg-slate-600 rounded-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <Sparkles className="w-6 h-6 mr-3 text-purple-400" />
                  Describe the ideal Candidate
                </Button>
              </div>
              {candidateDescription && (
                <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Ideal Candidate Description:
                  </h4>
                  <p className="text-slate-200 whitespace-pre-wrap">
                    {candidateDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Proceed Button Section */}
      <div className="pt-6">
        <Button
          onClick={onProceed}
          className="w-full flex items-center justify-center py-4 bg-white text-black hover:bg-white/90 hover:scale-105 transition-transform duration-200"
        >
          Proceed to LinkedIn Filters <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>

      <IdealCandidateModal
        isOpen={isIdealCandidateModalOpen}
        onClose={() => setIsIdealCandidateModalOpen(false)}
        onSubmit={handleIdealCandidateDescriptionSubmit}
      />
    </div>
  );
}
