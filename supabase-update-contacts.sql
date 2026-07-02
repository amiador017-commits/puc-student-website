-- ============================================================
-- Run this in the Supabase SQL Editor to update contact details
-- ============================================================

-- Update Admin details
UPDATE public.admins
SET 
  name = 'Anurag Barua Ador',
  role = 'B.Sc. in CSE ( PUC )',
  phone = '+880 1568-031212',
  whatsapp_url = 'https://wa.me/8801568031212'
WHERE id = 1;

-- Update CR details for 2nd Semester
UPDATE public.class_reps
SET 
  name = 'Avijit Chakraborty',
  phone = '+880 1816-360078',
  whatsapp_url = 'https://wa.me/8801816360078'
WHERE semester = 2;
