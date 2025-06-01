
import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ChatbotPreview from "../components/ui/ChatbotPreview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Mail, ExternalLink, MessageSquare, Phone, Clock, HelpCircle } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">About Mentii</h1>
          <p className="text-center text-lg text-muted-foreground mb-12">
            Learn about our mission and how we're helping people find mental wellness through fun and engaging activities.
          </p>
          
          <div className="max-w-4xl mx-auto">
            <section className="mb-16">
              <div className="bg-gradient-to-r from-mentii-100 to-lavender-100 rounded-lg p-8 text-center">
                <div className="flex justify-center mb-6">
                  <Heart className="h-16 w-16 text-mentii-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-lg leading-relaxed max-w-3xl mx-auto">
                  At Mentii, we believe mental wellness should be accessible, engaging, and fun. 
                  We're on a mission to help people manage stress, anxiety, and low moods through 
                  playful activities, games, and supportive conversation.
                </p>
              </div>
            </section>
            
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-center">How Mentii Helps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-mentii-500" />
                      Supportive AI Companion
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Our AI chatbot is designed to provide a listening ear whenever you need it. 
                      While not a replacement for professional help, Mentii offers support, 
                      encouragement, and practical exercises to help you through difficult moments.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-sunset-500" />
                      Mental Health Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      We connect you with trusted resources and information to support your 
                      mental wellness journey, from meditation techniques to professional help 
                      when needed.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-lavender-500" />
                      Distraction Techniques
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      When anxious thoughts or low moods strike, our engaging activities and 
                      games provide healthy distraction, giving your mind a break and helping 
                      shift your perspective.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Self-Care Encouragement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      Through journaling, mood tracking, and personalized recommendations, 
                      Mentii helps you develop self-awareness and build consistent self-care 
                      habits for better mental wellness.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-center">Crisis Resources</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-center mb-6 text-red-600 font-medium">
                  Mentii is not a crisis service. If you or someone you know is in immediate danger, 
                  please use these resources to get help right away:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">National Suicide Prevention Lifeline</CardTitle>
                      <CardDescription>24/7 support for people in distress</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-green-600" />
                      <a href="tel:988" className="text-blue-600 hover:underline">
                      1800-121-3667
                      </a>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Help Text Line</CardTitle>
                      <CardDescription>Text-based crisis support</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      Text HOME to <span className="font-medium">56789</span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
            
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="max-w-md mx-auto">
                    <p className="text-center mb-6">
                      Have questions, feedback, or suggestions? We'd love to hear from you!
                    </p>
                    
                    <form className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                          Your Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter your name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="Enter your email"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-1">
                          Message
                        </label>
                        <textarea
                          id="message"
                          className="w-full p-2 border border-gray-300 rounded-md h-32"
                          placeholder="Enter your message"
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full bg-mentii-500 text-white py-2 rounded-md hover:bg-mentii-600 transition-colors"
                      >
                        Send Message
                      </button>
                    </form>
                    
                    <div className="flex justify-center mt-6 space-x-4">
                      <a href="mailto:contact@mentii.com" className="flex items-center gap-1 text-mentii-600 hover:text-mentii-700">
                        <Mail className="h-4 w-4" />
                        <span>contact@mentii.com</span>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
            
            <section>
              <p className="text-center text-gray-500 text-sm">
                Mentii is a project created to demonstrate the capabilities of mental health apps.
                <br />
                This is not a real product but a showcase of how technology can support mental wellness.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
      <ChatbotPreview />
    </div>
  );
};

export default About;
