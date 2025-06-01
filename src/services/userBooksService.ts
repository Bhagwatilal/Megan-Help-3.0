
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, orderBy, Timestamp, deleteDoc, DocumentData, limit as firestoreLimit } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export interface UserBook {
  id: string;
  userId: string;
  authorName: string;
  title: string;
  coverImage?: string;
  description: string;
  content: string;
  chapters?: UserBookChapter[];
  tags?: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserBookChapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

// Save a user-created book
export const saveUserBook = async (book: Partial<UserBook>): Promise<string | null> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error("User not authenticated");
      return null;
    }
    
    const db = getFirestore();
    const bookId = book.id || `book-${Date.now()}`;
    const isNewBook = !book.id;
    
    const bookData: Partial<UserBook> = {
      ...book,
      id: bookId,
      userId: user.uid,
      updatedAt: new Date()
    };
    
    if (isNewBook) {
      bookData.createdAt = new Date();
    }
    
    await setDoc(doc(db, "userBooks", bookId), bookData);
    return bookId;
  } catch (error) {
    console.error("Error saving user book:", error);
    return null;
  }
};

// Get all books created by the current user
export const getUserBooks = async (): Promise<UserBook[]> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error("User not authenticated");
      return [];
    }
    
    const db = getFirestore();
    const q = query(
      collection(db, "userBooks"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const books: UserBook[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as UserBook;
      books.push({
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
      });
    });
    
    return books;
  } catch (error) {
    console.error("Error getting user books:", error);
    return [];
  }
};

// Get public books for community sharing
export const getPublicBooks = async (limitCount: number = 20): Promise<UserBook[]> => {
  try {
    const db = getFirestore();
    const q = query(
      collection(db, "userBooks"),
      where("isPublic", "==", true),
      orderBy("createdAt", "desc"),
      firestoreLimit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const books: UserBook[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as UserBook;
      books.push({
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
      });
    });
    
    return books;
  } catch (error) {
    console.error("Error getting public books:", error);
    return [];
  }
};

// Get a specific book
export const getUserBook = async (bookId: string): Promise<UserBook | null> => {
  try {
    const db = getFirestore();
    const docRef = doc(db, "userBooks", bookId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as UserBook;
      
      // Check if the book is public or belongs to the current user
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!data.isPublic && (!user || data.userId !== user.uid)) {
        console.error("Unauthorized access to book");
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
    console.error("Error getting book:", error);
    return null;
  }
};

// Delete a user book
export const deleteUserBook = async (bookId: string): Promise<boolean> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error("User not authenticated");
      return false;
    }
    
    // Get the book first to verify ownership
    const db = getFirestore();
    const docRef = doc(db, "userBooks", bookId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.error("Book not found");
      return false;
    }
    
    const bookData = docSnap.data();
    if (bookData.userId !== user.uid) {
      console.error("Not authorized to delete this book");
      return false;
    }
    
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting book:", error);
    return false;
  }
};
