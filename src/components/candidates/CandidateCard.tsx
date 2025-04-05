
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
  onClick?: (candidate: Candidate) => void;
}

const CandidateCard = ({ candidate, onClick }: CandidateCardProps) => {
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

  return (
    <Card className="card-hover w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-sm-blue-100 text-sm-blue-600">
              {getInitials(candidate.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{candidate.name}</h3>
            <div className="text-sm text-sm-gray-500">{candidate.email}</div>
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
            <p className="text-sm text-sm-gray-500">{candidate.experience}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Education</p>
            <p className="text-sm text-sm-gray-500">{candidate.education}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Key Skills</p>
          <div className="flex flex-wrap gap-1">
            {candidate.skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
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
