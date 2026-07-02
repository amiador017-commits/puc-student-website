-- ============================================================
-- Google Auth Integration — RPC for creating profiles for
-- users who sign up via Google OAuth
-- ============================================================

-- Run this in Supabase SQL Editor

CREATE OR REPLACE FUNCTION public.create_google_student_profile(
  p_student_id text,
  p_name text,
  p_semester int,
  p_section text,
  p_department text,
  p_linked_gmail text,
  p_phone text default null
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id uuid;
  v_batch int;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated with Google');
  END IF;

  IF EXISTS (SELECT 1 FROM public.profiles WHERE student_id = p_student_id) THEN
    RETURN json_build_object('success', false, 'error', 'An account with this Student ID already exists.');
  END IF;

  v_batch := 50 - p_semester;

  INSERT INTO public.profiles (student_id, user_id, name, phone, semester, section, department, batch, linked_gmail)
  VALUES (p_student_id, v_user_id, p_name, p_phone, p_semester, p_section, p_department, v_batch, p_linked_gmail);

  RETURN json_build_object('success', true, 'student_id', p_student_id);
END;
$$;

-- ============================================================
-- RPC to check if a profile exists for the current Supabase user
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_profile_for_current_user()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id uuid;
  v_profile json;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  SELECT json_build_object(
    'student_id', p.student_id,
    'name', p.name,
    'phone', p.phone,
    'semester', p.semester,
    'section', p.section,
    'department', p.department,
    'batch', p.batch,
    'linked_gmail', p.linked_gmail
  ) INTO v_profile
  FROM public.profiles p
  WHERE p.user_id = v_user_id;

  RETURN v_profile;
END;
$$;

-- ============================================================
-- RPC to link an existing PUC account to a Google identity
-- Called when an existing PUC user links Google from Settings
-- Uses SECURITY DEFINER to bypass RLS for the user_id update
-- ============================================================

CREATE OR REPLACE FUNCTION public.link_google_account(
  p_student_id text,
  p_linked_gmail text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated with Google');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.profiles
    WHERE linked_gmail = p_linked_gmail
    AND student_id != p_student_id
  ) THEN
    RETURN json_build_object('success', false, 'error', 'This Google account is already linked to another student.');
  END IF;

  UPDATE public.profiles
  SET user_id = v_user_id, linked_gmail = p_linked_gmail
  WHERE student_id = p_student_id;

  RETURN json_build_object('success', true);
END;
$$;
