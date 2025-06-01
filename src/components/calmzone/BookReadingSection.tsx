
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, BookCopy, Search, Star, Heart, Clock, ChevronLeft, ChevronRight, Menu, X, BookMarked, Loader2 } from "lucide-react";
import { toast } from "sonner";
import "../calmzone/bookStyles.css";
import { searchGoogleBooks, getBookById, GoogleBook, getBookContent } from "../../services/booksService";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  cover: string;
  rating: number;
  pages: number;
  description: string;
  content?: string[];
  googleBookId?: string;
}

// Initial books for quick loading
const initialBooks: Book[] = [
  {
    id: "1",
    title: "The Power of Now",
    author: "Eckhart Tolle",
    category: "Mindfulness",
    cover: "https://books.google.com/books/content?id=sQYqRTkT_nkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    rating: 4.8,
    pages: 236,
    description: "A guide to spiritual enlightenment that emphasizes the importance of living in the present moment and transcending thoughts of the past or future.",
    googleBookId: "sQYqRTkT_nkC"
  },
  {
    id: "2",
    title: "Meditation for Beginners",
    author: "Jack Kornfield",
    category: "Meditation",
    cover: "https://books.google.com/books/content?id=XA8tDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    rating: 4.6,
    pages: 178,
    description: "A friendly and accessible guide to meditation practice, offering simple exercises to reduce stress and increase mindfulness.",
    googleBookId: "XA8tDwAAQBAJ"
  },
  {
    id: "3",
    title: "Why We Sleep",
    author: "Matthew Walker",
    category: "Health",
    cover: "https://books.google.com/books/content?id=ZlU3DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    rating: 4.7,
    pages: 342,
    description: "Exploring the science of sleep and dreams, and offering practical advice for improving sleep quality and overall health.",
    googleBookId: "ZlU3DwAAQBAJ"
  },
  {
    id: "4",
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    category: "Psychology",
    cover: "https://books.google.com/books/content?id=F-Q_xGjWBi8C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    rating: 4.9,
    pages: 192,
    description: "A profound exploration of the human condition and the pursuit of meaning in the face of suffering and adversity.",
    googleBookId: "F-Q_xGjWBi8C"
  },
  {
    id: "5",
    title: "Wherever You Go, There You Are",
    author: "Jon Kabat-Zinn",
    category: "Mindfulness",
    cover: "https://books.google.com/books/content?id=QaHZ0-sQMQcC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    rating: 4.5,
    pages: 240,
    description: "A practical guide to mindfulness meditation, offering simple practices for bringing awareness to everyday life.",
    googleBookId: "QaHZ0-sQMQcC"
  },
  {
    id: "6",
    title: "The Untethered Soul",
    author: "Michael A. Singer",
    category: "Spirituality",
    cover: "https://books.google.com/books/content?id=GwRj5sUZUXcC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
    rating: 4.7,
    pages: 200,
    description: "A journey beyond yourself to discover consciousness, achieve self-realization and find inner peace.",
    googleBookId: "GwRj5sUZUXcC"
  },
];

const categories = [
  "All Categories",
  "Mindfulness",
  "Meditation",
  "Psychology",
  "Health",
  "Spirituality",
  "Self-Help",
  "Philosophy"
];

const BookReadingSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [bookContentLoaded, setBookContentLoaded] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"left" | "right" | null>(null);
  
  const bookContentRef = useRef<HTMLDivElement>(null);

  // Search Google Books API
  const searchBooks = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await searchGoogleBooks(query);
      
      if (results.length === 0) {
        toast.info("No books found", {
          description: "Try a different search term"
        });
        return;
      }
      
      // Convert Google Books to our Book format
      const newBooks = results.map(googleBook => mapGoogleBookToBook(googleBook));
      setBooks(newBooks);
      
      toast.success(`Found ${results.length} books`, {
        description: "Click on a book to read it"
      });
    } catch (error) {
      console.error("Error searching books:", error);
      toast.error("Failed to search books", {
        description: "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Map Google Book to our Book format
  const mapGoogleBookToBook = (googleBook: GoogleBook): Book => {
    const volumeInfo = googleBook.volumeInfo;
    return {
      id: googleBook.id,
      title: volumeInfo.title || "Unknown Title",
      author: volumeInfo.authors ? volumeInfo.authors.join(", ") : "Unknown Author",
      category: volumeInfo.categories ? volumeInfo.categories[0] : "Uncategorized",
      cover: volumeInfo.imageLinks?.thumbnail || "https://via.placeholder.com/128x192?text=No+Cover",
      rating: volumeInfo.averageRating || 4.0,
      pages: volumeInfo.pageCount || 100,
      description: volumeInfo.description || "No description available.",
      googleBookId: googleBook.id
    };
  };

  const loadBookContent = async (book: Book) => {
    if (book.content) {
      // Content already loaded
      return;
    }
    
    setIsLoadingContent(true);
    
    try {
      const content = await getBookContent(book.googleBookId || book.id);
      
      if (content.length === 0) {
        // If no content, create some placeholder content
        book.content = [
          "Chapter 1",
          "This book doesn't have preview content available through the Google Books API.",
          "However, you can still enjoy the interactive reading experience with our placeholder content.",
          "In the full version, you would be able to read the complete book with all its wisdom and insights.",
          "To continue reading, consider purchasing the full book from your favorite bookseller.",
          "For now, you can explore other books in our library or enjoy the interactive page turning experience with this placeholder content.",
          "Chapter 2",
          "Learning to be present in the moment is one of the most valuable skills we can develop.",
          "When we focus on the now, we let go of past regrets and future anxieties.",
          "This simple shift in awareness can transform our experience of life.",
          "Try taking a few deep breaths and notice how your body feels right now.",
          "That's the beginning of mindfulness practice."
        ];
      } else {
        book.content = content;
      }
      
      setBookContentLoaded(true);
    } catch (error) {
      console.error("Error loading book content:", error);
      toast.error("Failed to load book content", {
        description: "Please try another book"
      });
      
      // Set placeholder content
      book.content = [
        "Preview not available",
        "Unfortunately, we couldn't load the preview for this book.",
        "Please try another book from our library."
      ];
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleBookSelect = async (book: Book) => {
    setSelectedBook(book);
    setCurrentPage(0);
    
    toast.success(`Opening "${book.title}"`, {
      description: "Enjoy your reading session"
    });
    
    await loadBookContent(book);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const nextPage = () => {
    if (selectedBook?.content && currentPage < selectedBook.content.length - 1) {
      setFlipDirection("right");
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setFlipDirection("left");
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Handle animation end
  useEffect(() => {
    const bookContentElement = bookContentRef.current;
    if (!bookContentElement) return;
    
    const handleAnimationEnd = () => {
      setFlipDirection(null);
    };
    
    bookContentElement.addEventListener('animationend', handleAnimationEnd);
    
    return () => {
      bookContentElement.removeEventListener('animationend', handleAnimationEnd);
    };
  }, []);

  // Filter books based on search query and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBooks(searchQuery);
  };

  const renderBookLibrary = () => (
    <div className="space-y-6">
      <form className="flex flex-col sm:flex-row gap-4 justify-between" onSubmit={handleSearch}>
        <div className="relative w-full sm:w-64 flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search books or authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </form>
      
      <div className="flex overflow-x-auto gap-2 pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-[2/3] bg-slate-200 animate-pulse"></div>
              <CardHeader className="pb-2">
                <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3 animate-pulse"></div>
              </CardContent>
              <CardFooter>
                <div className="h-9 bg-slate-200 rounded w-full animate-pulse"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card 
              key={book.id} 
              className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
              onClick={() => handleBookSelect(book)}
            >
              <div className="aspect-[2/3] relative bg-slate-100">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/128x192?text=No+Cover";
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-white/80 text-black hover:bg-white/90">
                    {book.category}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                <CardDescription className="line-clamp-1">by {book.author}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="ml-1 text-sm">{book.rating}</span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="ml-1 text-sm text-muted-foreground">{book.pages} pages</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {filteredBooks.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Books Found</h3>
          <p className="text-muted-foreground mb-6">Try a different search term or category</p>
        </div>
      )}
    </div>
  );

  const renderReader = () => (
    <div className="flex h-[70vh] border rounded-lg overflow-hidden">
      {isSidebarOpen && (
        <div className="w-64 border-r p-4 flex flex-col h-full bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Contents</h3>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {isLoadingContent ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-mentii-500" />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {selectedBook?.content?.map((section, index) => {
                // Use the first line as a section title
                const isChapter = section.toLowerCase().includes('chapter');
                
                return (
                  <button
                    key={index}
                    className={`w-full text-left py-2 px-3 rounded text-sm ${
                      currentPage === index ? 'bg-mentii-100 text-mentii-900' : 'hover:bg-slate-100'
                    } ${isChapter ? 'font-medium' : ''}`}
                    onClick={() => {
                      const direction = index > currentPage ? "right" : "left";
                      setFlipDirection(direction);
                      setCurrentPage(index);
                    }}
                  >
                    {section.split('\n')[0].slice(0, 40)}{section.length > 40 ? '...' : ''}
                  </button>
                );
              })}
            </div>
          )}
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full" onClick={() => setSelectedBook(null)}>
              Back to Library
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col h-full">
        <div className="bg-white p-4 border-b flex items-center justify-between">
          {!isSidebarOpen && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex-1 text-center">
            <h2 className="font-semibold">{selectedBook?.title}</h2>
            <p className="text-sm text-muted-foreground">{selectedBook?.author}</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <BookMarked className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {isLoadingContent ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-mentii-500" />
                <p>Loading book content...</p>
              </div>
            </div>
          ) : selectedBook?.content && selectedBook.content.length > 0 ? (
            <div 
              ref={bookContentRef}
              className={`max-w-2xl mx-auto book-paper p-8 shadow-md rounded-md ${
                flipDirection === "right" ? "animate-book-flip-right" : 
                flipDirection === "left" ? "animate-book-flip-left" : ""
              }`}
            >
              <div className="prose">
                {selectedBook.content[currentPage].split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Content Preview Not Available</h3>
              <p className="text-muted-foreground mb-6">This book doesn't have a preview available yet.</p>
              <Button onClick={() => setSelectedBook(null)}>Return to Library</Button>
            </div>
          )}
        </div>
        
        <div className="bg-white p-4 border-t flex items-center justify-between">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={prevPage}
            disabled={currentPage === 0 || isLoadingContent}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {selectedBook?.content?.length || 1}
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextPage}
            disabled={isLoadingContent || !selectedBook?.content || currentPage >= selectedBook.content.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {selectedBook ? renderReader() : renderBookLibrary()}
    </div>
  );
};

export default BookReadingSection;
