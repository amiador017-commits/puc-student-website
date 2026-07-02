-- ============================================================
-- RPC to update student password
-- Run this in the Supabase SQL Editor
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_student_password(
  p_student_id text,
  p_new_password_hash text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.students
  SET password_hash = p_new_password_hash
  WHERE student_id = p_student_id;
END;
$$;
