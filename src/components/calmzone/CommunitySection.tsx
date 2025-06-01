import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Heart, Share2, Users, ThumbsUp, Globe, Image, Tag, X, Upload, Send, Plus } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import GroupChatComponent from "../community/GroupChatComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { popularEmojis, groupChatUsers } from "@/utils/chatUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CreateGroupForm from "../community/CreateGroupForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  content: string;
  likes: number;
  comments: number;
  shares: number;
  time: string;
  tags: string[];
  imageURL?: string;
  comments_list?: Comment[];
  liked?: boolean;
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  likes: number;
  time: string;
  liked?: boolean;
}

interface Group {
  id: number;
  name: string;
  members: number;
  posts: number;
  image: string;
  description?: string;
  createdAt?: string;
}

interface Consultant {
  id: number;
  name: string;
  specialty: string;
  avatar: string;
  available: boolean;
  nationality: string;
}

const dummyPosts: Post[] = [
  {
    id: "post-1",
    author: {
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=1",
      title: "Meditation Guide"
    },
    content: "Just finished a 30-minute meditation session and feeling incredibly centered. Does anyone else find that morning meditation sets the tone for their entire day?",
    likes: 24,
    comments: 5,
    shares: 3,
    time: "2 hours ago",
    tags: ["meditation", "mindfulness", "morning"],
    liked: false,
    comments_list: [
      {
        id: "comment-1",
        author: {
          name: "Michael Chen",
          avatar: "https://i.pravatar.cc/150?img=11"
        },
        content: "Absolutely! I can't start my day without at least 15 minutes of meditation. It makes all the difference.",
        likes: 3,
        time: "1 hour ago",
        liked: false
      },
      {
        id: "comment-2",
        author: {
          name: "Sarah Johnson",
          avatar: "https://i.pravatar.cc/150?img=20"
        },
        content: "What meditation technique do you use? I've been trying different approaches.",
        likes: 1,
        time: "45 minutes ago",
        liked: false
      }
    ]
  },
  {
    id: "post-2",
    author: {
      name: "David Wilson",
      avatar: "https://i.pravatar.cc/150?img=3",
      title: "Anxiety Survivor"
    },
    content: "Had a panic attack last night for the first time in months. Used the breathing techniques I learned here and managed to calm down within minutes. So grateful for this community.",
    likes: 56,
    comments: 12,
    shares: 8,
    time: "Yesterday",
    tags: ["anxiety", "breathing", "coping"],
    liked: false,
    imageURL: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&auto=format",
    comments_list: [
      {
        id: "comment-3",
        author: {
          name: "Emily Parker",
          avatar: "https://i.pravatar.cc/150?img=5"
        },
        content: "So proud of you for using your techniques in the moment! That's a huge victory.",
        likes: 8,
        time: "22 hours ago",
        liked: false
      }
    ]
  },
  {
    id: "post-3",
    author: {
      name: "Maria Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=4",
      title: "Sleep Coach"
    },
    content: "New research shows that consistent sleep schedules are more important than total hours slept. Try to go to bed and wake up at the same time every day, even on weekends!",
    likes: 37,
    comments: 8,
    shares: 15,
    time: "2 days ago",
    tags: ["sleep", "research", "health"],
    liked: false,
    comments_list: []
  }
];

const activeGroups: Group[] = [
  { 
    id: 1, 
    name: "Anxiety Support", 
    members: 2546, 
    posts: 428, 
    image: "https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=150&auto=format",
    description: "A safe space for people dealing with anxiety to share experiences and coping strategies."
  },
  { 
    id: 2, 
    name: "Mindful Meditation", 
    members: 1836, 
    posts: 312, 
    image: "https://images.unsplash.com/photo-1516834611397-8d633eaec5d0?w=150&auto=format",
    description: "For practitioners at all levels to discuss meditation techniques and experiences."
  },
  { 
    id: 3, 
    name: "Better Sleep", 
    members: 3127, 
    posts: 576, 
    image: "https://images.unsplash.com/photo-1455642305367-68834a9c6cab?w=150&auto=format",
    description: "Tips, tricks, and support for those struggling with sleep issues."
  },
  { 
    id: 4, 
    name: "Stress Relief", 
    members: 2089, 
    posts: 387, 
    image: "https://images.unsplash.com/photo-1585241936939-be4099591252?w=150&auto=format",
    description: "Strategies and techniques for managing stress in daily life."
  }
];

const allGroups: Group[] = [
  { 
    id: 5, 
    name: "Digital Detox", 
    members: 745, 
    posts: 67, 
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=150&auto=format",
    description: "A community focused on taking breaks from technology and finding balance in the digital age."
  },
  { 
    id: 6, 
    name: "Meditation Masters", 
    members: 1893, 
    posts: 176, 
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=150&auto=format",
    description: "Advanced meditation techniques and practices for experienced practitioners."
  },
  { 
    id: 7, 
    name: "Anxiety Relief", 
    members: 2431, 
    posts: 298, 
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=150&auto=format",
    description: "Support and techniques for managing anxiety and stress in daily life."
  },
  { 
    id: 8, 
    name: "Workplace Wellness", 
    members: 1256, 
    posts: 112, 
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=150&auto=format",
    description: "Strategies for maintaining mental health and wellness in professional environments."
  }
];

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
    name: "Dr. Emily Parker", 
    specialty: "Stress Management", 
    avatar: "https://i.pravatar.cc/150?img=5",
    available: false,
    nationality: "UK"
  },
  {
    id: 4, 
    name: "Dr. Bhagwatilal Joshi", 
    specialty: "Family Therapy", 
    avatar: "https://i.pravatar.cc/150?img=67",
    available: true,
    nationality: "India"
  },
  {
    id: 5, 
    name: "Dr. Yash Ahir", 
    specialty: "Mindfulness & Meditation", 
    avatar: "https://i.pravatar.cc/150?img=68",
    available: true,
    nationality: "India"
  },
  {
    id: 6, 
    name: "Dr. Meera Kapoor", 
    specialty: "Relationship Counseling", 
    avatar: "https://i.pravatar.cc/150?img=45",
    available: false,
    nationality: "India"
  }
];

const CommunitySection: React.FC = () => {
  const isMobile = useIsMobile();
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showTagInput, setShowTagInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [showAllGroups, setShowAllGroups] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
  const [commentText, setCommentText] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showJoinedGroups, setShowJoinedGroups] = useState(false);
  const [consultantFilter, setConsultantFilter] = useState<string>("all");
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [selectedGroupForMembers, setSelectedGroupForMembers] = useState<Group | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPosts(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.liked || false;
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          liked: !isLiked
        };
      }
      return post;
    }));
    
    const targetPost = posts.find(post => post.id === postId);
    const action = targetPost?.liked ? "unliked" : "liked";
    toast.success(`Post ${action} successfully!`);
  };

  const handleComment = (postId: string) => {
    setActiveCommentPost(postId);
  };

  const handleCommentLike = (postId: string, commentId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId && post.comments_list) {
        const updatedComments = post.comments_list.map(comment => {
          if (comment.id === commentId) {
            const isLiked = comment.liked || false;
            return {
              ...comment,
              likes: isLiked ? comment.likes - 1 : comment.likes + 1,
              liked: !isLiked
            };
          }
          return comment;
        });
        
        return {
          ...post,
          comments_list: updatedComments
        };
      }
      return post;
    }));
    
    toast.success("Comment liked successfully!");
  };

  const handleShare = (postId: string) => {
    toast.success("Post link copied to clipboard!");
  };

  const handleJoinGroup = (groupId: number) => {
    if (joinedGroups.includes(groupId)) {
      setJoinedGroups(joinedGroups.filter(id => id !== groupId));
      toast.success("Left the group successfully!");
    } else {
      setJoinedGroups([...joinedGroups, groupId]);
      toast.success("Joined the group successfully!");
    }
  };

  const handleOpenGroupChat = (group: Group) => {
    setSelectedGroup(group);
  };

  const handleCloseGroupChat = () => {
    setSelectedGroup(null);
  };

  const handleCreateGroup = (newGroup: Group) => {
    const updatedAllGroups = [newGroup, ...allGroups];
    
    setJoinedGroups([...joinedGroups, newGroup.id]);
    
    setShowCreateGroup(false);
    
    setShowJoinedGroups(true);
    
    toast.success("Group created successfully! You've been automatically added as a member.");
  };

  const handleSubmitPost = () => {
    if (newPost.trim() === "" && !imagePreview) {
      toast.error("Post must have content or an image!");
      return;
    }

    setLoadingPosts(true);
    
    const newPostObj: Post = {
      id: `post-${Date.now()}`,
      author: {
        name: "Current User",
        avatar: "https://i.pravatar.cc/150?img=8",
        title: "Community Member"
      },
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      time: "Just now",
      tags: tags,
      imageURL: imagePreview || undefined,
      comments_list: [],
      liked: false
    };

    setTimeout(() => {
      setPosts([newPostObj, ...posts]);
      setNewPost("");
      setTags([]);
      setTagInput("");
      setShowTagInput(false);
      setShowImageInput(false);
      setImageFile(null);
      setImagePreview(null);
      setLoadingPosts(false);
      toast.success("Post submitted successfully!");
    }, 1000);
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSelectConsultant = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
  };

  const handleBookConsultation = () => {
    if (!selectedConsultant) {
      toast.error("Please select a consultant");
      return;
    }
    
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    
    if (!selectedTime) {
      toast.error("Please select a time");
      return;
    }
    
    setConsultationOpen(false);
    toast.success(`Consultation booked successfully with ${selectedConsultant.name} on ${selectedDate} at ${selectedTime}`);
    
    setSelectedConsultant(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleSubmitComment = (postId: string) => {
    if (commentText.trim() === "") {
      toast.error("Comment cannot be empty!");
      return;
    }

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newComment = {
          id: `comment-${Date.now()}`,
          author: {
            name: "Current User",
            avatar: "https://i.pravatar.cc/150?img=8"
          },
          content: commentText,
          likes: 0,
          time: "Just now",
          liked: false
        };

        const updatedComments = post.comments_list ? [...post.comments_list, newComment] : [newComment];
        
        return {
          ...post,
          comments: post.comments + 1,
          comments_list: updatedComments
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    setCommentText("");
    setActiveCommentPost(null);
    toast.success("Comment added successfully!");
  };

  const toggleJoinedGroupsView = () => {
    setShowJoinedGroups(!showJoinedGroups);
  };

  const filteredConsultants = consultantFilter === "all" 
    ? consultants 
    : consultants.filter(c => c.nationality.toLowerCase() === consultantFilter.toLowerCase());

  const handleViewAllMembers = (group: Group) => {
    setSelectedGroupForMembers(group);
    setShowAllMembers(true);
  };

  const handleAddEmoji = (emoji: string) => {
    setNewPost(prev => prev + emoji);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-4">Community</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Users className="mr-2" /> Groups
                </CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => setShowCreateGroup(true)}
                  className="flex items-center"
                >
                  <Plus className="mr-1 h-4 w-4" /> New Group
                </Button>
              </div>
              <CardDescription>Join supportive communities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <Button 
                  variant={!showJoinedGroups ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setShowJoinedGroups(false)}
                  className="px-2 py-1 h-auto text-xs md:text-sm md:px-3 md:py-2"
                >
                  Active Groups
                </Button>
                <Button 
                  variant={showJoinedGroups ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setShowJoinedGroups(true)}
                  className="px-2 py-1 h-auto text-xs md:text-sm md:px-3 md:py-2"
                >
                  Joined Groups
                </Button>
              </div>
              
              {showJoinedGroups ? (
                joinedGroups.length > 0 ? (
                  <div className="space-y-4">
                    {joinedGroups.map(groupId => {
                      const group = [...activeGroups, ...allGroups].find(g => g.id === groupId);
                      if (!group) return null;
                      
                      return (
                        <div key={group.id} className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 p-2 rounded-lg hover:bg-gray-50">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={group.image} />
                            <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold truncate">{group.name}</h4>
                            <p className="text-sm text-gray-500">{group.members} members</p>
                          </div>
                          <div className="flex space-x-2 w-full md:w-auto justify-end">
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleOpenGroupChat(group)}
                              className="flex-1 md:flex-none"
                            >
                              Chat
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleJoinGroup(group.id)}
                              className="flex-1 md:flex-none"
                            >
                              Leave
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">You haven't joined any groups yet</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowJoinedGroups(false)}
                    >
                      Browse Groups
                    </Button>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  {activeGroups.map(group => (
                    <div key={group.id} className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={group.image} />
                        <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{group.name}</h4>
                        <p className="text-sm text-gray-500">{group.members} members</p>
                      </div>
                      <Button 
                        variant={joinedGroups.includes(group.id) ? "outline" : "default"} 
                        size="sm"
                        className="w-full md:w-auto"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        {joinedGroups.includes(group.id) ? "Leave" : "Join"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4">
                <Button variant="outline" className="w-full" onClick={() => setShowAllGroups(true)}>
                  See All Groups
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2" /> Free Consultation
              </CardTitle>
              <CardDescription>Get professional advice</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">
                Our mental health professionals offer free 15-minute consultations for community members.
              </p>
              <Button onClick={() => setConsultationOpen(true)} className="w-full">Book a Session</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="mb-4">
                <Textarea
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map(tag => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      #{tag}
                      <button onClick={() => handleRemoveTag(tag)} className="text-gray-500 hover:text-gray-700">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {imagePreview && (
                <div className="relative mb-3">
                  <img src={imagePreview} alt="Preview" className="max-h-[200px] rounded-md object-cover" />
                  <button 
                    className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 rounded-full p-1"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                </div>
              )}
              
              {showTagInput && (
                <div className="mb-3 flex">
                  <input
                    type="text"
                    placeholder="Add a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 border rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={handleAddTag}
                    className="bg-blue-500 text-white px-3 py-2 rounded-r-md text-sm hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              )}
              
              {showImageInput && (
                <div className="mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowImageInput(!showImageInput)}
                    className={showImageInput ? "text-blue-500" : ""}
                  >
                    <Image className="mr-1 h-4 w-4" /> Photo
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTagInput(!showTagInput)}
                    className={showTagInput ? "text-blue-500" : ""}
                  >
                    <Tag className="mr-1 h-4 w-4" /> Tag
                  </Button>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <span className="mr-1">😊</span> Emoji
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-2">
                      <div className="grid grid-cols-5 gap-2">
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
                </div>
                <Button 
                  onClick={handleSubmitPost} 
                  disabled={loadingPosts || (newPost.trim() === "" && !imagePreview)}
                >
                  {loadingPosts ? "Posting..." : "Post"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {loadingPosts ? (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map(post => (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base font-semibold">{post.author.name}</CardTitle>
                          <CardDescription className="text-xs">{post.author.title} • {post.time}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="mb-4">{post.content}</p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => (
                          <Badge key={tag} variant="outline">#{tag}</Badge>
                        ))}
                      </div>
                    )}
                    
                    {post.imageURL && (
                      <div className="mb-4">
                        <img 
                          src={post.imageURL} 
                          alt="Post attachment" 
                          className="rounded-md w-full object-cover max-h-[400px]" 
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t pt-3 flex items-center justify-between">
                    <div className="flex space-x-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleLike(post.id)}
                        className={post.liked ? "text-red-500" : ""}
                      >
                        <Heart className={`mr-1 h-4 w-4 ${post.liked ? "fill-current" : ""}`} /> {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleComment(post.id)}>
                        <MessageCircle className="mr-1 h-4 w-4" /> {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleShare(post.id)}>
                        <Share2 className="mr-1 h-4 w-4" /> {post.shares}
                      </Button>
                    </div>
                  </CardFooter>
                  
                  {(post.comments_list && post.comments_list.length > 0) || activeCommentPost === post.id ? (
                    <div className="px-6 py-3 bg-gray-50 border-t">
                      {post.comments_list && post.comments_list.map(comment => (
                        <div key={comment.id} className="mb-3 last:mb-0">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={comment.author.avatar} />
                              <AvatarFallback>{comment.author.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-white p-3 rounded-lg shadow-sm">
                                <div className="font-semibold text-sm">{comment.author.name}</div>
                                <p className="text-sm">{comment.content}</p>
                              </div>
                              <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500">
                                <span>{comment.time}</span>
                                <button 
                                  className={`hover:text-gray-700 ${comment.liked ? "text-red-500" : ""}`}
                                  onClick={() => handleCommentLike(post.id, comment.id)}
                                >
                                  {comment.liked ? "Liked" : "Like"} ({comment.likes})
                                </button>
                                <button className="hover:text-gray-700">Reply</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {activeCommentPost === post.id && (
                        <div className="mt-3 flex space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="https://i.pravatar.cc/150?img=8" />
                            <AvatarFallback>You</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 flex">
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              className="flex-1 border rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment(post.id)}
                            />
                            <button 
                              onClick={() => handleSubmitComment(post.id)}
                              className="bg-blue-500 text-white px-3 py-2 rounded-r-md text-sm hover:bg-blue-600"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
        <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a supportive community around a mental health topic
          </DialogDescription>
          <CreateGroupForm 
            onGroupCreated={handleCreateGroup}
            onCancel={() => setShowCreateGroup(false)}
          />
        </DialogContent>
      </Dialog>
      
      <Sheet open={showAllGroups} onOpenChange={setShowAllGroups}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>All Groups</SheetTitle>
            <SheetDescription>Discover and join supportive communities</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {[...activeGroups, ...allGroups].map(group => (
              <div key={group.id} className="border-b pb-4 last:border-0">
                <div className="flex items-center space-x-3 mb-2">
                  <Avatar>
                    <AvatarImage src={group.image} />
                    <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold">{group.name}</h4>
                    <p className="text-sm text-gray-500">{group.members} members • {group.posts} posts</p>
                  </div>
                  <div className="flex flex-shrink-0 space-x-2">
                    {joinedGroups.includes(group.id) && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => handleOpenGroupChat(group)}
                      >
                        Chat
                      </Button>
                    )}
                    <Button 
                      variant={joinedGroups.includes(group.id) ? "outline" : "default"} 
                      size="sm"
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      {joinedGroups.includes(group.id) ? "Leave" : "Join"}
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center ml-12">
                  <p className="text-sm text-gray-700">{group.description}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewAllMembers(group)}
                  >
                    View Members
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
      
      <Sheet open={consultationOpen} onOpenChange={setConsultationOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Book a Free Consultation</SheetTitle>
            <SheetDescription>
              Schedule a 15-minute call with one of our mental health professionals
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between mb-3">
                <label className="text-sm font-medium">Select a professional</label>
                <div className="flex space-x-2">
                  <Button 
                    variant={consultantFilter === "all" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setConsultantFilter("all")}
                  >
                    All
                  </Button>
                  <Button 
                    variant={consultantFilter === "india" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setConsultantFilter("india")}
                  >
                    Indian
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                {filteredConsultants.map(consultant => (
                  <div 
                    key={consultant.id} 
                    className={`flex items-center space-x-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedConsultant?.id === consultant.id ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() => handleSelectConsultant(consultant)}
                  >
                    <Avatar>
                      <AvatarImage src={consultant.avatar} />
                      <AvatarFallback>{consultant.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{consultant.name}</h4>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">{consultant.specialty}</p>
                        <Badge variant={consultant.available ? "default" : "destructive"} className="text-xs">
                          {consultant.available ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{consultant.nationality}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Select a date</label>
              <div className="grid grid-cols-3 gap-2">
                {["Tomorrow", "In 2 days", "In 3 days"].map((day, i) => (
                  <Button 
                    key={i} 
                    variant={selectedDate === day ? "default" : "outline"} 
                    className="h-auto py-2"
                    onClick={() => setSelectedDate(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Select a time</label>
              <div className="grid grid-cols-2 gap-2">
                {["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"].map((time, i) => (
                  <Button 
                    key={i} 
                    variant={selectedTime === time ? "default" : "outline"} 
                    className="h-auto py-2"
                    onClick={() => setSelectedTime(time)}
                    disabled={selectedConsultant && !selectedConsultant.available}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Brief description of your concerns</label>
              <Textarea placeholder="Please share what you'd like to discuss..." className="min-h-[100px]" />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleBookConsultation}
              disabled={!selectedConsultant || !selectedDate || !selectedTime || (selectedConsultant && !selectedConsultant.available)}
            >
              Book Consultation
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      
      <Dialog open={showAllMembers} onOpenChange={setShowAllMembers}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Members of {selectedGroupForMembers?.name}</DialogTitle>
          <DialogDescription>
            {selectedGroupForMembers?.members} total members
          </DialogDescription>
          
          <ScrollArea className="h-[400px] mt-4">
            <div className="space-y-4 pr-4">
              {Array.from({ length: 20 }).map((_, index) => {
                const randomUser = groupChatUsers[index % groupChatUsers.length];
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={randomUser.avatar} />
                        <AvatarFallback>{randomUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{randomUser.name}</p>
                        <p className="text-sm text-gray-500">
                          {index % 10 === 0 ? "Admin" : "Member"} • {index % 3 === 0 ? "Online" : "Last active 2h ago"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Message
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {selectedGroup && <GroupChatComponent group={selectedGroup} onClose={handleCloseGroupChat} />}
    </div>
  );
};

export default CommunitySection;
