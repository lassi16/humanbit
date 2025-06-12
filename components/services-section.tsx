"use client";

import React from "react";
import { useState } from "react";
import {
  BrainCog,
  Linkedin,
  Users,
  FileText,
  BarChart,
  Settings,
} from "lucide-react";

export function ServicesSection() {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      icon: BrainCog,
      title: "AI Candidate Matching",
      description:
        "Intelligent algorithms to accurately match ideal candidates with your job requirements.",
      features: [
        "Semantic Search",
        "Skills Alignment",
        "Experience Analysis",
        "Cultural Fit Prediction",
      ],
    },
    {
      icon: Linkedin,
      title: "LinkedIn Sales Navigator Integration",
      description:
        "Seamlessly leverage LinkedIn Sales Navigator for targeted candidate sourcing.",
      features: [
        "Automated Search Queries",
        "Profile Extraction",
        "Custom Filter Application",
        "Lead List Generation",
      ],
    },
    {
      icon: Users,
      title: "Talent Pool Expansion",
      description:
        "Expand your reach and discover a wider array of qualified candidates beyond traditional methods.",
      features: [
        "Diverse Candidate Sourcing",
        "Passive Candidate Engagement",
        "Global Talent Search",
        "Niche Skill Identification",
      ],
    },
    {
      icon: FileText,
      title: "Dynamic Job Description Generation",
      description:
        "Generate comprehensive and attractive job descriptions with AI assistance.",
      features: [
        "Role-Specific Content",
        "Enhanced Keywords",
        "Responsibility Structuring",
        "Benefit Highlighting",
      ],
    },
    {
      icon: BarChart,
      title: "Recruitment Analytics & Insights",
      description:
        "Gain data-driven insights into your recruitment process and candidate pipeline.",
      features: [
        "Hiring Funnel Analysis",
        "Candidate Engagement Metrics",
        "Market Trend Reporting",
        "Performance Benchmarking",
      ],
    },
    {
      icon: Settings,
      title: "Custom AI Solutions",
      description:
        "Tailored AI solutions to meet your unique recruitment challenges and workflows.",
      features: [
        "API Integrations",
        "Workflow Automation",
        "Bespoke Algorithm Development",
        "Scalable Infrastructure",
      ],
    },
  ];

  return (
    <section id="services" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Our Solutions
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We provide cutting-edge AI-powered solutions to optimize your talent
            acquisition process and enhance your recruitment strategies.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Service Cards */}
          <div className="space-y-4">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group cursor-pointer transition-all duration-500 ${
                  activeService === index ? "scale-105" : "hover:scale-102"
                }`}
                onClick={() => setActiveService(index)}
              >
                <div
                  className={`bg-white/5 backdrop-blur-lg border rounded-2xl p-6 transition-all duration-500 ${
                    activeService === index
                      ? "border-white/30 bg-white/10 shadow-2xl"
                      : "border-white/10 hover:border-white/20 hover:bg-white/8"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        activeService === index
                          ? "bg-white/20"
                          : "bg-white/10 group-hover:bg-white/15"
                      }`}
                    >
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {service.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Service Details */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 transition-all duration-500">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  {services[activeService] &&
                    React.createElement(services[activeService].icon, {
                      className: "w-8 h-8 text-white",
                    })}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {services[activeService]?.title}
                  </h3>
                  <p className="text-gray-400">Professional Service</p>
                </div>
              </div>

              <p className="text-gray-300 mb-8 leading-relaxed">
                {services[activeService]?.description}
              </p>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white mb-4">
                  Key Features:
                </h4>
                {services[activeService]?.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
