-- ============================================================
-- Temporary helper to inspect password storage
-- Run this in the Supabase SQL Editor, then the agent will query it
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_temp_function_def(p_name text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_def text;
BEGIN
  SELECT pg_get_functiondef(p.oid) INTO v_def
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE p.proname = p_name AND n.nspname = 'public';
  
  RETURN v_def;
END;
$$;
