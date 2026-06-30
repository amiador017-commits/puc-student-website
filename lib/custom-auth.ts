import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { createClient } from "@supabase/supabase-js";

const SALT_ROUNDS = 10;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(
  studentId: string
): Promise<string> {
  return new SignJWT({ studentId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken<T>(
  token: string
): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as T;
  } catch {
    return null;
  }
}

export async function signupStudent(params: {
  studentId: string;
  name: string;
  phone?: string;
  semester: number;
  section: string;
  department: string;
  password: string;
}) {
  const supabase = createServerClient();

  const hashedPassword = await hashPassword(params.password);
  const batch = 50 - params.semester;

  const { data, error } = await supabase.rpc("create_student_account", {
    p_student_id: params.studentId,
    p_name: params.name,
    p_phone: params.phone ?? null,
    p_semester: params.semester,
    p_section: params.section,
    p_department: params.department,
    p_batch: batch,
    p_password_hash: hashedPassword,
  });

  if (error) {
    if (error.message?.includes("already exists")) {
      return { success: false as const, error: "An account with this Student ID already exists." };
    }
    return { success: false as const, error: error.message };
  }

  const result = data as { success: boolean; error?: string };
  if (!result.success) {
    return { success: false as const, error: result.error || "Registration failed." };
  }

  return { success: true as const };
}

export async function loginStudent(
  studentId: string,
  password: string
): Promise<{ success: true; studentId: string } | { success: false; error: string }> {
  const supabase = createServerClient();

  const { data: hash, error } = await supabase.rpc("get_student_password_hash", {
    p_student_id: studentId,
  });

  if (error || !hash) {
    return { success: false, error: "Incorrect Student ID or password." };
  }

  const valid = await verifyPassword(password, hash);
  if (!valid) {
    return { success: false, error: "Incorrect Student ID or password." };
  }

  return { success: true, studentId };
}

export async function getStudentProfile(studentId: string) {
  const supabase = createServerClient();

  const { data, error } = await supabase.rpc("get_student_profile", {
    p_student_id: studentId,
  });

  if (error || !data) return null;
  return data as {
    studentId: string;
    name: string;
    phone?: string;
    semester: number;
    section: string;
    department: string;
    batch: number;
    linkedGmail?: string;
  };
}