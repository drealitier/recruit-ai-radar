
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ResumeUploadProps {
  onResumeUpload?: (file: File) => void;
  isJobSelected: boolean;
}

const ResumeUpload = ({ onResumeUpload, isJobSelected }: ResumeUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (!isJobSelected) {
      toast({
        title: "No job selected",
        description: "Please select or create a job description first",
        variant: "destructive",
      });
      return;
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (!isJobSelected) {
      toast({
        title: "No job selected",
        description: "Please select or create a job description first",
        variant: "destructive",
      });
      return;
    }
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Check if the file is a PDF or DOCX
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onResumeUpload) {
        onResumeUpload(selectedFile);
      }
      
      toast({
        title: "Resume uploaded",
        description: "Your resume is being processed.",
      });
      
      setSelectedFile(null);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Resumes</CardTitle>
        <CardDescription>
          Drag and drop or select resume files to analyze
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? "border-sm-blue-500 bg-sm-blue-50" : "border-sm-gray-300"
          } ${isJobSelected ? "" : "opacity-50 cursor-not-allowed"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center">
            <svg
              className="w-12 h-12 text-sm-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v9a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mb-2 text-sm-gray-500">
              {selectedFile
                ? `Selected: ${selectedFile.name}`
                : "Drag & drop resume files, or click to select"}
            </p>
            <p className="text-xs text-sm-gray-400">PDF or DOCX up to 10MB</p>
            
            <input
              type="file"
              id="resume-upload"
              className="hidden"
              onChange={handleChange}
              accept=".pdf,.docx"
              disabled={!isJobSelected}
            />
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => !isJobSelected ? null : document.getElementById("resume-upload")?.click()}
              disabled={!isJobSelected}
            >
              Select File
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading || !isJobSelected}
          className="w-full"
        >
          {isUploading ? "Uploading..." : "Upload Resume"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResumeUpload;
