import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../auth/FirebaseConfig';
import { getUserJournalEntries, getUserActivities, JournalEntry, ActivityLog } from '../../services/activityService';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
import MoodChartVisualizations from './MoodChartVisualizations';
import { Calendar, TrendingUp, BarChart } from 'lucide-react';

type TimeRange = "week" | "month" | "year";

const MoodAnalysis: React.FC = () => {
  const [user] = useAuthState(auth);
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [moodData, setMoodData] = useState<Array<{date: string; mood: number; moodLabel: string}>>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalysisData();
    }
  }, [user, timeRange]);

  const loadAnalysisData = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case "week":
          startDate = subDays(now, 7);
          break;
        case "month":
          startDate = subWeeks(now, 4);
          break;
        case "year":
          startDate = subMonths(now, 12);
          break;
        default:
          startDate = subDays(now, 7);
      }

      // Get journal entries with mood data
      const journalEntries = await getUserJournalEntries(user.uid);
      const moodEntries = journalEntries.filter(entry => 
        entry.mood && 
        entry.createdAt.toDate() >= startDate
      );

      // Convert mood entries to chart data
      const chartData = moodEntries.map(entry => ({
        date: format(entry.createdAt.toDate(), 'MM/dd'),
        mood: getMoodScore(entry.mood!),
        moodLabel: entry.mood!
      }));

      // Get activities for the same period
      const userActivities = await getUserActivities(user.uid, {
        start: startDate,
        end: now
      });

      setMoodData(chartData);
      setActivities(userActivities);
    } catch (error) {
      console.error('Error loading analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMoodScore = (mood: string): number => {
    const scores = { great: 5, good: 4, okay: 3, bad: 2, awful: 1 };
    return scores[mood as keyof typeof scores] || 3;
  };

  const getActivityInsights = () => {
    const activityCounts = activities.reduce((acc, activity) => {
      acc[activity.activityType] = (acc[activity.activityType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalActivities = activities.length;
    const mostFrequentActivity = Object.entries(activityCounts)
      .sort(([,a], [,b]) => b - a)[0];

    const averageMood = moodData.length > 0 
      ? moodData.reduce((sum, data) => sum + data.mood, 0) / moodData.length 
      : 0;

    return {
      totalActivities,
      mostFrequentActivity: mostFrequentActivity ? mostFrequentActivity[0] : 'None',
      averageMood: averageMood.toFixed(1),
      activityBreakdown: activityCounts
    };
  };

  const insights = getActivityInsights();

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading your mood analysis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Mood Analysis
          </CardTitle>
          <div className="flex gap-2">
            {(["week", "month", "year"] as TimeRange[]).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={timeRange === range ? "bg-mentii-500 hover:bg-mentii-600" : ""}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {moodData.length > 0 ? (
            <MoodChartVisualizations data={moodData} period={timeRange} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No mood data available for this period.</p>
              <p className="text-sm">Start logging your mood to see trends!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{insights.totalActivities}</div>
              <div className="text-sm text-blue-800">Total Activities</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 capitalize">{insights.mostFrequentActivity}</div>
              <div className="text-sm text-green-800">Most Frequent</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{insights.averageMood}</div>
              <div className="text-sm text-purple-800">Average Mood</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{Object.keys(insights.activityBreakdown).length}</div>
              <div className="text-sm text-orange-800">Activity Types</div>
            </div>
          </div>

          {Object.keys(insights.activityBreakdown).length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Activity Breakdown</h4>
              <div className="space-y-2">
                {Object.entries(insights.activityBreakdown).map(([activity, count]) => (
                  <div key={activity} className="flex justify-between items-center">
                    <span className="capitalize">{activity}</span>
                    <span className="font-medium">{count} times</span>
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

export default MoodAnalysis;