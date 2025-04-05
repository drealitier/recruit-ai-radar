
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AISearch from "@/components/search/AISearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import CandidateList from "@/components/candidates/CandidateList";
import type { Candidate } from "@/components/candidates/CandidateCard";

const Search = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [candidateResults, setCandidateResults] = useState<Candidate[]>([]);

  // Process search results when searching candidates
  const handleCandidateResults = (results: any[]) => {
    setSearchResults(results);
    
    // Transform the raw results into the Candidate format
    const formattedCandidates = results.map(result => ({
      id: result.id || String(Math.random()),
      name: result.name || "Unknown",
      email: result.email || "unknown@example.com",
      matchScore: result.match_score || Math.floor(Math.random() * 100),
      skills: Array.isArray(result.skills) ? result.skills : ["No skills listed"],
      experience: result.experience || "Not specified",
      education: result.education || "Not specified",
      match: determineMatchCategory(result.match_score)
    }));
    
    setCandidateResults(formattedCandidates);
  };

  // Helper function to determine match category
  const determineMatchCategory = (score?: number): "good" | "maybe" | "bad" => {
    if (!score) return "maybe";
    if (score >= 80) return "good";
    if (score >= 60) return "maybe";
    return "bad";
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">AI-Powered Search</h1>
        
        <Tabs defaultValue="candidates">
          <TabsList className="mb-4">
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="candidates">
            <div className="space-y-6">
              <AISearch 
                defaultTable="candidates" 
                onResultsFound={handleCandidateResults} 
              />
              
              {candidateResults.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <CandidateList candidates={candidateResults} />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="jobs">
            <AISearch defaultTable="job_postings" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Search;
