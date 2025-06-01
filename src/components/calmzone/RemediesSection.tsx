
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, Timer, BookOpen, Music, Coffee, Volume2, X } from "lucide-react";
import { toast } from "sonner";

// Local audio files to replace external URLs
const audioFiles = {
  gentleStream: "/sounds/remedies/deep_breathing.mp3",
  windChimes: "/sounds/remedies/guided_visualization.mp3",
  forestAmbience: "/sounds/remedies/mindfulness.mp3",
  oceanWaves: "/sounds/remedies/muscle_relaxation.mp3",
  gentleMusic: "/sounds/remedies/deep_breathing.mp3",
  meditationBells: "/sounds/remedies/guided_visualization.mp3",
  calmingPiano: "/sounds/remedies/deep_breathing.mp3",
  morningBirds: "/sounds/remedies/muscle_relaxation.mp3",
  rainSounds: "/sounds/remedies/deep_breathing.mp3",
};

const initialRemedies = [
  {
    id: 1,
    title: "Deep Breathing Exercises",
    description: "Simple 4-7-8 breathing technique to calm anxiety",
    duration: "5 min",
    category: "Anxiety",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format",
    ambientSound: audioFiles.gentleStream, // Local audio file
  },
  {
    id: 2,
    title: "Progressive Muscle Relaxation",
    description: "Tense and relax muscle groups to release physical tension",
    duration: "15 min",
    category: "Stress",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format",
    ambientSound: audioFiles.windChimes, // Local audio file
  },
  {
    id: 3,
    title: "Guided Forest Visualization",
    description: "Mental imagery to transport you to a peaceful natural setting",
    duration: "10 min",
    category: "Sleep",
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=500&auto=format",
    ambientSound: audioFiles.forestAmbience, // Local audio file
  },
  {
    id: 4,
    title: "5-4-3-2-1 Grounding Technique",
    description: "Use your senses to ground yourself in the present moment",
    duration: "3 min",
    category: "Panic",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=500&auto=format",
    ambientSound: audioFiles.oceanWaves, // Local audio file
  },
  {
    id: 5,
    title: "Mindful Tea Ritual",
    description: "Create a calming ritual around brewing and enjoying tea",
    duration: "20 min",
    category: "Mindfulness",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=500&auto=format",
    ambientSound: audioFiles.gentleMusic, // Local audio file
  },
  {
    id: 6,
    title: "Body Scan Meditation",
    description: "Systematically release tension throughout your body",
    duration: "15 min",
    category: "Sleep",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format",
    ambientSound: audioFiles.meditationBells, // Local audio file
  },
];

const moreRemedies = [
  {
    id: 7,
    title: "Journaling Practice",
    description: "Write down thoughts to gain clarity and reduce overthinking",
    duration: "15 min",
    category: "Anxiety",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&auto=format",
    ambientSound: audioFiles.calmingPiano, // Local audio file
  },
  {
    id: 8,
    title: "Gratitude Reflection",
    description: "Focus on three things you're grateful for to shift perspective",
    duration: "5 min",
    category: "Mindfulness",
    image: "https://images.unsplash.com/photo-1510137600163-2729bc6959ed?w=500&auto=format",
    ambientSound: audioFiles.morningBirds, // Local audio file
  },
  {
    id: 9,
    title: "Nature Sound Therapy",
    description: "Listen to calming nature sounds to reduce stress levels",
    duration: "20 min",
    category: "Stress",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&auto=format",
    ambientSound: audioFiles.rainSounds, // Local audio file
  },
];

interface RemedyDetailProps {
  remedy: typeof initialRemedies[0];
  onClose: () => void;
}

const RemedyDetail: React.FC<RemedyDetailProps> = ({ remedy, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70); 
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPracticeStarted, setIsPracticeStarted] = useState(false);
  
  // Set up audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };
  
  const toggleSound = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play()
          .catch(error => {
            console.error("Error playing audio:", error);
            toast.error("Could not play audio. Please try again.");
          });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const startPractice = () => {
    setIsPracticeStarted(true);
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
        .catch(error => {
          console.error("Error playing audio:", error);
          toast.error("Could not play ambient sound. Please try again.");
        });
      setIsPlaying(true);
    }
    
    toast.success("Beginning your practice session", {
      description: "Take a deep breath and focus on the present moment"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <audio 
        ref={audioRef} 
        src={remedy.ambientSound} 
        loop 
        preload="auto"
      />
      
      {!isPracticeStarted ? (
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="aspect-video relative">
            <img
              src={remedy.image}
              alt={remedy.title}
              className="w-full h-full object-cover"
            />
            <Button 
              className="absolute top-4 right-4" 
              variant="secondary"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{remedy.title}</h2>
            <div className="flex items-center gap-2 mb-4">
              <Badge>{remedy.category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Timer className="mr-1 h-4 w-4" />
                <span>{remedy.duration}</span>
              </div>
            </div>
            <p className="mb-6">{remedy.description}</p>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">How to practice:</h3>
              <div className="space-y-2">
                <p>1. Find a quiet place where you won't be disturbed.</p>
                <p>2. Get into a comfortable position, sitting or lying down.</p>
                <p>3. Follow the specific instructions for this technique.</p>
                <p>4. Practice for the recommended duration.</p>
                <p>5. Notice how you feel afterward.</p>
              </div>
              
              <div className="mt-6">
                <Button className="w-full" onClick={startPractice}>
                  Begin Practice
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="h-[70vh] relative">
            <img
              src={remedy.image}
              alt={remedy.title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white p-6">
              <h2 className="text-3xl font-bold mb-4 text-center">{remedy.title}</h2>
              <p className="text-xl max-w-xl text-center mb-8">Take a deep breath and focus on the present moment</p>
              
              <div className="flex flex-col items-center space-y-4 mb-8">
                <p className="text-2xl">Breathe in...</p>
                <div className="w-16 h-16 rounded-full border-4 border-white animate-[pulse_4s_ease-in-out_infinite]"></div>
                <p className="text-2xl">...and out</p>
              </div>
              
              <div className="flex items-center mt-8 bg-white/20 px-4 py-2 rounded-full">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:text-white hover:bg-white/20" 
                  onClick={toggleSound}
                >
                  {isPlaying ? (
                    <span className="flex items-center">
                      <Volume2 className="h-5 w-5 mr-2" />
                      Mute
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Volume2 className="h-5 w-5 mr-2" />
                      Unmute
                    </span>
                  )}
                </Button>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="ml-2 h-2 w-24 rounded-lg appearance-none bg-white/30"
                />
              </div>
            </div>
            
            <Button 
              className="absolute top-4 right-4" 
              variant="secondary"
              onClick={onClose}
            >
              <X className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </div>
          
          <div className="p-4 bg-white text-center">
            <p className="text-muted-foreground">
              Allow yourself to be present. Take your time with this practice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const RemediesSection: React.FC = () => {
  const [remedies, setRemedies] = useState(initialRemedies);
  const [selectedRemedy, setSelectedRemedy] = useState<typeof initialRemedies[0] | null>(null);
  const [showLoadMore, setShowLoadMore] = useState(true);

  const handleTryRemedy = (remedy: typeof initialRemedies[0]) => {
    setSelectedRemedy(remedy);
  };

  const handleLoadMore = () => {
    setRemedies([...remedies, ...moreRemedies]);
    setShowLoadMore(false);
    toast.success("More remedies loaded", {
      description: "Explore new techniques to improve your wellbeing"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-2xl font-bold">Calming Remedies</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            All Categories
          </Button>
          <Button variant="outline" size="sm">
            Most Popular
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {remedies.map((remedy) => (
          <Card key={remedy.id} className="overflow-hidden hover:shadow-md transition-all duration-300">
            <div className="aspect-video relative">
              <img
                src={remedy.image}
                alt={remedy.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-white/80 text-black hover:bg-white/90">
                  {remedy.category}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle>{remedy.title}</CardTitle>
              <CardDescription>{remedy.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <Timer className="mr-1 h-4 w-4" />
                <span>{remedy.duration}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleTryRemedy(remedy)}>
                <HeartPulse className="mr-2 h-4 w-4" />
                Try This Remedy
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {showLoadMore && (
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" onClick={handleLoadMore}>
            Load More Remedies
          </Button>
        </div>
      )}

      {selectedRemedy && (
        <RemedyDetail 
          remedy={selectedRemedy} 
          onClose={() => setSelectedRemedy(null)} 
        />
      )}
    </div>
  );
};

export default RemediesSection;
