"use client";

import { useState } from "react";
import { Brain, Search, Lightbulb, TrendingUp } from "lucide-react";

export function AboutSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Matching",
      description:
        "Our intelligent algorithms analyze job requirements to find the most compatible candidates.",
    },
    {
      icon: Search,
      title: "Optimized LinkedIn Searches",
      description:
        "Leverage AI to conduct precise and effective searches on LinkedIn Sales Navigator.",
    },
    {
      icon: Lightbulb,
      title: "Effortless Candidate Discovery",
      description:
        "Streamline your hiring process by quickly identifying ideal talent without manual sifting.",
    },
    {
      icon: TrendingUp,
      title: "Data-Driven Insights",
      description:
        "Gain valuable insights into candidate pools and recruitment trends for smarter decisions.",
    },
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            About Our Platform
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We are at the forefront of recruitment technology, building an
            AI-powered platform designed to revolutionize how businesses
            discover and connect with top talent. Our mission is to transform
            complex hiring challenges into seamless, data-driven candidate
            acquisition.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 transition-all duration-500 hover:bg-white/10 hover:scale-105 cursor-pointer ${
                hoveredCard === index ? "shadow-2xl" : ""
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gray-100 transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                1000+
              </div>
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Candidates Matched
              </div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                95%
              </div>
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Successful Placements
              </div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                50+
              </div>
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                Hiring Teams Empowered
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
