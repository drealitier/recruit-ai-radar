
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AISearchProps {
  defaultTable?: string;
  onResultsFound?: (results: any[], query: string) => void;
}

const AISearch = ({ defaultTable = "candidates", onResultsFound }: AISearchProps) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [sqlQuery, setSqlQuery] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Empty search",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setResults([]);
    setSqlQuery("");

    try {
      const { data, error } = await supabase.functions.invoke("ai-search", {
        body: { query, table: defaultTable },
      });

      if (error) throw error;

      if (data.results && Array.isArray(data.results)) {
        setResults(data.results);
        setSqlQuery(data.sqlQuery || "");
        
        if (onResultsFound) {
          onResultsFound(data.results, query);
        }

        toast({
          title: "Search complete",
          description: `Found ${data.results.length} results`,
        });
      }
    } catch (error) {
      console.error("Error during AI search:", error);
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Failed to perform the search",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Search</CardTitle>
          <CardDescription>
            Search the {defaultTable} database using natural language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-2">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`e.g. "Find candidates with React skills" or "Show me frontend developers"`}
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isSearching}
              />
            </div>
            <Button type="submit" disabled={isSearching || !query.trim()}>
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </Button>
          </form>
        </CardContent>
        {sqlQuery && (
          <CardFooter className="flex flex-col items-start">
            <div className="text-sm text-muted-foreground">Generated query:</div>
            <div className="mt-1 w-full rounded-md bg-slate-950 p-2">
              <pre className="text-xs text-slate-50">{sqlQuery}</pre>
            </div>
          </CardFooter>
        )}
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Search Results
              <Badge variant="outline">{results.length} found</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-xs">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AISearch;
