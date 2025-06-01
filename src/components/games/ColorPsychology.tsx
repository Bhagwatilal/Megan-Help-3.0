import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface ColorOption {
  color: string;
  name: string;
  description: string;
  psychology: string;
  mood: "energetic" | "creative" | "calm" | "optimistic" | "focused" | "passionate" | "balanced" | "refreshed";
}

interface MoodSuggestion {
  mood: string;
  emoji: string;
  description: string;
  activities: string[];
}

const ColorPsychology: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("choose");
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [userMood, setUserMood] = useState<string | null>(null);
  const [suggestedActivities, setSuggestedActivities] = useState<string[]>([]);
  
  const colors: ColorOption[] = [
    {
      color: "#FF5733",
      name: "Vibrant Red",
      description: "A warm, energetic color that grabs attention",
      psychology: "Red is associated with energy, passion, and excitement. It can increase heart rate and stimulate appetite.",
      mood: "energetic"
    },
    {
      color: "#FFC300",
      name: "Bright Yellow",
      description: "A cheerful, optimistic color that radiates warmth",
      psychology: "Yellow is linked to happiness, optimism, and mental stimulation. It can help with focus and creativity.",
      mood: "optimistic"
    },
    {
      color: "#36D7B7",
      name: "Turquoise",
      description: "A refreshing blend of blue and green",
      psychology: "Turquoise represents calm, clarity, and communication. It has a balancing and refreshing effect.",
      mood: "refreshed"
    },
    {
      color: "#3498DB",
      name: "Sky Blue",
      description: "A peaceful, serene color reminiscent of clear skies",
      psychology: "Blue evokes feelings of calmness, trust, and reliability. It can lower blood pressure and heart rate.",
      mood: "calm"
    },
    {
      color: "#9B59B6",
      name: "Royal Purple",
      description: "A rich, creative color associated with luxury",
      psychology: "Purple combines the stability of blue and the energy of red, representing creativity, wisdom, and luxury.",
      mood: "creative"
    },
    {
      color: "#E74C3C",
      name: "Deep Red",
      description: "A powerful, passionate color",
      psychology: "Deep red signals power, determination, and passion. It can evoke strong emotions and create urgency.",
      mood: "passionate"
    },
    {
      color: "#F39C12",
      name: "Orange",
      description: "A warm, energetic color between red and yellow",
      psychology: "Orange combines the energy of red with the happiness of yellow. It represents enthusiasm, creativity, and determination.",
      mood: "creative"
    },
    {
      color: "#2ECC71",
      name: "Green",
      description: "A natural, balanced color associated with growth",
      psychology: "Green symbolizes growth, harmony, and healing. It's the most restful color for the human eye and can reduce anxiety.",
      mood: "balanced"
    },
    {
      color: "#1ABC9C",
      name: "Teal",
      description: "A sophisticated blend of blue and green",
      psychology: "Teal represents mental clarity and emotional balance. It's both calming and refreshing.",
      mood: "balanced"
    },
    {
      color: "#34495E",
      name: "Navy Blue",
      description: "A deep, focused color associated with depth",
      psychology: "Navy blue conveys intelligence, integrity, and depth. It helps with concentration and logical thinking.",
      mood: "focused"
    },
    {
      color: "#16A085",
      name: "Emerald",
      description: "A rich, vibrant shade of green",
      psychology: "Emerald green represents growth, renewal, and abundance. It has a balancing and harmonizing effect.",
      mood: "balanced"
    },
    {
      color: "#8E44AD",
      name: "Deep Purple",
      description: "A mysterious, creative color",
      psychology: "Deep purple is associated with mystery, spirituality, and creativity. It can stimulate imagination and intuition.",
      mood: "creative"
    }
  ];
  
  const moodSuggestions: MoodSuggestion[] = [
    {
      mood: "energetic",
      emoji: "⚡",
      description: "You're feeling energetic and ready for action. Your mind is alert and your body feels charged.",
      activities: [
        "Go for a brisk walk or jog",
        "Try a new workout routine",
        "Dance to your favorite upbeat music",
        "Start a project you've been putting off",
        "Clean and organize your space"
      ]
    },
    {
      mood: "creative",
      emoji: "🎨",
      description: "Your creative juices are flowing. Your mind is open to new ideas and possibilities.",
      activities: [
        "Draw or paint something",
        "Write in a journal or start a story",
        "Try a new recipe",
        "Listen to inspiring music",
        "Visit our drawing activity section"
      ]
    },
    {
      mood: "calm",
      emoji: "😌",
      description: "You're feeling peaceful and relaxed. Your mind is clear and your body is at ease.",
      activities: [
        "Practice deep breathing exercises",
        "Try a guided meditation",
        "Read a book in a comfortable spot",
        "Take a warm bath",
        "Listen to calming music"
      ]
    },
    {
      mood: "optimistic",
      emoji: "😊",
      description: "You're feeling positive and hopeful. You see the bright side of things and feel good about the future.",
      activities: [
        "Make a gratitude list",
        "Reach out to a friend",
        "Plan something to look forward to",
        "Spend time outdoors in nature",
        "Listen to uplifting podcasts or music"
      ]
    },
    {
      mood: "focused",
      emoji: "🧠",
      description: "Your mind is sharp and concentrated. You're ready to tackle complex tasks and solve problems.",
      activities: [
        "Work on puzzles or brain teasers",
        "Learn something new",
        "Organize your tasks and set priorities",
        "Create a detailed plan for a project",
        "Try the Mind Games section"
      ]
    },
    {
      mood: "passionate",
      emoji: "❤️",
      description: "You're feeling intense emotion and drive. Your heart is engaged and you care deeply.",
      activities: [
        "Express your feelings through art or writing",
        "Connect with loved ones",
        "Work on something meaningful to you",
        "Listen to emotional music",
        "Volunteer or help someone"
      ]
    },
    {
      mood: "balanced",
      emoji: "⚖️",
      description: "You're feeling centered and harmonious. Your mind and body are in sync.",
      activities: [
        "Practice yoga or gentle stretching",
        "Spend time in nature",
        "Engage in mindful activities",
        "Journal about what's working well in your life",
        "Create a balanced meal"
      ]
    },
    {
      mood: "refreshed",
      emoji: "🌊",
      description: "You're feeling renewed and recharged. Your mind is clear and you feel ready for what's next.",
      activities: [
        "Set new goals or intentions",
        "Reorganize your space",
        "Try something new",
        "Connect with friends",
        "Plan your next steps"
      ]
    }
  ];
  
  const handleColorSelect = (color: ColorOption) => {
    setSelectedColor(color);
    setUserMood(color.mood);
    
    // Find the corresponding mood suggestion
    const moodData = moodSuggestions.find(m => m.mood === color.mood);
    if (moodData) {
      setSuggestedActivities(moodData.activities);
      
      // Show toast with mood detection
      toast({
        title: `Mood Detected: ${color.mood}`,
        description: `${moodData.emoji} ${moodData.description}`,
      });
    }
    
    // Move to results tab
    setActiveTab("results");
  };
  
  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card className="border-2 border-mentii-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Color Psychology</CardTitle>
          <CardDescription>
            Colors can reveal a lot about your current emotional state. Choose the color that appeals to you the most right now.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="choose">Choose Colors</TabsTrigger>
              <TabsTrigger value="results" disabled={!selectedColor}>Your Results</TabsTrigger>
            </TabsList>
            
            <TabsContent value="choose" className="mt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => handleColorSelect(color)}
                  >
                    <div
                      className="w-full aspect-square rounded-md mb-2 shadow-md"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className="text-sm font-medium">{color.name}</span>
                  </div>
                ))}
              </div>
              
              <p className="mt-6 text-center text-sm text-muted-foreground">
                Choose the color that draws you in or feels most appealing right now.
              </p>
            </TabsContent>
            
            <TabsContent value="results" className="mt-6">
              {selectedColor && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div
                      className="w-full md:w-1/3 aspect-square rounded-md shadow-md"
                      style={{ backgroundColor: selectedColor.color }}
                    />
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{selectedColor.name}</h3>
                      <p className="mb-4">{selectedColor.description}</p>
                      
                      <h4 className="font-semibold mb-2">Color Psychology:</h4>
                      <p className="mb-4">{selectedColor.psychology}</p>
                      
                      {userMood && (
                        <>
                          <h4 className="font-semibold mb-2">Your Current Mood:</h4>
                          <div className="p-4 bg-mentii-50 rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">
                                {moodSuggestions.find(m => m.mood === userMood)?.emoji}
                              </span>
                              <span className="font-medium capitalize">{userMood}</span>
                            </div>
                            <p>
                              {moodSuggestions.find(m => m.mood === userMood)?.description}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {suggestedActivities.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">Suggested Activities for Your Mood</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {suggestedActivities.map((activity, index) => (
                          <div key={index} className="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                            <p className="font-medium">{activity}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 text-center">
                        <h3 className="text-lg font-semibold mb-4">Ready to explore more activities?</h3>
                        <div className="flex flex-wrap gap-4 justify-center">
                          <Link 
                            to="/activities" 
                            className="px-6 py-3 bg-mentii-500 text-white rounded-md hover:bg-mentii-600 transition-colors"
                          >
                            Try Mind Games
                          </Link>
                          <Link 
                            to="/music" 
                            className="px-6 py-3 bg-lavender-500 text-white rounded-md hover:bg-lavender-600 transition-colors"
                          >
                            Mood Music
                          </Link>
                          <Link 
                            to="/journal" 
                            className="px-6 py-3 bg-sunset-500 text-white rounded-md hover:bg-sunset-600 transition-colors"
                          >
                            Journal Your Thoughts
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => {
                        setSelectedColor(null);
                        setUserMood(null);
                        setSuggestedActivities([]);
                        setActiveTab("choose");
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Choose Another Color
                    </button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">About Color Psychology</h2>
        <p className="mb-4">
          Color psychology is the study of how colors affect human behavior, mood, and physiological reactions. Different colors can evoke different feelings and responses.
        </p>
        <p className="mb-4">
          The colors you're drawn to can reveal a lot about your current emotional state. Your color preferences might change based on your mood, needs, or life circumstances.
        </p>
        <p>
          This simple exercise helps you understand your current emotional state and suggests activities that might complement or balance your mood.
        </p>
      </div>
    </div>
  );
};

export default ColorPsychology;
