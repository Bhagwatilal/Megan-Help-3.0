
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserBook, saveUserBook } from "@/services/userBooksService";
import { toast } from "sonner";
import { PlusCircle, Trash, Save, BookOpen } from "lucide-react";

interface CreateBookFormProps {
  initialBook?: UserBook;
  onSave?: (bookId: string) => void;
  onCancel?: () => void;
}

const CreateBookForm: React.FC<CreateBookFormProps> = ({ initialBook, onSave, onCancel }) => {
  const [book, setBook] = useState<Partial<UserBook>>(
    initialBook || {
      title: "",
      authorName: "",
      description: "",
      content: "",
      isPublic: false,
      chapters: []
    }
  );
  
  const [activeTab, setActiveTab] = useState("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setBook((prev) => ({
      ...prev,
      isPublic: checked
    }));
  };
  
  const handleSaveBook = async () => {
    if (!book.title || !book.content) {
      toast.error("Please provide a title and content for your book");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const bookId = await saveUserBook(book);
      
      if (bookId) {
        toast.success(`Book "${book.title}" saved successfully!`);
        if (onSave) onSave(bookId);
      } else {
        toast.error("Failed to save book");
      }
    } catch (error) {
      console.error("Error saving book:", error);
      toast.error("An error occurred while saving your book");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialBook ? "Edit Book" : "Create New Book"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Book Details</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Book Title</Label>
              <Input
                id="title"
                name="title"
                value={book.title}
                onChange={handleInputChange}
                placeholder="Enter a title for your book"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="authorName">Author Name</Label>
              <Input
                id="authorName"
                name="authorName"
                value={book.authorName}
                onChange={handleInputChange}
                placeholder="Your name or pen name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Book Description</Label>
              <Textarea
                id="description"
                name="description"
                value={book.description}
                onChange={handleInputChange}
                placeholder="Write a brief description of your book"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={book.isPublic}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isPublic">Make this book public</Label>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="content">Book Content</Label>
              <Textarea
                id="content"
                name="content"
                value={book.content}
                onChange={handleInputChange}
                placeholder="Write your book content here..."
                rows={15}
                className="font-serif"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSaveBook} disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Book
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateBookForm;
