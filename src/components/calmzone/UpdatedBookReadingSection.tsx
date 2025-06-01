
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserBooksSection from "./UserBooksSection";
import { useNavigate } from "react-router-dom";
import "./bookStyles.css";

const UpdatedBookReadingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("curated");
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Calm Zone Library</h1>
      
      <Tabs defaultValue="curated" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="curated">Curated Books</TabsTrigger>
          <TabsTrigger value="my-books">My Books</TabsTrigger>
        </TabsList>
        
        <TabsContent value="curated">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Original curated books content here */}
            <Card className="book-card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/20 to-amber-700/30"></div>
              <CardContent className="relative z-10 p-6 flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Mindfulness for Beginners</h3>
                  <p className="text-sm mb-4">Jon Kabat-Zinn</p>
                  <p className="text-sm opacity-80 mb-6">
                    A gentle introduction to mindfulness practices that can help reduce stress and improve focus.
                  </p>
                </div>
                <Button onClick={() => navigate("/activities")}>Read Now</Button>
              </CardContent>
            </Card>
            
            <Card className="book-card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-blue-700/30"></div>
              <CardContent className="relative z-10 p-6 flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">The Anxiety Toolkit</h3>
                  <p className="text-sm mb-4">Alice Boyes, Ph.D.</p>
                  <p className="text-sm opacity-80 mb-6">
                    Practical strategies to manage anxiety and stop it from holding you back.
                  </p>
                </div>
                <Button onClick={() => navigate("/activities")}>Read Now</Button>
              </CardContent>
            </Card>
            
            <Card className="book-card relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-green-500/20 to-green-700/30"></div>
              <CardContent className="relative z-10 p-6 flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">The Power of Now</h3>
                  <p className="text-sm mb-4">Eckhart Tolle</p>
                  <p className="text-sm opacity-80 mb-6">
                    A guide to spiritual enlightenment through living in the present moment.
                  </p>
                </div>
                <Button onClick={() => navigate("/activities")}>Read Now</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="my-books">
          <UserBooksSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UpdatedBookReadingSection;
