import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  doc,
  updateDoc 
} from 'firebase/firestore';
import { firestore as db } from '../components/auth/FirebaseConfig';

export interface JournalEntry {
  id?: string;
  userId: string;
  prompt: string;
  content: string;
  mood?: string;
  createdAt: Timestamp;
}

export interface ActivityLog {
  id?: string;
  userId: string;
  activityType: 'music' | 'game' | 'journal' | 'book' | 'drawing' | 'puzzle';
  activityName: string;
  duration: number; // in seconds
  timestamp: Timestamp;
  details?: any;
}

export interface UserSession {
  id?: string;
  userId: string;
  startTime: Timestamp;
  lastActivity: Timestamp;
  totalTime: number;
  activities: ActivityLog[];
}

export const saveJournalEntry = async (entry: Omit<JournalEntry, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'journalEntries'), entry);
    return docRef.id;
  } catch (error) {
    console.error('Error saving journal entry:', error);
    throw error;
  }
};

export const getUserJournalEntries = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'journalEntries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as JournalEntry));
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return [];
  }
};

export const logActivity = async (activity: Omit<ActivityLog, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'activityLogs'), activity);
    return docRef.id;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

export const getUserActivities = async (userId: string, timeRange?: { start: Date; end: Date }) => {
  try {
    let q = query(
      collection(db, 'activityLogs'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );

    if (timeRange) {
      q = query(
        collection(db, 'activityLogs'),
        where('userId', '==', userId),
        where('timestamp', '>=', Timestamp.fromDate(timeRange.start)),
        where('timestamp', '<=', Timestamp.fromDate(timeRange.end)),
        orderBy('timestamp', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as ActivityLog));
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

export const analyzeUserMood = (activities: ActivityLog[]) => {
  const activityMoodMap = {
    music: { positive: 0.7, neutral: 0.2, negative: 0.1 },
    game: { positive: 0.6, neutral: 0.3, negative: 0.1 },
    journal: { positive: 0.4, neutral: 0.4, negative: 0.2 },
    book: { positive: 0.5, neutral: 0.4, negative: 0.1 },
    drawing: { positive: 0.8, neutral: 0.2, negative: 0.0 },
    puzzle: { positive: 0.6, neutral: 0.4, negative: 0.0 }
  };

  let totalPositive = 0;
  let totalNeutral = 0;
  let totalNegative = 0;
  let totalDuration = 0;

  activities.forEach(activity => {
    const moodWeights = activityMoodMap[activity.activityType];
    totalPositive += moodWeights.positive * activity.duration;
    totalNeutral += moodWeights.neutral * activity.duration;
    totalNegative += moodWeights.negative * activity.duration;
    totalDuration += activity.duration;
  });

  if (totalDuration === 0) return 'neutral';

  const positiveRatio = totalPositive / totalDuration;
  const negativeRatio = totalNegative / totalDuration;

  if (positiveRatio > 0.6) return 'positive';
  if (negativeRatio > 0.4) return 'negative';
  return 'neutral';
};

export const getRecommendations = (mood: string, recentActivities: ActivityLog[]) => {
  const recommendations = {
    positive: [
      { type: 'music', message: 'Keep the good vibes with uplifting music!' },
      { type: 'drawing', message: 'Express your creativity with drawing!' }
    ],
    neutral: [
      { type: 'puzzle', message: 'Challenge your mind with puzzles!' },
      { type: 'journal', message: 'Reflect on your day with journaling!' }
    ],
    negative: [
      { type: 'calmzone', message: 'Take a moment to relax in the calm zone' },
      { type: 'music', message: 'Listen to some calming music to feel better' }
    ]
  };

  return recommendations[mood as keyof typeof recommendations] || recommendations.neutral;
};
