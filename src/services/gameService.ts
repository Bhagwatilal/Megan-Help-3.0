import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, limit, Timestamp, DocumentData } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Game score interface
export interface GameScore {
  gameId: string;
  userId: string;
  score: number;
  timestamp: Date;
  gameData?: any; // Additional game-specific data
}

// Save a game score to Firestore
export const saveGameScore = async (gameId: string, score: number, gameData?: any): Promise<boolean> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error("User not authenticated");
      return false;
    }
    
    const db = getFirestore();
    const scoreData: GameScore = {
      gameId,
      userId: user.uid,
      score,
      timestamp: new Date(),
      gameData
    };
    
    // Create a unique ID for this score entry
    const scoreId = `${gameId}-${user.uid}-${Date.now()}`;
    await setDoc(doc(db, "gameScores", scoreId), scoreData);
    
    // Also update the user's best score if this is better
    const userBestScoreRef = doc(db, "userBestScores", `${user.uid}-${gameId}`);
    const userBestScoreSnap = await getDoc(userBestScoreRef);
    
    if (!userBestScoreSnap.exists() || userBestScoreSnap.data().score < score) {
      await setDoc(userBestScoreRef, {
        userId: user.uid,
        gameId,
        score,
        timestamp: new Date()
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error saving game score:", error);
    return false;
  }
};

// Get a user's game scores
export const getUserGameScores = async (gameId?: string): Promise<GameScore[]> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error("User not authenticated");
      return [];
    }
    
    const db = getFirestore();
    let q;
    
    if (gameId) {
      // Get scores for a specific game
      q = query(
        collection(db, "gameScores"),
        where("userId", "==", user.uid),
        where("gameId", "==", gameId),
        orderBy("timestamp", "desc")
      );
    } else {
      // Get all user's game scores
      q = query(
        collection(db, "gameScores"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
    }
    
    const querySnapshot = await getDocs(q);
    const scores: GameScore[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      // Create a new object with typed data instead of using spread
      scores.push({
        gameId: data.gameId,
        userId: data.userId,
        score: data.score,
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(),
        gameData: data.gameData
      });
    });
    
    return scores;
  } catch (error) {
    console.error("Error getting user game scores:", error);
    return [];
  }
};

// Get leaderboard for a game
export const getGameLeaderboard = async (gameId: string, limitCount = 10): Promise<GameScore[]> => {
  try {
    const db = getFirestore();
    
    // Query the best scores for this game
    const q = query(
      collection(db, "userBestScores"),
      where("gameId", "==", gameId),
      orderBy("score", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const leaderboard: GameScore[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as DocumentData;
      // Create a new object with typed data instead of using spread
      leaderboard.push({
        gameId: data.gameId,
        userId: data.userId,
        score: data.score,
        timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(),
        gameData: data.gameData
      });
    });
    
    return leaderboard;
  } catch (error) {
    console.error("Error getting game leaderboard:", error);
    return [];
  }
};
