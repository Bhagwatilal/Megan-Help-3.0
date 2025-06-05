import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import { ActivityProvider } from "./hooks/useActivityTracker";

// Import Firebase configuration
import "./components/auth/FirebaseConfig";

// Create new routes
import Activities from "./pages/Activities";
import Games from "./pages/Games";
import Chat from "./pages/Chat";
import Music from "./pages/Music";
import Journal from "./pages/Journal";
import About from "./pages/About";
import BecomeMember from "./pages/BecomeMember";
import { usePlayAI } from './hooks/usePlayAI';

// Import Firebase auth components
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { MemberProvider } from "./components/auth/MemberVerification";

// Create a new QueryClient instance - create it outside of the component to avoid re-creation on renders
const queryClient = new QueryClient();

function App() {
  // Initialize PlayAI
  usePlayAI();
  return (
    <QueryClientProvider client={queryClient}>
      <ActivityProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <MemberProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes - Require Authentication */}
              
              <Route path="/activities" element={
                <ProtectedRoute>
                  <Activities />
                </ProtectedRoute>
              } />
              <Route path="/games" element={
                <ProtectedRoute>
                  <Games />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              } />
              <Route path="/music" element={
                <ProtectedRoute>
                  <Music />
                </ProtectedRoute>
              } />
              <Route path="/journal" element={
                <ProtectedRoute>
                  <Journal />
                </ProtectedRoute>
              } />
              <Route path="/become-member" element={
                <ProtectedRoute>
                  <BecomeMember />
                </ProtectedRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </MemberProvider>
      </TooltipProvider>
      </ActivityProvider>
    </QueryClientProvider>
  );
};

export default App;
