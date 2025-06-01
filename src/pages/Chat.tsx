import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Send, Mic, MicOff, SmilePlus, Bot, UserRound, Trash2, Video, VideoOff, Phone, PhoneOff, Users, Volume2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateChatResponse } from "../utils/geminiApi";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Atom } from "@/components/ui/atom";
import { openPlayAI, closePlayAI } from "@/utils/chatUtils";
import { switchPersona } from "@/utils/playAIConfig";
import CallService from "@/components/chat/CallService";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface QuickResponse {
  text: string;
  category: "anxious" | "sad" | "stressed" | "general";
}

interface Expert {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  available: boolean;
}

interface CalmZoneAgent {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  available: boolean;
}

const calmZoneAgents: CalmZoneAgent[] = [
  {
    id: "agent1",
    name: "Mentii Bot",
    specialty: "General Support",
    avatar: "https://i.pravatar.cc/150?img=10",
    available: true
  },
  {
    id: "agent2",
    name: "Calm Guide",
    specialty: "Meditation & Mindfulness",
    avatar: "https://i.pravatar.cc/150?img=25",
    available: true
  },
  {
    id: "agent3",
    name: "Sleep Coach",
    specialty: "Better Sleep & Rest",
    avatar: "https://i.pravatar.cc/150?img=32",
    available: true
  },
  {
    id: "agent4",
    name: "Anxiety Helper",
    specialty: "Anxiety & Stress Management",
    avatar: "https://i.pravatar.cc/150?img=49",
    available: true
  }
];

const Chat: React.FC = () => {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi there! I'm Mentii, your mental health companion. How are you feeling today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [showExpertToggle, setShowExpertToggle] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<CalmZoneAgent>(calmZoneAgents[0]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [isMirrorConnected, setIsMirrorConnected] = useState(false);
  const [activePersona, setActivePersona] = useState<'srk' | 'ratanTata'>('ratanTata');
  const [showMirrorOptions, setShowMirrorOptions] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const experts: Expert[] = [
    {
      id: "expert1",
      name: "Dr. Sarah Johnson",
      specialty: "Anxiety & Depression",
      avatar: "https://i.pravatar.cc/150?img=20",
      available: true
    },
    {
      id: "expert2",
      name: "Dr. Michael Chen",
      specialty: "Sleep Disorders",
      avatar: "https://i.pravatar.cc/150?img=11",
      available: true
    },
    {
      id: "expert3",
      name: "Dr. Yash Ahir", 
      specialty: "Mindfulness & Meditation", 
      avatar: "https://i.pravatar.cc/150?img=68",
      available: false
    },
    {
      id: "expert4",
      name: "Dr. Meera Kapoor", 
      specialty: "Relationship Counseling", 
      avatar: "https://i.pravatar.cc/150?img=45",
      available: true
    }
  ];
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };
  
  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    try {
      const response = await generateChatResponse(text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting chatbot response:", error);
      
      toast({
        title: "Error",
        description: "Failed to get response. Please try again later.",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble responding right now. Could you try again in a moment?",
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      setTimeout(() => {
        setInputValue("I'm feeling a bit stressed today");
        setIsRecording(false);
        toast({
          title: "Voice detected",
          description: "Speech recognition completed",
        });
      }, 3000);
    }
  };
  
  const handleQuickResponse = (text: string) => {
    sendMessage(text);
  };
  
  const clearChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        text: "Chat cleared. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };
  
  const toggleVideo = () => {
    setShowVideoDialog(true);
    setIsVideoOn(true);
  };
  
  const toggleCall = () => {
    setShowCallDialog(true);
    setIsCallActive(true);
  };
  
  const handleSelectExpert = (expert: Expert) => {
    if (!expert.available) {
      toast({
        title: "Expert unavailable",
        description: `${expert.name} is currently unavailable. Please try again later.`,
        variant: "destructive",
      });
      return;
    }
    
    setSelectedExpert(expert);
    setSelectedAgent(null as any);
    setShowExpertToggle(false);
    
    setMessages(prev => [
      ...prev,
      {
        id: `expert-change-${Date.now()}`,
        text: `You are now chatting with ${expert.name}, specialist in ${expert.specialty}.`,
        sender: "bot",
        timestamp: new Date(),
      }
    ]);
    
    toast({
      title: "Expert connected",
      description: `You're now connected with ${expert.name}`,
    });
  };

  const handleSelectAgent = (agent: CalmZoneAgent) => {
    setSelectedAgent(agent);
    setSelectedExpert(null);
    setShowExpertToggle(false);
    
    setMessages(prev => [
      ...prev,
      {
        id: `agent-change-${Date.now()}`,
        text: `You are now chatting with ${agent.name}, ${agent.specialty} specialist.`,
        sender: "bot",
        timestamp: new Date(),
      }
    ]);
    
    toast({
      title: "Agent connected",
      description: `You're now connected with ${agent.name}`,
    });
  };
  
  const handleAddEmoji = (emoji: string) => {
    setInputValue(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleMirrorAction = async (action: 'srk' | 'ratanTata' | 'dispose') => {
    if (action === 'dispose') {
      try {
        await closePlayAI();
        setIsMirrorConnected(false);
        toast({
          title: "Mirror AI",
          description: "Mirror AI disconnected successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to disconnect Mirror AI",
          variant: "destructive",
        });
      }
    } else {
      try {
        switchPersona(action);
        await openPlayAI();
        setIsMirrorConnected(true);
        setActivePersona(action);
        toast({
          title: "Mirror AI",
          description: `Connected to ${action === 'srk' ? 'SRK' : 'Ratan Tata'} AI`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to connect to Mirror AI",
          variant: "destructive",
        });
      }
    }
    setShowMirrorOptions(false);
  };
  
  const quickResponses: QuickResponse[] = [
    { text: "I'm feeling anxious", category: "anxious" },
    { text: "I can't sleep", category: "anxious" },
    { text: "I'm having a panic attack", category: "anxious" },
    { text: "I feel sad today", category: "sad" },
    { text: "I feel lonely", category: "sad" },
    { text: "I don't feel like doing anything", category: "sad" },
    { text: "I'm overwhelmed with work", category: "stressed" },
    { text: "I need to relax", category: "stressed" },
    { text: "I'm worried about the future", category: "stressed" },
    { text: "Can you help me feel better?", category: "general" },
    { text: "Tell me a joke", category: "general" },
    { text: "I need a distraction", category: "general" },
  ];
  
  const filteredResponses = activeCategory === "all" 
    ? quickResponses 
    : quickResponses.filter(r => r.category === activeCategory);
  
  const popularEmojis = ["😊", "👍", "❤️", "😂", "🙏", "😎", "🤔", "😢", "😍", "👋", "🌟"];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Chat with Mentii</h1>
          <p className="text-center text-lg text-muted-foreground mb-8">
            Your AI companion for mental wellness. Share your thoughts and feelings in a safe space.
          </p>
          
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/90 shadow-lg overflow-hidden border-mentii-200">
              <div className="bg-gradient-to-r from-mentii-500 to-lavender-500 p-4 text-white flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    {selectedExpert ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedExpert.avatar} alt={selectedExpert.name} />
                        <AvatarFallback>{selectedExpert.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedAgent.avatar} alt={selectedAgent.name} />
                        <AvatarFallback>{selectedAgent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{selectedExpert ? selectedExpert.name : selectedAgent.name}</h3>
                    <p className="text-xs opacity-90">
                      {selectedExpert ? selectedExpert.specialty : selectedAgent.specialty}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => setShowExpertToggle(!showExpertToggle)}
                    variant="ghost"
                    className="text-white hover:bg-white/20 p-2 rounded-full"
                    aria-label="Switch expert"
                    title="Switch expert"
                  >
                    <Users className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    onClick={toggleVideo}
                    variant="ghost"
                    className={`text-white hover:bg-white/20 p-2 rounded-full ${isVideoOn ? 'bg-white/20' : ''}`}
                    aria-label={isVideoOn ? "Turn off video" : "Turn on video"}
                    title={isVideoOn ? "Turn off video" : "Turn on video"}
                  >
                    {isVideoOn ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                  </Button>
                  
                  <Button 
                    onClick={toggleCall}
                    variant="ghost"
                    className={`text-white hover:bg-white/20 p-2 rounded-full ${isCallActive ? 'bg-white/20' : ''}`}
                    aria-label={isCallActive ? "End call" : "Start call"}
                    title={isCallActive ? "End call" : "Start call"}
                  >
                    {isCallActive ? <PhoneOff className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
                  </Button>
                  
                  <Popover open={showMirrorOptions} onOpenChange={setShowMirrorOptions}>
                    <PopoverTrigger asChild>
                      <Button 
                        className={`relative px-3 py-1.5 ${
                          isMirrorConnected 
                            ? "bg-gradient-to-r from-teal-600 to-cyan-600" 
                            : "bg-gradient-to-r from-purple-600 to-indigo-600"
                        } text-white rounded-md overflow-hidden group hidden sm:flex`}
                      >
                        <Atom className={`h-4 w-4 mr-2 ${
                          isMirrorConnected ? "text-teal-400" : "text-purple-400"
                        }`} />
                        <span className="relative z-10 font-medium">
                          {isMirrorConnected ? "Connected" : "Mirror"}
                        </span>
                        <span className={`absolute inset-0 ${
                          isMirrorConnected
                            ? "bg-gradient-to-r from-teal-400 to-cyan-400"
                            : "bg-gradient-to-r from-purple-400 to-indigo-400"
                        } opacity-0 group-hover:opacity-70 blur-md transition-opacity duration-300`}></span>
                        <span className={`absolute inset-0 ${
                          isMirrorConnected
                            ? "bg-gradient-to-r from-teal-600 to-cyan-600"
                            : "bg-gradient-to-r from-purple-600 to-indigo-600"
                        } animate-pulse opacity-50`}></span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2">
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleMirrorAction('srk')}
                        >
                          <span className="mr-2">🎭</span>
                          SRK AI
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => handleMirrorAction('ratanTata')}
                        >
                          <span className="mr-2">👔</span>
                          Ratan Tata AI
                        </Button>
                        <Button
                          className="w-full justify-start bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 relative overflow-hidden group"
                          onClick={() => window.open('https://one-chat-mentii.vercel.app/', '_blank')}
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-70 blur-md transition-opacity duration-300"></span>
                          <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse opacity-50"></span>
                          <span className="relative z-10 flex items-center">
                            <span className="mr-2">✨</span>
                            Mirror AI
                          </span>
                        </Button>
                        {isMirrorConnected && (
                          <Button
                            variant="destructive"
                            className="w-full justify-start"
                            onClick={() => handleMirrorAction('dispose')}
                          >
                            <span className="mr-2">❌</span>
                            Disconnect
                          </Button>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Button 
                    onClick={clearChat} 
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Clear chat"
                    title="Clear chat"
                    variant="ghost"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              {showExpertToggle && (
                <div className="p-4 border-b border-gray-200 bg-white">
                  <Tabs defaultValue="agents">
                    <TabsList className="mb-3 w-full grid grid-cols-2 h-auto">
                      <TabsTrigger value="agents" className="py-1 px-2 text-xs sm:text-sm">Calm Zone Agents</TabsTrigger>
                      <TabsTrigger value="experts" className="py-1 px-2 text-xs sm:text-sm">Mental Health Experts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="agents" className="mt-0">
                      <h4 className="text-sm font-medium mb-3">Select an AI agent:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {calmZoneAgents.map(agent => (
                          <div 
                            key={agent.id}
                            onClick={() => handleSelectAgent(agent)}
                            className={`cursor-pointer border rounded-lg p-3 transition-colors ${
                              selectedAgent?.id === agent.id 
                                ? 'border-mentii-500 bg-mentii-50' 
                                : 'border-gray-200 hover:border-mentii-300'
                            }`}
                          >
                            <div className="flex items-center mb-2">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={agent.avatar} alt={agent.name} />
                                <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="text-sm font-medium truncate">{agent.name}</div>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">{agent.specialty}</div>
                            <div className="text-xs text-green-600">Available</div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="experts" className="mt-0">
                      <h4 className="text-sm font-medium mb-3">Connect with a human expert:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {experts.map(expert => (
                          <div 
                            key={expert.id}
                            onClick={() => handleSelectExpert(expert)}
                            className={`cursor-pointer border rounded-lg p-3 transition-colors ${
                              selectedExpert?.id === expert.id 
                                ? 'border-mentii-500 bg-mentii-50' 
                                : 'border-gray-200 hover:border-mentii-300'
                            } ${expert.available ? '' : 'opacity-60'}`}
                          >
                            <div className="flex items-center mb-2">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={expert.avatar} alt={expert.name} />
                                <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="text-sm font-medium truncate">{expert.name}</div>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">{expert.specialty}</div>
                            <div className={`text-xs ${expert.available ? 'text-green-600' : 'text-red-500'}`}>
                              {expert.available ? 'Available' : 'Unavailable'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
              
              <div className="h-[400px] overflow-y-auto p-4 bg-gray-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-8 h-8 rounded-full bg-mentii-100 flex items-center justify-center mr-2 flex-shrink-0">
                        {selectedExpert ? (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={selectedExpert.avatar} alt={selectedExpert.name} />
                            <AvatarFallback>{selectedExpert.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={selectedAgent.avatar} alt={selectedAgent.name} />
                            <AvatarFallback>{selectedAgent.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] p-3 rounded-lg ${
                        msg.sender === "user"
                          ? "bg-mentii-500 text-white rounded-tr-none"
                          : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    
                    {msg.sender === "user" && (
                      <div className="w-8 h-8 rounded-full bg-mentii-100 flex items-center justify-center ml-2 flex-shrink-0">
                        <UserRound className="h-4 w-4 text-mentii-600" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex mb-4">
                    <div className="w-8 h-8 rounded-full bg-mentii-100 flex items-center justify-center mr-2">
                      {selectedExpert ? (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={selectedExpert.avatar} alt={selectedExpert.name} />
                          <AvatarFallback>{selectedExpert.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={selectedAgent.avatar} alt={selectedAgent.name} />
                          <AvatarFallback>{selectedAgent.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                    <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef}></div>
              </div>
              
              <div className="border-t border-gray-200 p-4 bg-white">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Quick responses:</h4>
                <Tabs defaultValue="general" onValueChange={setActiveCategory}>
                  <TabsList className="mb-2 w-full grid grid-cols-4 h-auto">
                    <TabsTrigger value="general" className="py-1 px-2 text-xs">General</TabsTrigger>
                    <TabsTrigger value="anxious" className="py-1 px-2 text-xs">Anxious</TabsTrigger>
                    <TabsTrigger value="sad" className="py-1 px-2 text-xs">Sad</TabsTrigger>
                    <TabsTrigger value="stressed" className="py-1 px-2 text-xs">Stressed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeCategory} className="m-0">
                    <div className="flex flex-wrap gap-2">
                      {filteredResponses.map((response, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickResponse(response.text)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-full transition-colors"
                        >
                          {response.text}
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <form
                onSubmit={handleSubmit}
                className="p-4 border-t border-gray-200 bg-white flex items-center gap-2"
              >
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      className="p-2 text-gray-500 hover:text-mentii-500 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Add emoji"
                      variant="ghost"
                      size="icon"
                    >
                      <SmilePlus className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] p-2">
                    <div className="grid grid-cols-6 gap-2">
                      {popularEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAddEmoji(emoji)}
                          className="text-xl hover:bg-gray-100 p-1 rounded transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-mentii-500"
                />
                
                <Button
                  type="button"
                  onClick={toggleRecording}
                  className={`p-2 rounded-full ${
                    isRecording 
                      ? "text-red-500 bg-red-50" 
                      : "text-gray-500 hover:text-mentii-500 hover:bg-gray-100"
                  } transition-colors`}
                  aria-label={isRecording ? "Stop recording" : "Start recording"}
                  variant="ghost"
                  size="icon"
                >
                  {isRecording ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
                
                <Button
                  type="submit"
                  className="bg-mentii-500 text-white p-2 rounded-full hover:bg-mentii-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!inputValue.trim() && !isRecording}
                  aria-label="Send message"
                  size="icon"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </Card>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Need immediate help? This is an AI chatbot and not a crisis service.</p>
              <p className="mt-1">If you're in crisis, please call your local emergency number or a mental health helpline.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="max-w-3xl p-0 h-[80vh] max-h-[600px] flex flex-col overflow-hidden">
          <div className="h-full">
            <CallService 
              isVideoCall={true}
              recipientData={{
                id: selectedExpert ? selectedExpert.id : selectedAgent.id,
                name: selectedExpert ? selectedExpert.name : selectedAgent.name,
                avatar: selectedExpert ? selectedExpert.avatar : selectedAgent.avatar
              }}
              onEndCall={() => {
                setShowVideoDialog(false);
                setIsVideoOn(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="max-w-md p-0 h-[80vh] max-h-[500px] flex flex-col overflow-hidden">
          <div className="h-full">
            <CallService 
              isVideoCall={false}
              recipientData={{
                id: selectedExpert ? selectedExpert.id : selectedAgent.id,
                name: selectedExpert ? selectedExpert.name : selectedAgent.name,
                avatar: selectedExpert ? selectedExpert.avatar : selectedAgent.avatar
              }}
              onEndCall={() => {
                setShowCallDialog(false);
                setIsCallActive(false);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Chat;
