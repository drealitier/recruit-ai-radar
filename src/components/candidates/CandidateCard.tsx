
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Candidate {
  id: string;
  name: string;
  matchScore: number;
  email: string;
  phone?: string;
  skills: string[];
  experience: string;
  education: string;
  match: "good" | "maybe" | "bad";
}

interface CandidateCardProps {
  candidate: Candidate;
  searchQuery?: string;
  onClick?: (candidate: Candidate) => void;
}

const CandidateCard = ({ candidate, searchQuery = "", onClick }: CandidateCardProps) => {
  const getMatchLabel = (match: string) => {
    switch (match) {
      case "good":
        return "Good Fit";
      case "maybe":
        return "Maybe Fit";
      case "bad":
        return "Not a Fit";
      default:
        return "Unknown";
    }
  };

  const getMatchClass = (match: string) => {
    switch (match) {
      case "good":
        return "match-badge-good";
      case "maybe":
        return "match-badge-maybe";
      case "bad":
        return "match-badge-bad";
      default:
        return "match-badge";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Helper function to determine if a skill should be highlighted based on search query
  const isHighlightedSkill = (skill: string, query: string): boolean => {
    if (!query) return false;
    
    const normalizedSkill = skill.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    
    // Check if the skill directly matches part of the query
    if (normalizedSkill.includes(normalizedQuery) || normalizedQuery.includes(normalizedSkill)) {
      return true;
    }
    
    // Check for category matches
    if ((normalizedQuery.includes("frontend") || normalizedQuery.includes("front end") || 
         normalizedQuery.includes("front-end")) && 
        ["react", "angular", "vue", "css", "html", "javascript", "typescript", 
         "redux", "tailwind", "ui/ux", "scss", "frontend"].some(s => normalizedSkill.includes(s))) {
      return true;
    }
    
    if ((normalizedQuery.includes("backend") || normalizedQuery.includes("back end") || 
         normalizedQuery.includes("back-end")) && 
        ["node.js", "express", "python", "java", "c#", "php", "ruby", "django", 
         "flask", "spring", "asp.net", "sql", "mongodb", "postgresql", "mysql", "backend"].some(s => normalizedSkill.includes(s))) {
      return true;
    }
    
    if ((normalizedQuery.includes("devops") || normalizedQuery.includes("dev ops")) && 
        ["docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "jenkins", 
         "terraform", "ansible", "devops", "linux"].some(s => normalizedSkill.includes(s))) {
      return true;
    }
    
    if ((normalizedQuery.includes("mobile") || normalizedQuery.includes("app")) && 
        ["react native", "flutter", "swift", "kotlin", "ios", "android", "mobile"].some(s => normalizedSkill.includes(s))) {
      return true;
    }
    
    return false;
  };

  return (
    <Card className="card-hover w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials(candidate.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{candidate.name}</h3>
            <div className="text-sm text-gray-500">{candidate.email}</div>
          </div>
        </div>
        <div className={getMatchClass(candidate.match)}>
          {getMatchLabel(candidate.match)} - {candidate.matchScore}%
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <p className="text-sm font-medium">Experience</p>
            <p className="text-sm text-gray-500">{candidate.experience}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Education</p>
            <p className="text-sm text-gray-500">{candidate.education}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Key Skills</p>
          <div className="flex flex-wrap gap-1">
            {candidate.skills.map((skill, index) => (
              <Badge 
                key={index} 
                variant={isHighlightedSkill(skill, searchQuery) ? "default" : "outline"} 
                className={`text-xs ${isHighlightedSkill(skill, searchQuery) ? "bg-green-500 hover:bg-green-600" : ""}`}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full"
          onClick={() => onClick && onClick(candidate)}
        >
          View Full Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
