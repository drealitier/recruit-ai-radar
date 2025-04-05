
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { signOut, user, profile } = useAuth();
  
  // Generate avatar initials from profile name or email
  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    } else if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'UR';
  };

  return (
    <div className="flex h-screen bg-sm-gray-50">
      {/* Sidebar */}
      <aside 
        className={`bg-sm-blue-600 text-white transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center">
            {isSidebarOpen ? (
              <h1 className="text-xl font-bold">SmartMatch</h1>
            ) : (
              <h1 className="text-xl font-bold">SM</h1>
            )}
          </div>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-sm-blue-700"
              >
                <span className="mr-3">📊</span>
                {isSidebarOpen && "Dashboard"}
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-sm-blue-700"
              >
                <span className="mr-3">📝</span>
                {isSidebarOpen && "Job Descriptions"}
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start text-white hover:bg-sm-blue-700"
              >
                <span className="mr-3">👥</span>
                {isSidebarOpen && "Candidates"}
              </Button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-4 w-full px-4">
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:bg-sm-blue-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <span className="mr-3">{isSidebarOpen ? "◀" : "▶"}</span>
            {isSidebarOpen && "Collapse"}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top nav */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search candidates..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sm-blue-500 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url || ""} alt="User" />
                    <AvatarFallback className="bg-sm-blue-500 text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {profile?.full_name || user?.email || "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
