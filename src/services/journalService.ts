import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, Timestamp, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Save a journal entry
export const saveJournalEntry = async (entry: Partial<JournalEntry>): Promise<string | null> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error("User not authenticated");
      return null;
    }
    
    const db = getFirestore();
    const entryId = entry.id || `journal-${Date.now()}`;
    const isNewEntry = !entry.id;
    
    const entryData: Partial<JournalEntry> = {
      ...entry,
      id: entryId,
      userId: user.uid,
      updatedAt: new Date()
    };
    
    if (isNewEntry) {
      entryData.createdAt = new Date();
    }
    
    await setDoc(doc(db, "journalEntries", entryId), entryData);
    return entryId;
  } catch (error) {
    console.error("Error saving journal entry:", error);
    return null;
  }
};

// Get all journal entries for the current user
export const getUserJournalEntries = async (): Promise<JournalEntry[]> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error("User not authenticated");
      return [];
    }
    
    const db = getFirestore();
    const q = query(
      collection(db, "journalEntries"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const entries: JournalEntry[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as JournalEntry;
      entries.push({
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
      });
    });
    
    return entries;
  } catch (error) {
    console.error("Error getting journal entries:", error);
    return [];
  }
};

// Get a specific journal entry
export const getJournalEntry = async (entryId: string): Promise<JournalEntry | null> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error("User not authenticated");
      return null;
    }
    
    const db = getFirestore();
    const docRef = doc(db, "journalEntries", entryId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as JournalEntry;
      if (data.userId !== user.uid) {
        console.error("Unauthorized access to journal entry");
        return null;
      }
      
      return {
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting journal entry:", error);
    return null;
  }
};

// Delete a journal entry
export const deleteJournalEntry = async (entryId: string): Promise<boolean> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error("User not authenticated");
      return false;
    }
    
    // Verify ownership before deleting
    const entry = await getJournalEntry(entryId);
    if (!entry || entry.userId !== user.uid) {
      console.error("Unauthorized deletion attempt");
      return false;
    }
    
    const db = getFirestore();
    await deleteDoc(doc(db, "journalEntries", entryId));
    return true;
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return false;
  }
};
