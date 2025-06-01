
import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Share, ThumbsUp, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Meme {
  id: string;
  title: string;
  url: string;
  likes?: number;
}

// Fallback memes in case API fails
const fallbackMemes = [
  {
    id: "1",
    title: "When the code finally works",
    url: "https://i.imgflip.com/7zloe8.jpg",
    likes: 230,
  },
  {
    id: "2",
    title: "Monday mornings be like",
    url: "https://i.imgflip.com/7q5cmk.jpg",
    likes: 186,
  },
  {
    id: "3",
    title: "Weekend vibes",
    url: "https://i.imgflip.com/7zhviz.jpg",
    likes: 312,
  },
  {
    id: "4",
    title: "When the coffee kicks in",
    url: "https://i.imgflip.com/7zo8kp.jpg",
    likes: 275,
  },
];

interface MemeCarouselProps {
  className?: string;
}

const MemeCarousel: React.FC<MemeCarouselProps> = ({ className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [memes, setMemes] = useState<Meme[]>(fallbackMemes);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedMeme, setSelectedMeme] = useState<Meme | null>(null);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchMemes();
  }, []);

  const fetchMemes = async () => {
    setIsLoading(true);
    try {
      // Using the meme API to get random memes
      const response = await fetch("https://api.imgflip.com/get_memes");
      const data = await response.json();
      
      if (data.success) {
        // Get random 8 memes from the API
        const randomMemes = data.data.memes
          .sort(() => 0.5 - Math.random())
          .slice(0, 8)
          .map((meme: any) => ({
            id: meme.id,
            title: meme.name,
            url: meme.url,
            likes: Math.floor(Math.random() * 400) + 50, // Random likes count
          }));
        
        setMemes(randomMemes);
      } else {
        console.error("Failed to fetch memes from API, using fallbacks");
        setMemes(fallbackMemes);
      }
    } catch (error) {
      console.error("Error fetching memes:", error);
      setMemes(fallbackMemes);
    } finally {
      setIsLoading(false);
    }
  };

  const nextMeme = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % memes.length);
      setIsAnimating(false);
    }, 300);
  };

  const prevMeme = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? memes.length - 1 : prevIndex - 1
      );
      setIsAnimating(false);
    }, 300);
  };

  const openMemeDialog = (meme: Meme) => {
    setSelectedMeme(meme);
  };

  const closeMemeDialog = () => {
    setSelectedMeme(null);
  };

  const handleLike = (meme: Meme) => {
    const newMemes = [...memes];
    const memeIndex = newMemes.findIndex(m => m.id === meme.id);
    
    if (memeIndex !== -1) {
      const newUserLikes = new Set(userLikes);
      
      if (newUserLikes.has(meme.id)) {
        // Unlike
        newUserLikes.delete(meme.id);
        newMemes[memeIndex].likes = (newMemes[memeIndex].likes || 0) - 1;
        toast({
          description: "You unliked this meme",
        });
      } else {
        // Like
        newUserLikes.add(meme.id);
        newMemes[memeIndex].likes = (newMemes[memeIndex].likes || 0) + 1;
        toast({
          description: "You liked this meme! 😊",
        });
      }
      
      setUserLikes(newUserLikes);
      setMemes(newMemes);
    }
  };

  const handleShare = (meme: Meme) => {
    // In a real app, this would use the Web Share API or create a shareable link
    navigator.clipboard.writeText(`Check out this funny meme: ${meme.title} - ${meme.url}`);
    toast({
      description: "Meme link copied to clipboard! Share it with your friends.",
    });
  };

  const handleRefresh = () => {
    fetchMemes();
    toast({
      description: "Getting fresh memes for you!",
    });
  };

  useEffect(() => {
    // Auto-rotate memes every 5 seconds if not showing a selected meme
    if (!selectedMeme) {
      const interval = setInterval(() => {
        nextMeme();
      }, 5000);
  
      return () => clearInterval(interval);
    }
  }, [currentIndex, isAnimating, selectedMeme]);

  return (
    <>
      <div className={`relative overflow-hidden rounded-2xl ${className || ""}`}>
        <div className="relative aspect-video bg-muted overflow-hidden">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="w-12 h-12 rounded-full border-4 border-mentii-300 border-t-mentii-600 animate-spin"></div>
            </div>
          ) : (
            <>
              {/* Current meme */}
              <div
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                  isAnimating ? "opacity-0" : "opacity-100"
                }`}
                onClick={() => openMemeDialog(memes[currentIndex])}
              >
                <img
                  src={memes[currentIndex].url}
                  alt={memes[currentIndex].title}
                  className="w-full h-full object-cover cursor-pointer"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-white text-shadow text-lg font-medium">
                    {memes[currentIndex].title}
                  </h3>
                  <div className="flex items-center mt-2">
                    <span className="text-white text-sm flex items-center">
                      <ThumbsUp size={16} className="mr-1" />
                      {memes[currentIndex].likes}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(memes[currentIndex]);
                      }}
                      className={`ml-3 p-1 rounded-full ${
                        userLikes.has(memes[currentIndex].id) 
                          ? "bg-mentii-500 text-white" 
                          : "bg-white/20 text-white"
                      }`}
                      aria-label="Like meme"
                    >
                      <ThumbsUp size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(memes[currentIndex]);
                      }}
                      className="ml-2 p-1 rounded-full bg-white/20 text-white"
                      aria-label="Share meme"
                    >
                      <Share size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevMeme();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
                aria-label="Previous meme"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextMeme();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-all z-10"
                aria-label="Next meme"
              >
                <ArrowRight size={20} />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 z-10">
                <div className="flex space-x-2">
                  {memes.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentIndex === index
                          ? "bg-white w-4"
                          : "bg-white/50"
                      }`}
                      aria-label={`Go to meme ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className="absolute top-3 right-3 z-20 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-all"
          aria-label="Refresh memes"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 0 1-9 9c-4.97 0-9-4.03-9-9s4.03-9 9-9h3.59l-4.3 4.29 1.42 1.42L21 1.42l-8.3 8.29 1.42 1.42L18.41 7H12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5" />
          </svg>
        </button>
      </div>

      {/* Meme Dialog */}
      <Dialog open={!!selectedMeme} onOpenChange={(open) => !open && closeMemeDialog()}>
        <DialogContent className="sm:max-w-[700px] p-0 bg-transparent border-none shadow-none">
          <div className="bg-white rounded-lg overflow-hidden relative">
            <button
              onClick={closeMemeDialog}
              className="absolute right-3 top-3 z-50 bg-black/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/40 transition-all"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>

            {selectedMeme && (
              <>
                <div className="p-4 bg-gradient-to-r from-mentii-500 to-lavender-500 text-white">
                  <DialogTitle className="text-white">{selectedMeme.title}</DialogTitle>
                </div>
                
                <div className="p-6">
                  <div className="relative max-h-[60vh] overflow-hidden rounded-lg mb-4">
                    <img
                      src={selectedMeme.url}
                      alt={selectedMeme.title}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center">
                      <span className="font-medium flex items-center">
                        <ThumbsUp size={18} className="mr-1" />
                        {selectedMeme.likes} likes
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleLike(selectedMeme)}
                        className={`px-4 py-2 rounded-full flex items-center ${
                          userLikes.has(selectedMeme.id) 
                            ? "bg-mentii-500 text-white" 
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <ThumbsUp size={18} className="mr-2" />
                        {userLikes.has(selectedMeme.id) ? "Liked" : "Like"}
                      </button>
                      <button
                        onClick={() => handleShare(selectedMeme)}
                        className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 flex items-center"
                      >
                        <Share size={18} className="mr-2" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MemeCarousel;
