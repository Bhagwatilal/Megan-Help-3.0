
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipBack, SkipForward, Volume2, Timer, Music, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { fetchAudioFromPixabay, fallbackAudio } from "../../services/audioService";

interface Meditation {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  image: string;
  audioSrc: string;
}

const initialMeditations: Meditation[] = [
  {
    id: 1,
    title: "Om Chanting Meditation",
    description: "Traditional Hindu meditation focused on the Om mantra for deep relaxation",
    duration: "10 min",
    category: "Traditional",
    image: "https://images.unsplash.com/photo-1744127135973-c039982908c9?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    audioSrc: ""
  },
  {
    id: 2,
    title: "Gayatri Mantra",
    description: "Ancient Sanskrit mantra known for its healing properties",
    duration: "15 min",
    category: "Mantra",
    image: "https://images.unsplash.com/photo-1744127380502-888bfcabd3da?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    audioSrc: ""
  },
  {
    id: 3,
    title: "Guided Breath Awareness",
    description: "Focused meditation on conscious breathing with 'Om' interludes",
    duration: "8 min",
    category: "Guided",
    image: "https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=500&auto=format",
    audioSrc: ""
  },
  {
    id: 4,
    title: "Evening Shanti Meditation",
    description: "Peaceful evening meditation with gentle mantras and silence",
    duration: "20 min",
    category: "Evening",
    image: "https://images.unsplash.com/photo-1535701121392-da2f8ef792f0?w=500&auto=format",
    audioSrc: ""
  },
  {
    id: 5,
    title: "Chakra Balancing",
    description: "Traditional meditation focusing on aligning your energy centers",
    duration: "30 min",
    category: "Energy",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format",
    audioSrc: ""
  },
  {
    id: 6,
    title: "Morning Mantra",
    description: "Start your day with energizing and positive traditional chants",
    duration: "12 min",
    category: "Morning",
    image: "https://images.unsplash.com/photo-1494548162494-384bba4ab999?w=500&auto=format",
    audioSrc: ""
  },
];

const searchQueries = [
  "om chanting meditation",
  "gayatri mantra",
  "meditation music",
  "evening meditation",
  "chakra balancing",
  "morning mantra"
];

const MeditationSection: React.FC = () => {
  const [meditations, setMeditations] = useState<Meditation[]>(initialMeditations);
  const [currentMeditation, setCurrentMeditation] = useState<Meditation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Fetch audio from Pixabay when component mounts
  useEffect(() => {
    const fetchAudio = async () => {
      setIsLoading(true);
      try {
        // Fetch audio for each meditation in parallel
        const audioPromises = searchQueries.map(query => fetchAudioFromPixabay(query));
        const audioResults = await Promise.all(audioPromises);
        
        // Map the audio to each meditation
        const updatedMeditations = meditations.map((meditation, index) => {
          const audios = audioResults[index] || [];
          // Use first audio, or fallback if none found
          const audio = audios.length > 0 ? audios[0] : fallbackAudio[index % fallbackAudio.length];
          return {
            ...meditation,
            audioSrc: audio?.audio_url || fallbackAudio[index % fallbackAudio.length].audio_url
          };
        });
        
        setMeditations(updatedMeditations);
      } catch (error) {
        console.error("Failed to fetch audio:", error);
        // Apply fallback audio on error
        const fallbackMeditations = meditations.map((meditation, index) => ({
          ...meditation,
          audioSrc: fallbackAudio[index % fallbackAudio.length].audio_url
        }));
        setMeditations(fallbackMeditations);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAudio();
    
    // Cleanup
    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Set up audio event listeners
  useEffect(() => {
    const audioElement = audioRef.current;
    
    if (!audioElement) return;
    
    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
      setIsLoadingAudio(false);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
      setProgress((audioElement.currentTime / audioElement.duration) * 100);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };
    
    audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("ended", handleEnded);
    
    return () => {
      audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, [currentMeditation]);

  const handleSelectMeditation = (meditation: Meditation) => {
    // If already playing, stop it first
    if (audioRef.current) {
      audioRef.current.pause();
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
    
    setCurrentMeditation(meditation);
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setIsLoadingAudio(true);
    
    toast.info(`Selected: ${meditation.title}`, {
      description: "Click play to start meditation"
    });
  };

  const togglePlayPause = () => {
    if (!currentMeditation || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoadingAudio(true);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        })
        .catch(e => {
          console.error("Audio playback error:", e);
          setIsLoadingAudio(false);
          toast.error("Could not play audio. Please try again.", {
            description: "This may be due to browser autoplay restrictions."
          });
        });
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const refreshAudio = async () => {
    if (!currentMeditation) return;
    
    setIsLoadingAudio(true);
    
    try {
      // Try to find a different audio
      const index = meditations.findIndex(m => m.id === currentMeditation.id);
      const query = searchQueries[index];
      const audios = await fetchAudioFromPixabay(query);
      
      if (audios.length > 0) {
        // Get a random audio from results
        const randomIndex = Math.floor(Math.random() * audios.length);
        const newAudio = audios[randomIndex].audio_url;
        
        // Update meditation with new audio
        const updatedMeditation = { ...currentMeditation, audioSrc: newAudio };
        setCurrentMeditation(updatedMeditation);
        
        // Update meditations array
        const updatedMeditations = [...meditations];
        updatedMeditations[index] = updatedMeditation;
        setMeditations(updatedMeditations);
        
        toast.success("Found a different audio track", {
          description: "Try playing it now"
        });
      } else {
        throw new Error("No alternative audio found");
      }
    } catch (error) {
      console.error("Failed to refresh audio:", error);
      toast.error("Could not find alternative audio", {
        description: "Please try another meditation"
      });
    } finally {
      setIsLoadingAudio(false);
    }
  };

  return (
    <div className="space-y-8">
      {currentMeditation && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <img 
                src={currentMeditation.image} 
                alt={currentMeditation.title}
                className="w-full md:w-32 h-32 rounded-md object-cover shadow-md"
              />
              <div className="flex-1">
                <CardTitle>{currentMeditation.title}</CardTitle>
                <CardDescription className="mt-1">{currentMeditation.description}</CardDescription>
                <div className="flex items-center mt-2">
                  <Timer className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{currentMeditation.duration}</span>
                  <Badge className="ml-3" variant="outline">{currentMeditation.category}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <audio 
              ref={audioRef} 
              src={currentMeditation.audioSrc} 
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="hidden" 
            />
            
            <div className="space-y-4">
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-mentii-500 transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{isNaN(duration) ? "--:--" : formatTime(duration)}</span>
              </div>
              
              <div className="flex justify-center items-center gap-4">
                <Button variant="ghost" size="icon" disabled>
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button 
                  className="h-12 w-12 rounded-full" 
                  onClick={togglePlayPause}
                  disabled={isLoadingAudio}
                >
                  {isLoadingAudio ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-1" />
                  )}
                </Button>
                
                <Button variant="ghost" size="icon" disabled>
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-muted-foreground" />
                <Slider 
                  value={[volume]} 
                  onValueChange={handleVolumeChange} 
                  max={100} 
                  step={1}
                  className="w-full max-w-xs"
                />
              </div>
              
              <div className="flex justify-center mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshAudio}
                  disabled={isLoadingAudio}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingAudio ? 'animate-spin' : ''}`} />
                  Try Different Audio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Meditation Library</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">All</Button>
            <Button variant="outline" size="sm">Traditional</Button>
            <Button variant="outline" size="sm">Mantra</Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-video bg-slate-200 animate-pulse" />
                <CardHeader className="pb-2">
                  <div className="h-6 bg-slate-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-slate-100 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="h-4 bg-slate-100 rounded animate-pulse w-20"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-9 bg-slate-200 rounded animate-pulse w-full"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meditations.map((meditation) => (
              <Card 
                key={meditation.id} 
                className={`
                  overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer
                  ${currentMeditation?.id === meditation.id ? 'border-mentii-500 ring-1 ring-mentii-500' : ''}
                `}
                onClick={() => handleSelectMeditation(meditation)}
              >
                <div className="aspect-video relative">
                  <img
                    src={meditation.image}
                    alt={meditation.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="icon" className="rounded-full h-12 w-12">
                      <Play className="h-5 w-5 ml-1" />
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/80 text-black hover:bg-white/90">
                      {meditation.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{meditation.title}</CardTitle>
                  <CardDescription>{meditation.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Timer className="mr-1 h-4 w-4" />
                    <span>{meditation.duration}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeditationSection;
