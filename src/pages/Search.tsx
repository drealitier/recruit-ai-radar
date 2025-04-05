
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AISearch from "@/components/search/AISearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import CandidateList from "@/components/candidates/CandidateList";
import type { Candidate } from "@/components/candidates/CandidateCard";

// Skill categorization
const frontendSkills = [
  "react", "angular", "vue", "css", "html", "javascript", "typescript", 
  "redux", "tailwind", "ui/ux", "scss", "frontend", "figma"
];

const backendSkills = [
  "node.js", "express", "python", "java", "c#", "php", "ruby", "django", 
  "flask", "spring", "asp.net", "sql", "mongodb", "postgresql", "mysql", "backend"
];

const devopsSkills = [
  "docker", "kubernetes", "aws", "azure", "gcp", "ci/cd", "jenkins", 
  "terraform", "ansible", "devops", "linux"
];

const mobileSkills = [
  "react native", "flutter", "swift", "kotlin", "ios", "android", "mobile"
];

const Search = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [candidateResults, setCandidateResults] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Helper function to check skill relevance to query
  const getSkillRelevance = (skills: string[], query: string): number => {
    // Normalize query and skills to lowercase for comparison
    const normalizedQuery = query.toLowerCase();
    
    // Determine which skill category is being searched for
    let targetSkills: string[] = [];
    
    if (normalizedQuery.includes("frontend") || normalizedQuery.includes("front end") || 
        normalizedQuery.includes("front-end")) {
      targetSkills = frontendSkills;
    } 
    else if (normalizedQuery.includes("backend") || normalizedQuery.includes("back end") || 
             normalizedQuery.includes("back-end")) {
      targetSkills = backendSkills;
    }
    else if (normalizedQuery.includes("devops") || normalizedQuery.includes("dev ops") || 
             normalizedQuery.includes("operations")) {
      targetSkills = devopsSkills;
    }
    else if (normalizedQuery.includes("mobile") || normalizedQuery.includes("app") || 
             normalizedQuery.includes("android") || normalizedQuery.includes("ios")) {
      targetSkills = mobileSkills;
    }
    
    // Default case - look for specific skill mentions
    if (targetSkills.length === 0) {
      // Just check if the query text appears in any skill
      return skills.filter(skill => 
        skill.toLowerCase().includes(normalizedQuery) || 
        normalizedQuery.includes(skill.toLowerCase())
      ).length;
    }
    
    // Calculate how many of the candidate's skills match the target category
    const matchedSkills = skills.filter(skill => 
      targetSkills.some(target => skill.toLowerCase().includes(target) || 
      target.includes(skill.toLowerCase()))
    );
    
    return matchedSkills.length;
  };

  // Process search results when searching candidates
  const handleCandidateResults = (results: any[], query: string) => {
    setSearchResults(results);
    setSearchQuery(query);
    
    // Transform the raw results into the Candidate format with enhanced matching
    const formattedCandidates = results.map(result => {
      // Extract skills and normalize
      const skills = Array.isArray(result.skills) ? result.skills : ["No skills listed"];
      
      // Calculate skill relevance score based on the query
      const skillRelevance = getSkillRelevance(skills, query);
      
      // Calculate adjusted match score based on skill relevance
      let adjustedMatchScore = result.match_score || Math.floor(Math.random() * 100);
      
      // Boost or reduce match score based on skill relevance
      if (skillRelevance > 0) {
        // Boost score if relevant skills are found
        adjustedMatchScore = Math.min(100, adjustedMatchScore + (skillRelevance * 5));
      } else if (query.toLowerCase().includes("frontend") || 
                query.toLowerCase().includes("backend") || 
                query.toLowerCase().includes("devops") ||
                query.toLowerCase().includes("mobile")) {
        // Reduce score if specific category was searched but no relevant skills
        adjustedMatchScore = Math.max(30, adjustedMatchScore - 40);
      }
      
      return {
        id: result.id || String(Math.random()),
        name: result.name || "Unknown",
        email: result.email || "unknown@example.com",
        matchScore: adjustedMatchScore,
        skills: skills,
        experience: result.experience || "Not specified",
        education: result.education || "Not specified",
        match: determineMatchCategory(adjustedMatchScore)
      };
    });
    
    // Sort by match score
    formattedCandidates.sort((a, b) => b.matchScore - a.matchScore);
    
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
                onResultsFound={(results, query) => handleCandidateResults(results, query)} 
              />
              
              {candidateResults.length > 0 && (
                <Card>
                  <CardContent className="pt-6">
                    <CandidateList candidates={candidateResults} searchQuery={searchQuery} />
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
