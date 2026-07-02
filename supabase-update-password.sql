-- ============================================================
-- RPC to update student password
-- Run this in the Supabase SQL Editor
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_student_password(
  p_student_id text,
  p_new_password_hash text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_rows_updated int;
BEGIN
  UPDATE public.students
  SET password_hash = p_new_password_hash
  WHERE student_id = p_student_id;

  GET DIAGNOSTICS v_rows_updated = ROW_COUNT;

  IF v_rows_updated = 0 THEN
    RETURN json_build_object('success', false, 'error', 'No student found with that ID');
  END IF;

  RETURN json_build_object('success', true);
END;
$$;
