
-- This function returns the structure of a given table
CREATE OR REPLACE FUNCTION public.get_table_structure(table_name TEXT)
RETURNS TABLE (
  column_name TEXT,
  data_type TEXT,
  is_nullable BOOLEAN
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::TEXT,
    c.data_type::TEXT,
    (c.is_nullable = 'YES')::BOOLEAN
  FROM 
    information_schema.columns c
  WHERE 
    c.table_schema = 'public' 
    AND c.table_name = table_name;
END;
$$;

-- Grant execute permission to the function for authenticated users
GRANT EXECUTE ON FUNCTION public.get_table_structure TO authenticated;
