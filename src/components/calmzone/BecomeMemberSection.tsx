import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { UserRound, Mail, Phone, Heart, CheckCircle, Edit2 } from "lucide-react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface MemberProfile {
  fullName: string;
  email: string;
  phone: string;
  interests: string;
  bio: string;
  joinDate: string;
  membershipLevel: string;
}

const defaultProfile: MemberProfile = {
  fullName: "",
  email: "",
  phone: "",
  interests: "",
  bio: "",
  joinDate: new Date().toISOString(),
  membershipLevel: "Basic"
};

const BecomeMemberSection: React.FC = () => {
  const [profile, setProfile] = useState<MemberProfile>(defaultProfile);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserProfile(user.uid);
      } else {
        setUserId(null);
        setHasProfile(false);
        setIsLoading(false);
        toast.error("Please log in to create a member profile");
        navigate("/login", { state: { from: "/become-member" } });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserProfile = async (uid: string) => {
    try {
      setIsLoading(true);
      const db = getFirestore();
      const docRef = doc(db, "memberProfiles", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data() as MemberProfile);
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Could not load your profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error("You must be logged in to save your profile");
      return;
    }

    try {
      setIsLoading(true);
      const db = getFirestore();
      await setDoc(doc(db, "memberProfiles", userId), {
        ...profile,
        joinDate: profile.joinDate || new Date().toISOString()
      });
      
      setHasProfile(true);
      setIsEditing(false);
      toast.success("Your profile has been saved!");
      
      const { state } = window.history.state || {};
      const redirectPath = state?.from || "/activities";
      navigate(redirectPath);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Could not save your profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    navigate("/activities");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mentii-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-3xl font-bold mb-4">Join Our Mindfulness Community</h2>
        <p className="text-lg text-muted-foreground">
          Connect with like-minded individuals, join exclusive events, and access premium content
          to enhance your mental wellbeing journey.
        </p>
      </div>

      {hasProfile && !isEditing ? (
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="relative pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Member Profile</CardTitle>
                <CardDescription>Your Mindscape membership details</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)} 
                className="absolute top-4 right-4"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-mentii-100 rounded-full flex items-center justify-center">
                  <UserRound className="h-16 w-16 text-mentii-500" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{profile.fullName}</h3>
                  <p className="text-sm text-muted-foreground">Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
                </div>
                
                <div className="flex flex-wrap gap-y-2 gap-x-6">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-mentii-100 text-mentii-600">
                  <Heart className="h-4 w-4 mr-2" />
                  {profile.membershipLevel} Membership
                </div>
              </div>
            </div>
            
            {profile.bio && (
              <div>
                <h4 className="text-sm font-medium mb-1">About</h4>
                <p className="text-sm">{profile.bio}</p>
              </div>
            )}
            
            {profile.interests && (
              <div>
                <h4 className="text-sm font-medium mb-1">Interests</h4>
                <p className="text-sm">{profile.interests}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/50">
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-sm flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                Your membership is active
              </p>
              <Button variant="outline" size="sm">View Membership Benefits</Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Become a Member</CardTitle>
            <CardDescription>Fill out the form below to join our community</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    name="fullName"
                    placeholder="Your full name" 
                    value={profile.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="Your email address" 
                    value={profile.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (optional)</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  type="tel" 
                  placeholder="Your phone number" 
                  value={profile.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interests">Interests</Label>
                <Input 
                  id="interests" 
                  name="interests"
                  placeholder="Meditation, Yoga, Stress Management, etc." 
                  value={profile.interests}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">About Yourself</Label>
                <Textarea 
                  id="bio" 
                  name="bio"
                  placeholder="Tell us a bit about yourself and your wellness journey..." 
                  rows={4}
                  value={profile.bio}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between">
              <p className="text-sm text-muted-foreground">
                By submitting, you agree to our Terms of Service and Privacy Policy.
              </p>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEditing ? "Save Changes" : "Join Community"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
};

export default BecomeMemberSection;