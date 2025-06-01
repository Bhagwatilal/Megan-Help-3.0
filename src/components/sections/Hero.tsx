import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Scene from "../ui/3D/Scene";

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Scene className="w-full h-full" />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-mentii-500/10 to-lavender-500/10 z-0"></div>

      {/* Content */}
      <div className="container mx-auto px-4 pt-20 z-10 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight animate-float">
            Find <span className="gradient-text">Joy</span> and <span className="gradient-text">Peace</span> in Every Moment
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 animate-float" style={{ animationDelay: "0.5s" }}>
            Discover engaging activities, games, and support to help you navigate your mental health journey with playfulness and care.
          </p>

          {/* Buttons - No Disappearance */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6 animate-float" style={{ animationDelay: "1s" }}>
            <Link 
              to="/activities" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-full gradient-bg text-white font-medium text-lg transition-transform duration-300 hover:scale-105 shadow-md hover:shadow-glow-sm"
            >
              Explore Activities
            </Link>
            
            <Link
              to="/chat"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/90 backdrop-blur-sm text-foreground border border-border font-medium text-lg transition-transform duration-300 hover:scale-105 shadow-md"
            >
              Talk to Mentii
            </Link>
          </div>

          {/* Floating Scroll Indicator */}
          <div className="mt-16 mb-8 animate-float">
            <div className="w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Shape Decorations - Floating */}
      <div className="hidden lg:block absolute top-1/4 left-10 w-32 h-32 rounded-full bg-mentii-500/20 animate-float"></div>
      <div className="hidden lg:block absolute bottom-1/4 right-10 w-20 h-20 rounded-full bg-lavender-500/20 animate-float" style={{ animationDelay: "1s" }}></div>
      <div className="hidden lg:block absolute top-1/3 right-40 w-16 h-16 rounded-full bg-mint-500/20 animate-float" style={{ animationDelay: "2s" }}></div>
    </section>
  );
};

export default Hero;
