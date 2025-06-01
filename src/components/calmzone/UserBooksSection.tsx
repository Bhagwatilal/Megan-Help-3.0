
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserBook, getUserBooks, deleteUserBook } from "@/services/userBooksService";
import CreateBookForm from "./CreateBookForm";
import { format } from "date-fns";
import { Book, Plus, Edit, Trash, Eye } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserBooksSection: React.FC = () => {
  const [books, setBooks] = useState<UserBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBook, setEditingBook] = useState<UserBook | null>(null);
  const [selectedBook, setSelectedBook] = useState<UserBook | null>(null);
  
  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const userBooks = await getUserBooks();
      setBooks(userBooks);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast.error("Failed to load your books");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBooks();
  }, []);
  
  const handleCreateBook = () => {
    setEditingBook(null);
    setShowCreateForm(true);
    setSelectedBook(null);
  };
  
  const handleEditBook = (book: UserBook) => {
    setEditingBook(book);
    setShowCreateForm(true);
    setSelectedBook(null);
  };
  
  const handleViewBook = (book: UserBook) => {
    setSelectedBook(book);
    setShowCreateForm(false);
    setEditingBook(null);
  };
  
  const handleDeleteBook = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) {
      return;
    }
    
    try {
      const success = await deleteUserBook(bookId);
      if (success) {
        toast.success("Book deleted successfully");
        fetchBooks();
        if (selectedBook?.id === bookId) {
          setSelectedBook(null);
        }
      } else {
        toast.error("Failed to delete book");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("An error occurred while deleting the book");
    }
  };
  
  const handleSaveComplete = (bookId: string) => {
    fetchBooks();
    setShowCreateForm(false);
    setEditingBook(null);
    toast.success("Book saved successfully!");
  };
  
  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setEditingBook(null);
  };
  
  const BookViewer = ({ book }: { book: UserBook }) => {
    return (
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{book.title}</CardTitle>
              <CardDescription>By {book.authorName || "Anonymous"}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedBook(null)}>
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <div className="prose prose-sm max-w-none">
            {book.description && (
              <div className="mb-6 italic text-gray-600 border-l-4 border-gray-200 pl-4">
                {book.description}
              </div>
            )}
            <div className="font-serif whitespace-pre-line">
              {book.content}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 text-sm text-gray-500">
          Created: {format(new Date(book.createdAt), "PPP")}
          {book.isPublic && <span className="ml-2 text-green-600">• Public</span>}
        </CardFooter>
      </Card>
    );
  };
  
  const BookList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-mentii-500 rounded-full border-t-transparent"></div>
        </div>
      );
    }
    
    if (books.length === 0) {
      return (
        <div className="text-center py-12">
          <Book className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No books yet</h3>
          <p className="text-gray-500 mb-4">Start creating your own books to read and share</p>
          <Button onClick={handleCreateBook}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Book
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {books.map((book) => (
          <Card key={book.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
              <CardDescription>By {book.authorName || "Anonymous"}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-3">{book.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between mt-auto border-t pt-4">
              <div className="text-xs text-gray-500">
                {format(new Date(book.createdAt), "PP")}
                {book.isPublic && <span className="ml-2 text-green-600">• Public</span>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewBook(book)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditBook(book)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteBook(book.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Books</h2>
        {!showCreateForm && !selectedBook && (
          <Button onClick={handleCreateBook}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Book
          </Button>
        )}
      </div>
      
      {showCreateForm ? (
        <CreateBookForm 
          initialBook={editingBook || undefined} 
          onSave={handleSaveComplete}
          onCancel={handleCancelCreate}
        />
      ) : selectedBook ? (
        <BookViewer book={selectedBook} />
      ) : (
        <BookList />
      )}
    </div>
  );
};

export default UserBooksSection;
