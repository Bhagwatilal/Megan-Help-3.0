
import React, { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, Heart, MessageCircle, Music, User, Users, 
  BookCopy, HeartPulse, Globe, Scroll, Send, Volume2, 
  MicOff, Video, VideoOff, Mic, Phone, X, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import RemediesSection from "./RemediesSection";
import CommunitySection from "./CommunitySection";
import MeditationSection from "./MeditationSection";
import BookReadingSection from "./BookReadingSection";
import BecomeMemberSection from "./BecomeMemberSection";

const CalmZoneSection: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("remedies");
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [liveChatMessages, setLiveChatMessages] = useState<{sender: string; message: string; isUser?: boolean}[]>([
    {sender: "Calm Zone Support", message: "Welcome to Calm Zone live chat! How can we help you today?"}
  ]);
  const [newChatMessage, setNewChatMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    issue: "",
    details: "",
  });
  const [isSupportLoading, setIsSupportLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const supportResponseRef = useRef<string | null>(null);

  const handleJoinCommunity = () => {
    setSelectedTab("community");
    toast.success("Welcome to the Calm Zone Community!", {
      description: "Connect with others and share your wellness journey"
    });
  };

  const handleLiveChat = () => {
    setShowLiveChat(true);
  };
  
  const handleCloseLiveChat = () => {
    setShowLiveChat(false);
  };
  
  const sendChatMessage = () => {
    if (!newChatMessage.trim()) return;
    
    // Add user message
    const userMessage = {
      sender: "You",
      message: newChatMessage,
      isUser: true
    };
    
    setLiveChatMessages([...liveChatMessages, userMessage]);
    setNewChatMessage("");
    setIsChatLoading(true);
    
    // Scroll to bottom
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    
    // Simulate response after a delay
    setTimeout(() => {
      const botResponse = getBotResponse(newChatMessage);
      setLiveChatMessages(prev => [...prev, {
        sender: "Calm Zone Support",
        message: botResponse
      }]);
      setIsChatLoading(false);
      
      // Scroll to bottom again
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 1500);
  };
  
  // Generate automated responses
  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("stress")) {
      return "I understand that anxiety can be challenging. Have you tried our deep breathing exercises in the Remedies section? Many users find them helpful for immediate relief. Would you like me to suggest some specific techniques?";
    } else if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia") || lowerMessage.includes("tired")) {
      return "Sleep issues can significantly impact wellbeing. Our guided meditation for sleep might help you. Also, establishing a regular sleep schedule and avoiding screens before bed can make a difference. Would you like to try our Sleep Better resources?";
    } else if (lowerMessage.includes("meditat") || lowerMessage.includes("mind")) {
      return "Meditation is a wonderful practice! We have both guided sessions and traditional mantras in our Meditation section. For beginners, I recommend starting with just 5 minutes daily. Would you like me to suggest a specific meditation to try?";
    } else if (lowerMessage.includes("depress") || lowerMessage.includes("sad") || lowerMessage.includes("low")) {
      return "I'm sorry to hear you're feeling this way. While we offer resources that may help with mood, it's also important to reach out to a healthcare professional. Would you like me to connect you with one of our wellness consultants for a free session?";
    } else if (lowerMessage.includes("thank")) {
      return "You're very welcome! I'm here to support your wellbeing journey. Is there anything else I can help with today?";
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! Welcome to Calm Zone. I'm here to help you find resources for your mental wellbeing. Feel free to ask about meditation, stress relief, sleep improvement, or our community support options.";
    } else {
      return "Thank you for reaching out. I'm here to support your wellbeing journey. Can you share a bit more about what specific areas you're interested in exploring? We have resources for meditation, anxiety relief, sleep improvement, and community support.";
    }
  };

  const handleGetSupport = () => {
    setShowSupport(true);
  };
  
  const handleCloseSupport = () => {
    setShowSupport(false);
    // Reset form if there was a response
    if (supportResponseRef.current) {
      setSupportForm({
        name: "",
        email: "",
        issue: "",
        details: "",
      });
      supportResponseRef.current = null;
    }
  };
  
  const handleSupportFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSupportForm({
      ...supportForm,
      [name]: value
    });
  };
  
  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!supportForm.name || !supportForm.email || !supportForm.issue) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    setIsSupportLoading(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSupportLoading(false);
      supportResponseRef.current = "Your support request has been submitted. Our team will contact you within 24 hours at " + supportForm.email;
      toast.success("Support request submitted successfully", {
        description: "We'll get back to you within 24 hours"
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-mentii-100 to-sunset-100 rounded-lg p-8 text-center">
        <Heart className="h-12 w-12 mx-auto mb-4 text-rose-500" />
        <h3 className="text-2xl font-bold mb-2">Welcome to Calm Zone</h3>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          A safe space for relaxation, meditation, and community support. 
          Connect with others, find resources, and contribute to mental wellness.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button className="bg-rose-500 hover:bg-rose-600" onClick={handleJoinCommunity}>
            <Heart className="mr-2 h-4 w-4" />
            Join Community
          </Button>
          <Button variant="outline" onClick={handleLiveChat}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Live Chat
            {showLiveChat && (
              <span className="ml-2 relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mentii-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-mentii-500"></span>
              </span>
            )}
          </Button>
          <Button variant="secondary" onClick={handleGetSupport}>
            <HeartPulse className="mr-2 h-4 w-4" />
            Get Support
          </Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="mb-8 flex justify-center space-x-1 rounded-lg bg-muted p-1 overflow-auto">
          <TabsTrigger value="remedies" className="rounded-md px-3">
            <HeartPulse className="mr-2 h-4 w-4" />
            Remedies
          </TabsTrigger>
          <TabsTrigger value="community" className="rounded-md px-3">
            <Users className="mr-2 h-4 w-4" />
            Community
          </TabsTrigger>
          <TabsTrigger value="meditation" className="rounded-md px-3">
            <Music className="mr-2 h-4 w-4" />
            Meditation
          </TabsTrigger>
          <TabsTrigger value="books" className="rounded-md px-3">
            <BookOpen className="mr-2 h-4 w-4" />
            Books
          </TabsTrigger>
          <TabsTrigger value="become-member" className="rounded-md px-3">
            <User className="mr-2 h-4 w-4" />
            Become a Member
          </TabsTrigger>
        </TabsList>

        <TabsContent value="remedies">
          <RemediesSection />
        </TabsContent>

        <TabsContent value="community">
          <CommunitySection />
        </TabsContent>

        <TabsContent value="meditation">
          <MeditationSection />
        </TabsContent>

        <TabsContent value="books">
          <BookReadingSection />
        </TabsContent>

        <TabsContent value="become-member">
          <BecomeMemberSection />
        </TabsContent>
      </Tabs>
      
      {/* Live Chat Sheet */}
      <Sheet open={showLiveChat} onOpenChange={handleCloseLiveChat}>
        <SheetContent className="sm:max-w-md p-0 flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between bg-mentii-50">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://i.pravatar.cc/150?img=5" />
                <AvatarFallback>CZ</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">Calm Zone Support</h3>
                <p className="text-xs text-muted-foreground">Online • Typically replies in minutes</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleCloseLiveChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
            <div className="space-y-4">
              {liveChatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex items-start gap-3 ${msg.isUser ? 'justify-end' : ''}`}
                >
                  {!msg.isUser && (
                    <div className="bg-mentii-100 rounded-full p-2 text-mentii-500 flex-shrink-0">
                      <Heart className="h-4 w-4" />
                    </div>
                  )}
                  
                  <div className={`p-3 rounded-lg shadow-sm max-w-[80%] ${
                    msg.isUser 
                      ? 'bg-mentii-500 text-white' 
                      : 'bg-white'
                  }`}>
                    {!msg.isUser && (
                      <p className="text-sm font-medium mb-1">{msg.sender}</p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className={`text-xs text-right mt-1 ${
                      msg.isUser ? 'text-mentii-100' : 'text-slate-400'
                    }`}>
                      {index === liveChatMessages.length - 1 && isChatLoading && !msg.isUser
                        ? 'Typing...'
                        : 'Just now'
                      }
                    </p>
                  </div>
                </div>
              ))}
              
              {isChatLoading && liveChatMessages[liveChatMessages.length - 1].isUser && (
                <div className="flex items-start gap-3">
                  <div className="bg-mentii-100 rounded-full p-2 text-mentii-500 flex-shrink-0">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-medium mb-1">Calm Zone Support</p>
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                      <div className="h-2 w-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
          </div>
          
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage();
                  }
                }}
                disabled={isChatLoading}
              />
              <Button 
                onClick={sendChatMessage} 
                disabled={!newChatMessage.trim() || isChatLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex justify-between mt-3 border-t pt-3">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Video className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Support Request Sheet */}
      <Sheet open={showSupport} onOpenChange={handleCloseSupport}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Get Support</SheetTitle>
            <SheetDescription>
              Submit your request and our team will get back to you
            </SheetDescription>
          </SheetHeader>
          
          {supportResponseRef.current ? (
            <div className="mt-6 space-y-6">
              <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-lg mb-2">Request Submitted</h3>
                <p className="text-muted-foreground mb-4">{supportResponseRef.current}</p>
                <Button variant="outline" onClick={handleCloseSupport}>Close</Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSupportSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your Name</label>
                <Input 
                  name="name"
                  value={supportForm.name}
                  onChange={handleSupportFormChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <Input 
                  name="email"
                  type="email"
                  value={supportForm.email}
                  onChange={handleSupportFormChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">What do you need help with?</label>
                <select 
                  name="issue"
                  value={supportForm.issue}
                  onChange={handleSupportFormChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="anxiety">Anxiety & Stress</option>
                  <option value="sleep">Sleep Issues</option>
                  <option value="depression">Depression</option>
                  <option value="meditation">Meditation Guidance</option>
                  <option value="technical">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Additional Details</label>
                <Textarea
                  name="details"
                  value={supportForm.details}
                  onChange={handleSupportFormChange}
                  placeholder="Please share any specific details that would help us understand your needs better"
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseSupport}>Cancel</Button>
                <Button type="submit" disabled={isSupportLoading}>
                  {isSupportLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CalmZoneSection;
