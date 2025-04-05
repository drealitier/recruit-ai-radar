
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/auth/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-4 px-6 bg-white border-b">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-sm-blue-600">SmartMatch</h1>
          <Button variant="outline">Contact Us</Button>
        </div>
      </header>

      {/* Hero section */}
      <section className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col justify-center p-10 bg-sm-gray-50">
          <div className="max-w-xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-sm-gray-900">
              AI-Powered Recruitment
            </h2>
            <p className="text-xl mb-8 text-sm-gray-600">
              SmartMatch helps recruiters quickly identify the best candidates
              using advanced AI to analyze resumes and job descriptions.
            </p>
            <ul className="space-y-2 mb-8">
              {[
                "Automatic candidate categorization",
                "AI-generated profile summaries",
                "Smart resume analysis",
                "Save hours in the hiring process"
              ].map((item, i) => (
                <li key={i} className="flex items-center text-sm-gray-700">
                  <span className="mr-2 text-sm-blue-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-10 bg-white">
          <LoginForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 bg-sm-gray-100 text-center text-sm-gray-600 text-sm">
        <div className="container mx-auto">
          <p>&copy; 2025 SmartMatch AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
