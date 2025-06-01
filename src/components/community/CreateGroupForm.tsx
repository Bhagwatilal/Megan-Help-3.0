
import React, { useState, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Image, X, Upload } from "lucide-react";

interface CreateGroupFormProps {
  onGroupCreated: (group: any) => void;
  onCancel: () => void;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ onGroupCreated, onCancel }) => {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupTags, setGroupTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !groupTags.includes(tagInput.trim())) {
      setGroupTags([...groupTags, tagInput.trim()]);
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setGroupTags(groupTags.filter(t => t !== tag));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newGroup = {
        id: Date.now(),
        name: groupName,
        description: groupDescription,
        members: 1,
        posts: 0,
        image: imagePreview || "https://images.unsplash.com/photo-1531685250784-7569952593d2?w=150&auto=format",
        createdAt: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
      
      onGroupCreated(newGroup);
      toast.success("Group created successfully!");
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Group</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name <span className="text-red-500">*</span></Label>
            <Input 
              id="group-name" 
              value={groupName} 
              onChange={(e) => setGroupName(e.target.value)} 
              placeholder="Enter group name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group-description">Description</Label>
            <Textarea 
              id="group-description" 
              value={groupDescription} 
              onChange={(e) => setGroupDescription(e.target.value)} 
              placeholder="What is this group about?"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Group Image</Label>
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-40 object-cover rounded-md" 
                />
                <button 
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center"
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Group Image
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group-tags">Tags</Label>
            <div className="flex">
              <Input 
                id="group-tags" 
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)} 
                placeholder="Add tags (e.g., anxiety, meditation)"
                className="rounded-r-none"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button 
                type="button" 
                onClick={handleAddTag} 
                className="rounded-l-none"
              >
                Add
              </Button>
            </div>
            
            {groupTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {groupTags.map(tag => (
                  <div key={tag} className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !groupName.trim()}
          >
            {isSubmitting ? "Creating..." : "Create Group"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateGroupForm;
