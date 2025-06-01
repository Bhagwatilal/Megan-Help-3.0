// Books service for fetching books from Google Books API
const API_KEY = 'AIzaSyD_llRD1q_6d5l6aOP9b3O6Lkkh4q3Mvr8';

export interface GoogleBook {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    maturityRating?: string;
    imageLinks?: {
      smallThumbnail?: string;
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      extraLarge?: string;
    };
    language?: string;
    previewLink?: string;
    infoLink?: string;
    canonicalVolumeLink?: string;
  };
  searchInfo?: {
    textSnippet?: string;
  };
  accessInfo?: {
    country?: string;
    viewability?: string;
    embeddable?: boolean;
    publicDomain?: boolean;
    textToSpeechPermission?: string;
    epub?: {
      isAvailable: boolean;
      downloadLink?: string;
    };
    pdf?: {
      isAvailable: boolean;
      downloadLink?: string;
    };
    webReaderLink?: string;
    accessViewStatus?: string;
  };
}

export interface GoogleBooksResponse {
  kind: string;
  totalItems: number;
  items: GoogleBook[];
}

export const searchGoogleBooks = async (query: string, maxResults: number = 10): Promise<GoogleBook[]> => {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch books from Google Books API');
    }
    
    const data: GoogleBooksResponse = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

export const getBookById = async (id: string): Promise<GoogleBook | null> => {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch book details from Google Books API');
    }
    
    const data: GoogleBook = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
};

// Extracts text content from the book's description HTML
export const extractTextFromHTML = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary DOM element
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Get the text content
  return temp.textContent || temp.innerText || '';
};

// Get a book's text content (simplified for public domain books)
export const getBookContent = async (id: string): Promise<string[]> => {
  try {
    const book = await getBookById(id);
    
    if (!book || !book.volumeInfo || !book.volumeInfo.description) {
      return [];
    }
    
    // For demo purposes, we'll use the description split into paragraphs
    const description = extractTextFromHTML(book.volumeInfo.description);
    
    // Split into paragraphs and filter out empty lines
    return description
      .split(/\n+/)
      .filter(paragraph => paragraph.trim().length > 0)
      .map(paragraph => paragraph.trim());
  } catch (error) {
    console.error('Error getting book content:', error);
    return [];
  }
};
