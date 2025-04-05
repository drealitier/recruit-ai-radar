
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface JobDescriptionCardProps {
  onJobSaved?: (job: { title: string; description: string }) => void;
}

const JobDescriptionCard = ({ onJobSaved }: JobDescriptionCardProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onJobSaved) {
        onJobSaved({ title, description });
      }
      
      toast({
        title: "Job description saved",
        description: "You can now upload resumes to match with this position.",
      });
      
      // Clear the form for a new job description
      setTitle("");
      setDescription("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Job Description</CardTitle>
        <CardDescription>
          Enter the details of the position you're hiring for
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-title">Job Title</Label>
            <Input
              id="job-title"
              placeholder="e.g. Senior Frontend Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste or write your job description here..."
              rows={8}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="resize-none"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Job Description"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default JobDescriptionCard;
