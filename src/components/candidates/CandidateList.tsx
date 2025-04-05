
import { useState } from "react";
import CandidateCard, { Candidate } from "./CandidateCard";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface CandidateListProps {
  candidates: Candidate[];
}

const CandidateList = ({ candidates }: CandidateListProps) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const goodFitCandidates = candidates.filter((c) => c.match === "good");
  const maybeFitCandidates = candidates.filter((c) => c.match === "maybe");
  const notFitCandidates = candidates.filter((c) => c.match === "bad");

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDialogOpen(true);
  };

  return (
    <>
      <Tabs defaultValue="good" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="good" className="relative">
            Good Fit
            {goodFitCandidates.length > 0 && (
              <Badge className="ml-2 bg-match-good text-white">{goodFitCandidates.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="maybe">
            Maybe Fit
            {maybeFitCandidates.length > 0 && (
              <Badge className="ml-2 bg-match-maybe text-white">{maybeFitCandidates.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="bad">
            Not a Fit
            {notFitCandidates.length > 0 && (
              <Badge className="ml-2 bg-match-bad text-white">{notFitCandidates.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="good" className="space-y-4">
          {goodFitCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {goodFitCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onClick={handleCandidateClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm-gray-500">No candidates in this category yet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="maybe" className="space-y-4">
          {maybeFitCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {maybeFitCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onClick={handleCandidateClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm-gray-500">No candidates in this category yet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bad" className="space-y-4">
          {notFitCandidates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notFitCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onClick={handleCandidateClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm-gray-500">No candidates in this category yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Candidate Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedCandidate && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <span>{selectedCandidate.name}</span>
                <span className="ml-auto">
                  <Badge className={`match-badge-${selectedCandidate.match}`}>
                    {selectedCandidate.match === "good" ? "Good Fit" : 
                     selectedCandidate.match === "maybe" ? "Maybe Fit" : "Not a Fit"} - 
                    {selectedCandidate.matchScore}%
                  </Badge>
                </span>
              </DialogTitle>
              <DialogDescription>{selectedCandidate.email}</DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="font-medium mb-2">Experience</h3>
                <p className="text-sm text-sm-gray-600">{selectedCandidate.experience}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Education</h3>
                <p className="text-sm text-sm-gray-600">{selectedCandidate.education}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-1">
                {selectedCandidate.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">AI Assessment</h3>
              <p className="text-sm text-sm-gray-600">
                This candidate has strong experience in the required areas.
                Their skills in {selectedCandidate.skills.slice(0, 3).join(", ")} align well with the position requirements.
                {selectedCandidate.match === "good" 
                  ? " Overall, they appear to be a strong match for this role."
                  : selectedCandidate.match === "maybe"
                  ? " They may need additional training in some required areas."
                  : " However, they don't appear to match the core requirements for this role."}
              </p>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default CandidateList;
