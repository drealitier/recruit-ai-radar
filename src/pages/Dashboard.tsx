
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import JobDescriptionCard from "@/components/dashboard/JobDescriptionCard";
import ResumeUpload from "@/components/dashboard/ResumeUpload";
import CandidateList from "@/components/candidates/CandidateList";
import { Candidate } from "@/components/candidates/CandidateCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Sample data
const sampleCandidates: Candidate[] = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    matchScore: 92,
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
    experience: "5 years frontend development",
    education: "BS Computer Science, Stanford",
    match: "good"
  },
  {
    id: "2",
    name: "Sam Rodriguez",
    email: "sam.r@example.com",
    matchScore: 85,
    skills: ["React", "JavaScript", "CSS", "REST API", "Git"],
    experience: "3 years web development",
    education: "MS Information Systems, UC Berkeley",
    match: "good"
  },
  {
    id: "3",
    name: "Taylor Williams",
    email: "taylor.w@example.com",
    matchScore: 78,
    skills: ["Angular", "TypeScript", "Node.js", "MongoDB"],
    experience: "4 years full-stack development",
    education: "BS Software Engineering, MIT",
    match: "maybe"
  },
  {
    id: "4",
    name: "Jordan Lee",
    email: "j.lee@example.com",
    matchScore: 65,
    skills: ["JavaScript", "HTML", "CSS", "jQuery"],
    experience: "2 years frontend development",
    education: "BA Design, RISD",
    match: "maybe"
  },
  {
    id: "5",
    name: "Casey Brown",
    email: "casey.b@example.com",
    matchScore: 45,
    skills: ["Python", "Django", "SQL", "Docker"],
    experience: "3 years backend development",
    education: "MS Computer Engineering, Georgia Tech",
    match: "bad"
  }
];

const Dashboard = () => {
  const [jobSaved, setJobSaved] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showCandidates, setShowCandidates] = useState(false);
  const { toast } = useToast();

  const handleJobSaved = (job: { title: string; description: string }) => {
    setJobSaved(true);
    // In a real app, this would save the job to state or backend
    console.log("Job saved:", job);
  };

  const handleResumeUpload = (file: File) => {
    // In a real app, this would upload the file to a server for processing
    console.log("Resume uploaded:", file.name);
    
    // Simulate response from backend with AI-processed candidates
    setTimeout(() => {
      // Add some randomization to the sample data to simulate different uploads
      const shuffled = [...sampleCandidates].sort(() => 0.5 - Math.random());
      const selectedCandidates = shuffled.slice(0, Math.floor(Math.random() * 3) + 2);
      
      setCandidates([...selectedCandidates]);
      setShowCandidates(true);
      
      toast({
        title: "Resumes processed",
        description: `${selectedCandidates.length} candidates analyzed and categorized.`,
      });
    }, 2000);
  };

  const handleLoadSampleData = () => {
    setCandidates(sampleCandidates);
    setShowCandidates(true);
    
    toast({
      title: "Sample data loaded",
      description: "Sample candidates have been loaded for demonstration.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {!showCandidates && (
            <Button onClick={handleLoadSampleData}>
              Load Sample Data
            </Button>
          )}
        </div>
        
        {!showCandidates ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <JobDescriptionCard onJobSaved={handleJobSaved} />
              <ResumeUpload 
                onResumeUpload={handleResumeUpload} 
                isJobSelected={jobSaved} 
              />
            </div>
            <div className="text-center py-10 text-sm-gray-500">
              {jobSaved ? (
                "Upload resumes to see AI-powered candidate matches"
              ) : (
                "Start by creating a job description"
              )}
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-2">Senior Frontend Developer</h2>
              <p className="text-sm-gray-600 text-sm">
                {candidates.length} candidates analyzed • 
                {candidates.filter(c => c.match === "good").length} good matches •
                Last updated: Just now
              </p>
              <div className="flex mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCandidates(false)}
                >
                  Back to Job Description
                </Button>
              </div>
            </div>
            
            <CandidateList candidates={candidates} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
