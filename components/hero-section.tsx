"use client";
import { ChevronDown, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToTalentSearch = () => {
    const talentSection = document.getElementById("talent-search");
    if (talentSection) {
      talentSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-800" />

        {/* Floating Glass Elements with Independent Movement */}
        <div className="absolute w-96 h-96 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 animate-float-slow opacity-60 left-1/4 top-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-light-bulb">
          <div className="absolute inset-0 rounded-full border border-white/5 animate-pulse-border-1" />
          <div className="absolute inset-2 rounded-full border border-white/3 animate-pulse-border-2" />
          <div className="absolute inset-4 rounded-full border border-white/2 animate-pulse-border-3" />
        </div>

        <div className="absolute w-64 h-64 bg-white/3 backdrop-blur-sm rounded-full border border-white/8 animate-float-medium opacity-40 right-1/4 bottom-1/3 transform translate-x-1/2 translate-y-1/2 animate-light-bulb">
          <div className="absolute inset-0 rounded-full border border-white/4 animate-pulse-border-2" />
          <div className="absolute inset-3 rounded-full border border-white/2 animate-pulse-border-1" />
        </div>

        <div className="absolute w-48 h-48 bg-white/2 backdrop-blur-sm rounded-full border border-white/6 animate-float-fast opacity-30 left-3/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-light-bulb">
          <div className="absolute inset-0 rounded-full border border-white/3 animate-pulse-border-3" />
          <div className="absolute inset-2 rounded-full border border-white/1 animate-pulse-border-1" />
        </div>

        <div className="absolute w-32 h-32 bg-white/1 backdrop-blur-sm rounded-full border border-white/4 animate-float-reverse opacity-20 left-1/6 bottom-1/4 transform translate-x-1/2 translate-y-1/2 animate-light-bulb">
          <div className="absolute inset-0 rounded-full border border-white/2 animate-pulse-border-2" />
        </div>

        <div className="absolute w-80 h-80 bg-white/4 backdrop-blur-sm rounded-full border border-white/7 animate-float-diagonal opacity-25 right-1/6 top-1/6 transform translate-x-1/2 -translate-y-1/2 animate-light-bulb">
          <div className="absolute inset-0 rounded-full border border-white/3 animate-pulse-border-1" />
          <div className="absolute inset-4 rounded-full border border-white/2 animate-pulse-border-3" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        {/* Glass Card */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <Brain className="w-8 h-8 text-white mr-3 animate-pulse" />
            <span className="text-sm font-medium text-slate-300 uppercase tracking-wider">
              AI-Powered Recruitment
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight">
            Find Top Talent
            <br />
            <span className="text-3xl md:text-6xl">with AI</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Leverage artificial intelligence to discover and connect with the
            perfect candidates. Our AI-powered platform analyzes job
            requirements and optimizes LinkedIn searches to find talent that
            matches your exact needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={scrollToTalentSearch}
              className="bg-white text-black hover:bg-slate-100 px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Find Talent Now
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Button
            onClick={scrollToTalentSearch}
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
            aria-label="Scroll down"
          >
            <ChevronDown className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </section>
  );
}
