import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../components/auth/FirebaseConfig';
import { logActivity, getUserActivities, analyzeUserMood, getRecommendations, ActivityLog } from '../services/activityService';
import { Timestamp } from 'firebase/firestore';
import { toast } from './use-toast';

interface ActivityContextType {
  startActivity: (type: ActivityLog['activityType'], name: string, details?: any) => void;
  endActivity: () => void;
  currentActivity: { type: string; name: string; startTime: Date } | null;
  recentActivities: ActivityLog[];
  currentMood: string;
  recommendations: Array<{ type: string; message: string }>;
}

const ActivityContext = createContext<ActivityContextType | null>(null);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useAuthState(auth);
  const [currentActivity, setCurrentActivity] = useState<{ type: string; name: string; startTime: Date } | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [currentMood, setCurrentMood] = useState<string>('neutral');
  const [recommendations, setRecommendations] = useState<Array<{ type: string; message: string }>>([]);

  useEffect(() => {
    if (user) {
      loadRecentActivities();
      
      // Analyze mood every 5 minutes
      const interval = setInterval(() => {
        analyzeMoodAndRecommend();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [user]);

  const loadRecentActivities = async () => {
    if (!user) return;
    
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    const activities = await getUserActivities(user.uid, {
      start: fiveMinutesAgo,
      end: now
    });
    
    setRecentActivities(activities);
  };

  const analyzeMoodAndRecommend = async () => {
    if (!user || recentActivities.length === 0) return;

    const mood = analyzeUserMood(recentActivities);
    const recs = getRecommendations(mood, recentActivities);
    
    setCurrentMood(mood);
    setRecommendations(recs);

    // Show mood analysis notification
    toast({
      title: `Mood Analysis: ${mood.charAt(0).toUpperCase() + mood.slice(1)}`,
      description: recs[0]?.message || 'Keep exploring activities!',
      duration: 5000
    });
  };

  const startActivity = (type: ActivityLog['activityType'], name: string, details?: any) => {
    if (currentActivity) {
      endActivity();
    }
    
    setCurrentActivity({
      type,
      name,
      startTime: new Date()
    });

    console.log(`Started activity: ${type} - ${name}`);
  };

  const endActivity = async () => {
    if (!currentActivity || !user) return;

    const duration = Math.floor((new Date().getTime() - currentActivity.startTime.getTime()) / 1000);
    
    const activityLog: Omit<ActivityLog, 'id'> = {
      userId: user.uid,
      activityType: currentActivity.type as ActivityLog['activityType'],
      activityName: currentActivity.name,
      duration,
      timestamp: Timestamp.now()
    };

    await logActivity(activityLog);
    setRecentActivities(prev => [activityLog as ActivityLog, ...prev]);
    setCurrentActivity(null);

    console.log(`Ended activity: ${currentActivity.type} - ${currentActivity.name} (${duration}s)`);
  };

  return (
    <ActivityContext.Provider value={{
      startActivity,
      endActivity,
      currentActivity,
      recentActivities,
      currentMood,
      recommendations
    }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivityTracker = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivityTracker must be used within ActivityProvider');
  }
  return context;
};
