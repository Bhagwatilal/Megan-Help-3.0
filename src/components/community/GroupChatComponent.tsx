
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image, SmilePlus, ArrowLeft, Users, User } from "lucide-react";
import { toast } from "sonner";
import { 
  openPlayAI, 
  groupChatUsers, 
  getSampleMessages, 
  getGroupTopics,
  popularEmojis 
} from "@/utils/chatUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMember } from "@/components/auth/MemberVerification";

interface Group {
  id: number;
  name: string;
  members: number;
  posts: number;
  image: string;
  description?: string;
  createdAt?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    isCurrentUser: boolean;
  };
  timestamp: Date;
}

interface GroupChatComponentProps {
  group: Group;
  onClose: () => void;
}

interface Consultant {
  id: number;
  name: string;
  specialty: string;
  avatar: string;
  available: boolean;
  nationality: string;
}

const consultants: Consultant[] = [
  {
    id: 1, 
    name: "Dr. Sarah Johnson", 
    specialty: "Anxiety & Depression", 
    avatar: "https://i.pravatar.cc/150?img=20",
    available: true,
    nationality: "USA"
  },
  {
    id: 2, 
    name: "Dr. Michael Chen", 
    specialty: "Sleep Disorders", 
    avatar: "https://i.pravatar.cc/150?img=11",
    available: true,
    nationality: "China"
  },
  {
    id: 3, 
    name: "Dr. Bhagwatilal Joshi", 
    specialty: "Family Therapy", 
    avatar: "https://i.pravatar.cc/150?img=67",
    available: true,
    nationality: "India"
  },
  {
    id: 4, 
    name: "Dr. Yash Ahir", 
    specialty: "Mindfulness & Meditation", 
    avatar: "https://i.pravatar.cc/150?img=68",
    available: true,
    nationality: "India"
  },
  {
    id: 5, 
    name: "Dr. Meera Kapoor", 
    specialty: "Relationship Counseling", 
    avatar: "https://i.pravatar.cc/150?img=45",
    available: false,
    nationality: "India"
  }
];

const GroupChatComponent: React.FC<GroupChatComponentProps> = ({ group, onClose }) => {
  const isMobile = useIsMobile();
  const { profile } = useMember();
  const [messages, setMessages] = useState<ChatMessage[]>(getSampleMessages(group.id));
  const [messageInput, setMessageInput] = useState("");
  const [groupTopics, setGroupTopics] = useState<string[]>(getGroupTopics(group.id));
  const [activeMembers, setActiveMembers] = useState(groupChatUsers.slice(0, 3));
  const [showMembers, setShowMembers] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [consultantFilter, setConsultantFilter] = useState<string>("all");
  const [showEmojis, setShowEmojis] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() && !imagePreview) return;
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: messageInput,
      sender: {
        id: "currentUser",
        name: profile?.fullName || "You",
        avatar: "https://i.pravatar.cc/150?img=33", // In a real app, you'd use the user's actual avatar
        isCurrentUser: true
      },
      timestamp: new Date()
    };
    
    setMessages([...messages, newMessage]);
    setMessageInput("");
    setImagePreview(null);
    setImageFile(null);
    
    setTimeout(() => {
      const responder = selectedConsultant 
        ? { 
            id: `consultant-${selectedConsultant.id}`, 
            name: selectedConsultant.name, 
            avatar: selectedConsultant.avatar, 
            isCurrentUser: false 
          }
        : {
            id: groupChatUsers[Math.floor(Math.random() * groupChatUsers.length)].id,
            name: groupChatUsers[Math.floor(Math.random() * groupChatUsers.length)].name,
            avatar: groupChatUsers[Math.floor(Math.random() * groupChatUsers.length)].avatar,
            isCurrentUser: false
          };
      
      const responseOptions = [
        "I completely understand what you're going through.",
        "Thanks for sharing that with the group!",
        "I've had similar experiences before.",
        "Has anyone else felt this way?",
        "That's a really good point!",
        "I found this helpful when I was dealing with something similar."
      ];
      
      const consultantResponses = [
        "From a professional perspective, I would suggest considering...",
        "In my experience with patients, this approach has been effective...",
        "It's quite common to feel this way. Many people benefit from...",
        "This is a valid concern. Have you tried the following techniques?",
        "Thank you for sharing. Let me offer some professional insight..."
      ];
      
      const responseContent = selectedConsultant 
        ? consultantResponses[Math.floor(Math.random() * consultantResponses.length)]
        : responseOptions[Math.floor(Math.random() * responseOptions.length)];
      
      const responseMessage: ChatMessage = {
        id: `msg-${Date.now()}-response`,
        content: responseContent,
        sender: responder,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, Math.random() * 2000 + 1000);
  };
  
  const toggleMembersView = () => {
    setShowMembers(!showMembers);
  };
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojis(false);
  };
  
  const handleViewAllMembers = () => {
    setShowAllMembers(true);
  };
  
  const handleSelectConsultant = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    toast.success(`You are now chatting with ${consultant.name}`);
  };
  
  const filteredConsultants = consultantFilter === "all" 
    ? consultants 
    : consultants.filter(c => c.nationality.toLowerCase() === consultantFilter.toLowerCase());
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-1 sm:p-4">
      <Card className="w-full max-w-4xl h-[90vh] sm:h-[80vh] flex flex-col overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-mentii-100 to-lavender-100 pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src={group.image} alt={group.name} />
                <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base sm:text-lg truncate max-w-[150px] sm:max-w-none">{group.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{group.members} members</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleMembersView} className="h-8 w-8">
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <div className="flex flex-1 overflow-hidden">
          <div className={`flex-1 flex flex-col ${showMembers ? 'hidden md:flex' : 'flex'}`}>
            <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${message.sender.isCurrentUser ? "justify-end" : "justify-start"}`}
                >
                  {!message.sender.isCurrentUser && (
                    <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                      <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                      <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender.isCurrentUser
                        ? "bg-mentii-500 text-white rounded-tr-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {!message.sender.isCurrentUser && (
                      <p className="text-xs font-medium mb-1">{message.sender.name}</p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  
                  {message.sender.isCurrentUser && (
                    <Avatar className="h-8 w-8 ml-2 flex-shrink-0">
                      <AvatarImage src={message.sender.avatar} alt="You" />
                      <AvatarFallback>Y</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {imagePreview && (
                <div className="flex justify-end mb-4">
                  <div className="max-w-[80%] rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="max-h-[200px] object-cover" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>
            
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-2 sm:p-4 bg-white flex flex-col gap-2">
              {imagePreview && (
                <div className="relative w-full rounded-md overflow-hidden mb-2 border border-gray-200">
                  <img src={imagePreview} alt="Preview" className="max-h-[150px] object-contain w-full" />
                  <button 
                    type="button"
                    className="absolute top-1 right-1 bg-gray-900/70 text-white rounded-full p-1"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Popover open={showEmojis} onOpenChange={setShowEmojis}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-mentii-500 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Add emoji"
                    >
                      <SmilePlus className="h-5 w-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-2">
                    <div className="grid grid-cols-5 gap-2">
                      {popularEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className="text-xl hover:bg-gray-100 p-1 rounded transition-colors"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-mentii-500 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Upload image"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image className="h-5 w-5" />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </button>
                
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                
                <Button type="submit" size="icon" disabled={!messageInput.trim() && !imagePreview}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
          
          <div className={`w-full md:w-72 border-l border-gray-200 bg-white overflow-y-auto ${showMembers ? 'block' : 'hidden md:block'}`}>
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <h3 className="font-medium mb-3">Select Consultant</h3>
              <div className="flex justify-between mb-3">
                <div className="flex space-x-2">
                  <Button 
                    variant={consultantFilter === "all" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setConsultantFilter("all")}
                    className="px-2 py-1 h-auto text-xs sm:text-sm"
                  >
                    All
                  </Button>
                  <Button 
                    variant={consultantFilter === "india" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setConsultantFilter("india")}
                    className="px-2 py-1 h-auto text-xs sm:text-sm"
                  >
                    Indian
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[120px] rounded-md border p-2">
                {filteredConsultants.map(consultant => (
                  <div 
                    key={consultant.id} 
                    className={`flex items-center mb-2 p-2 rounded-md cursor-pointer hover:bg-gray-50 ${
                      selectedConsultant?.id === consultant.id ? "bg-mentii-100" : ""
                    }`}
                    onClick={() => handleSelectConsultant(consultant)}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={consultant.avatar} alt={consultant.name} />
                      <AvatarFallback>{consultant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{consultant.name}</p>
                      <p className="text-xs text-muted-foreground">{consultant.specialty}</p>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
            
            <div className="p-3 sm:p-4 border-b border-gray-200">
              <h3 className="font-medium mb-3">Active Members</h3>
              <div className="space-y-3">
                {activeMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                    <span className="text-sm truncate">{member.name}</span>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full text-xs" onClick={handleViewAllMembers}>
                  View all members ({group.members})
                </Button>
              </div>
            </div>
            
            <div className="p-3 sm:p-4">
              <h3 className="font-medium mb-3">Group Topics</h3>
              <div className="flex flex-wrap gap-2">
                {groupTopics.map((topic, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded cursor-pointer transition-colors"
                    onClick={() => toast(`Topic "${topic}" selected. Feature coming soon.`)}
                  >
                    {topic}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-3 sm:p-4 border-t border-gray-200">
              <h3 className="font-medium mb-3">About This Group</h3>
              <p className="text-sm text-gray-600 mb-2">{group.description}</p>
              <p className="text-xs text-gray-500">Created: {group.createdAt || "January 2024"}</p>
            </div>
          </div>
        </div>
      </Card>
      
      {showAllMembers && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Members ({group.members})</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAllMembers(false)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {[...groupChatUsers, ...groupChatUsers].map((member, index) => (
                    <div key={`${member.id}-${index}`} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{index % 3 === 0 ? "Admin" : "Member"}</p>
                      </div>
                      {index % 5 === 0 && (
                        <div className="ml-auto">
                          <div className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Online
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GroupChatComponent;
