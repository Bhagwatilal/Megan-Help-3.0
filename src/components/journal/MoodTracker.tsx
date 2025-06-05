
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../auth/FirebaseConfig';
import { useActivityTracker } from '../../hooks/useActivityTracker';
import { saveJournalEntry } from '../../services/activityService';
import { Timestamp } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { Smile, Heart, Activity } from 'lucide-react';

const moodOptions = [
  { value: 'great', label: 'Great', emoji: '😊', color: 'bg-green-500' },
  { value: 'good', label: 'Good', emoji: '🙂', color: 'bg-blue-500' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: 'bg-yellow-500' },
  { value: 'bad', label: 'Bad', emoji: '😟', color: 'bg-orange-500' },
  { value: 'awful', label: 'Awful', emoji: '😢', color: 'bg-red-500' },
];

const MoodTracker: React.FC = () => {
  const [user] = useAuthState(auth);
  const { currentMood, recentActivities, recommendations } = useActivityTracker();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [moodNote, setMoodNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMoodSubmit = async () => {
    if (!user || !selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling right now.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const moodEntry = {
        userId: user.uid,
        prompt: "Mood Check-in",
        content: `Mood: ${selectedMood}\n${moodNote ? `Note: ${moodNote}` : ''}`,
        mood: selectedMood,
        createdAt: Timestamp.now()
      };

      await saveJournalEntry(moodEntry);
      
      setSelectedMood('');
      setMoodNote('');
      
      toast({
        title: "Mood logged!",
        description: "Your mood has been recorded in your journal."
      });
    } catch (error) {
      console.error('Error saving mood entry:', error);
      toast({
        title: "Error saving mood",
        description: "There was an error recording your mood.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActivitySummary = () => {
    const activityCounts = recentActivities.reduce((acc, activity) => {
      acc[activity.activityType] = (acc[activity.activityType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(activityCounts).map(([type, count]) => `${type}: ${count}`).join(', ');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="h-5 w-5" />
            How are you feeling?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-5 gap-2">
            {moodOptions.map((mood) => (
              <Button
                key={mood.value}
                variant={selectedMood === mood.value ? "default" : "outline"}
                className={`flex flex-col items-center p-4 h-auto ${
                  selectedMood === mood.value ? mood.color : ''
                }`}
                onClick={() => setSelectedMood(mood.value)}
              >
                <span className="text-2xl mb-1">{mood.emoji}</span>
                <span className="text-xs">{mood.label}</span>
              </Button>
            ))}
          </div>
          
          <textarea
            placeholder="Optional: Add a note about your mood..."
            value={moodNote}
            onChange={(e) => setMoodNote(e.target.value)}
            className="w-full p-3 border rounded-md min-h-[80px] resize-none"
          />
          
          <Button
            onClick={handleMoodSubmit}
            disabled={!selectedMood || isSubmitting}
            className="w-full bg-mentii-500 hover:bg-mentii-600"
          >
            {isSubmitting ? "Recording..." : "Log Mood"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Current Mood Analysis</h4>
              <div className={`p-3 rounded-md ${
                currentMood === 'positive' ? 'bg-green-100 text-green-800' :
                currentMood === 'negative' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                <span className="capitalize font-medium">{currentMood}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Recent Activities</h4>
              <div className="text-sm text-muted-foreground">
                {recentActivities.length > 0 ? getActivitySummary() : 'No recent activities'}
              </div>
            </div>
          </div>

          {recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Recommendations
              </h4>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-3 bg-mentii-50 rounded-md text-sm">
                    {rec.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodTracker;