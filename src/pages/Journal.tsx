import React, { useState, useEffect } from "react";
import { PlusCircle, Calendar, Search, BookOpen, TrendingUp, Smile } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ChatbotPreview from "../components/ui/ChatbotPreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../components/auth/FirebaseConfig';
import { getUserJournalEntries, saveJournalEntry, JournalEntry } from '../services/activityService';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import MoodTracker from '../components/journal/MoodTracker';
import MoodAnalysis from '../components/journal/MoodAnalysis';

const Journal: React.FC = () => {
  const [user] = useAuthState(auth);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEntry, setNewEntry] = useState("");
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const userEntries = await getUserJournalEntries(user.uid);
      setEntries(userEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      toast({
        title: "Error loading entries",
        description: "There was an error loading your journal entries.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add journal entries.",
        variant: "destructive"
      });
      return;
    }

    if (newEntry.trim() === "") {
      toast({
        title: "Empty entry",
        description: "Please write something before saving.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const entryData = {
        userId: user.uid,
        prompt: "Manual Entry",
        content: newEntry.trim(),
        createdAt: Timestamp.now()
      };

      const entryId = await saveJournalEntry(entryData);
      
      const newEntryWithId: JournalEntry = {
        id: entryId,
        ...entryData
      };

      setEntries(prev => [newEntryWithId, ...prev]);
      setNewEntry("");
      setIsAddingEntry(false);

      toast({
        title: "Entry added!",
        description: "Your journal entry has been saved successfully."
      });
    } catch (error) {
      console.error('Error adding journal entry:', error);
      toast({
        title: "Error adding entry",
        description: "There was an error saving your journal entry.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEntries = entries.filter(entry =>
    entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.prompt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: Timestamp) => {
    return format(timestamp.toDate(), 'MMM dd, yyyy - HH:mm');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 pb-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Journal</h1>
            <p className="text-lg text-muted-foreground">
              Please log in to access your personal journal.
            </p>
          </div>
        </main>
        <Footer />
        <ChatbotPreview />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Journal</h1>
              <p className="text-lg text-muted-foreground">
                Record your thoughts, track your mood, and analyze your wellness journey
              </p>
            </div>
          </div>

          <Tabs defaultValue="entries" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="entries" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Journal Entries
              </TabsTrigger>
              <TabsTrigger value="mood" className="flex items-center gap-2">
                <Smile className="h-4 w-4" />
                Mood Tracker
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entries" className="space-y-6">
              <div className="flex justify-end">
                <Button
                  onClick={() => setIsAddingEntry(!isAddingEntry)}
                  className="bg-mentii-500 hover:bg-mentii-600"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Entry
                </Button>
              </div>

              {isAddingEntry && (
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Entry</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="What's on your mind today?"
                      value={newEntry}
                      onChange={(e) => setNewEntry(e.target.value)}
                      className="min-h-[120px]"
                      disabled={isSubmitting}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddingEntry(false);
                          setNewEntry("");
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddEntry}
                        disabled={isSubmitting}
                        className="bg-mentii-500 hover:bg-mentii-600"
                      >
                        {isSubmitting ? "Saving..." : "Save Entry"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search your entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading your journal entries...</p>
                </div>
              ) : filteredEntries.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {searchTerm ? "No matching entries found" : "No journal entries yet"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm 
                        ? "Try adjusting your search terms" 
                        : "Start your journaling journey by adding your first entry"
                      }
                    </p>
                    {!searchTerm && (
                      <Button
                        onClick={() => setIsAddingEntry(true)}
                        className="bg-mentii-500 hover:bg-mentii-600"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add First Entry
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredEntries.map((entry) => (
                    <Card key={entry.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(entry.createdAt)}</span>
                          </div>
                          {entry.mood && (
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                              entry.mood === 'great' ? 'bg-green-100 text-green-800' :
                              entry.mood === 'good' ? 'bg-blue-100 text-blue-800' :
                              entry.mood === 'okay' ? 'bg-yellow-100 text-yellow-800' :
                              entry.mood === 'bad' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              Mood: {entry.mood}
                            </div>
                          )}
                        </div>
                        {entry.prompt !== "Manual Entry" && (
                          <div className="text-sm font-medium text-mentii-600 bg-mentii-50 px-3 py-1 rounded-md inline-block">
                            {entry.prompt}
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {entry.content}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="mood">
              <MoodTracker />
            </TabsContent>

            <TabsContent value="analysis">
              <MoodAnalysis />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      <ChatbotPreview />
    </div>
  );
};

export default Journal;