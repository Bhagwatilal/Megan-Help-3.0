import React, { useEffect } from "react";
import Hero from "../components/sections/Hero";
import Features from "../components/sections/Features";
import Activities from "../components/ui/Activities";
import ChatbotPreview from "../components/ui/ChatbotPreview";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Link } from "react-router-dom";

const Index: React.FC = () => {
  // Smooth scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section with routing */}
      <Features />
      
      {/* Activities Section */}
      <section className="py-20 px-4 bg-mentii-50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium text-mentii-600 uppercase tracking-wider mb-2">
              What We Offer
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Engaging Activities for Your Mind
            </h2>
            <p className="text-muted-foreground">
              Discover a variety of activities designed to help you relax, express yourself, 
              and find moments of peace throughout your day.
            </p>
          </div>
          
          <Activities />
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-mentii-500 to-lavender-500 text-white">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Find Your Balance?
            </h2>
            <p className="text-xl opacity-90 mb-10">
              Join Mentii today and discover tools to help you navigate life's challenges
              with playfulness and care.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/games" 
                className="px-8 py-4 rounded-full bg-white text-mentii-600 font-medium transition-transform duration-300 hover:scale-105 shadow-lg"
              >
                Play Games
              </Link>
              <Link 
                to="/chat" 
                className="px-8 py-4 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 font-medium transition-transform duration-300 hover:scale-105 hover:bg-white/30"
              >
                Talk to Mentii
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
      
      {/* Chatbot Preview */}
      <ChatbotPreview />
    </div>
  );
};

export default Index;
