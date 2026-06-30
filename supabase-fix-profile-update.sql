-- ============================================================
-- FIX: Profile Update (Semester & Section not saving)
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Drop old version(s) of update_student_profile (any signature)
DROP FUNCTION IF EXISTS public.update_student_profile(text, text, text, text);
DROP FUNCTION IF EXISTS public.update_student_profile(text, text, text, text, int, text);

-- 2. Create/replace with correct version that updates semester & section
CREATE OR REPLACE FUNCTION public.update_student_profile(
  p_student_id text,
  p_name       text    DEFAULT NULL,
  p_phone      text    DEFAULT NULL,
  p_linked_gmail text  DEFAULT NULL,
  p_semester   int     DEFAULT NULL,
  p_section    text    DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET
    name         = COALESCE(p_name, name),
    phone        = COALESCE(p_phone, phone),
    linked_gmail = p_linked_gmail,
    semester     = COALESCE(p_semester, semester),
    section      = COALESCE(p_section, section),
    batch        = CASE WHEN p_semester IS NOT NULL THEN 50 - p_semester ELSE batch END
  WHERE student_id = p_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create/replace get_student_profile so it returns semester & section
DROP FUNCTION IF EXISTS public.get_student_profile(text);

CREATE OR REPLACE FUNCTION public.get_student_profile(p_student_id text)
RETURNS json AS $$
DECLARE
  v_profile json;
BEGIN
  SELECT json_build_object(
    'studentId',    p.student_id,
    'name',         p.name,
    'phone',        p.phone,
    'semester',     p.semester,
    'section',      p.section,
    'department',   p.department,
    'batch',        p.batch,
    'linkedGmail',  p.linked_gmail
  )
  INTO v_profile
  FROM public.profiles p
  WHERE p.student_id = p_student_id;

  RETURN v_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
