
-- This function executes a dynamic SQL query with security checks
CREATE OR REPLACE FUNCTION public.execute_dynamic_query(dynamic_query TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  result JSONB;
BEGIN
  -- Basic security check to prevent destructive operations
  IF dynamic_query ~* '(DELETE|DROP|TRUNCATE|INSERT|UPDATE|ALTER)' THEN
    RAISE EXCEPTION 'Destructive operations are not allowed in dynamic queries';
  END IF;
  
  -- Execute the query and convert the result to JSON
  EXECUTE 'SELECT COALESCE(jsonb_agg(row_to_json(t)), ''[]''::jsonb) FROM (' || dynamic_query || ') t' INTO result;
  RETURN result;
END;
$$;

-- Grant execute permission to the function for authenticated users
GRANT EXECUTE ON FUNCTION public.execute_dynamic_query TO authenticated;
