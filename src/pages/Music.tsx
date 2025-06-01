import React from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ChatbotPreview from "../components/ui/ChatbotPreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music as MusicIcon, Mic } from "lucide-react";
import MusicPlayer from "../components/music/MusicPlayer";
import KaraokeSection from "../components/music/KaraokeSection";

const Music: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Music & Singing</h1>
          <p className="text-center text-lg text-muted-foreground mb-8">
            Boost your mood with relaxing music or sing along to your favorite songs.
          </p>
          
          <Tabs defaultValue="music" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-8">
              <TabsTrigger value="music" className="flex items-center gap-2">
                <MusicIcon className="h-4 w-4" />
                <span>Music Player</span>
              </TabsTrigger>
              <TabsTrigger value="karaoke" className="flex items-center gap-2">
                <Mic className="h-4 w-4" />
                <span>Karaoke</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="music" className="m-0">
              <MusicPlayer />
            </TabsContent>
            
            <TabsContent value="karaoke" className="m-0">
              <KaraokeSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      <ChatbotPreview />
    </div>
  );
};

export default Music;
