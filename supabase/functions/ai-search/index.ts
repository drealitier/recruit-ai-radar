
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, table } = await req.json();

    if (!query || !table) {
      return new Response(
        JSON.stringify({ error: "Query and table parameters are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the table structure to help OpenAI understand the schema
    const { data: tableInfo, error: tableError } = await supabase
      .rpc("get_table_structure", { table_name: table });

    if (tableError) {
      console.error("Error getting table structure:", tableError);
      return new Response(
        JSON.stringify({ error: "Failed to retrieve table structure" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format the table structure for the prompt
    const tableStructure = Array.isArray(tableInfo) 
      ? tableInfo.map(col => `${col.column_name} (${col.data_type})`).join(", ")
      : "Could not retrieve table structure";

    // Enhanced prompt to better handle skill-based filtering
    const systemPrompt = `You are a SQL expert that converts natural language queries into PostgreSQL statements.
    The table structure is as follows:
    Table name: ${table}
    Columns: ${tableStructure}
    
    If the user is searching for candidates with specific skills:
    - For frontend skills, include skills like 'React', 'Angular', 'Vue', 'CSS', 'HTML', 'JavaScript', 'TypeScript', 'Redux', 'Tailwind', 'UI/UX', 'SCSS', 'Frontend'
    - For backend skills, include skills like 'Node.js', 'Express', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Django', 'Flask', 'Spring', 'ASP.NET', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Backend'
    - For DevOps skills, include 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Jenkins', 'Terraform', 'Ansible'
    - For mobile skills, include 'React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS', 'Android'`;

    // Ask OpenAI to generate a SQL query based on the natural language query
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `Convert this question to a SQL query: "${query}". 
            Return ONLY the SQL query without any explanations or markdown formatting. 
            Make sure to use proper PostgreSQL syntax and refer to the table as "public.${table}".
            If the query is about specific skills, use the ANY operator with arrays, for example:
            SELECT * FROM public.${table} WHERE 'React' = ANY(skills) OR 'JavaScript' = ANY(skills);`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    const openaiData = await openaiResponse.json();
    const sqlQuery = openaiData.choices[0].message.content.trim();
    
    console.log("Generated SQL query:", sqlQuery);

    // Execute the generated SQL query
    const { data: queryResults, error: queryError } = await supabase
      .rpc("execute_dynamic_query", { dynamic_query: sqlQuery });

    if (queryError) {
      console.error("Error executing query:", queryError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to execute the query", 
          sqlQuery,
          details: queryError.message 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        results: queryResults, 
        sqlQuery,
        originalQuery: query 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in AI search function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
