export function isValidStudentId(id: string): boolean {
  return /^\d{16}$/.test(id.trim());
}

export async function register(params: {
  studentId: string;
  name: string;
  phone?: string;
  semester: number;
  section: string;
  department: string;
  password: string;
}): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 409) {
        return { success: false, error: data.error || "An account with this Student ID already exists." };
      }
      return { success: false, error: data.error || "Registration failed." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function login(params: {
  studentId: string;
  password: string;
}): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || "Incorrect Student ID or password." };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
}

export async function getSession() {
  try {
    const res = await fetch("/api/auth/session");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function googleLogin(mode?: string) {
  const { createClient } = await import("./supabase");
  const supabase = createClient();
  const redirectTo = mode
    ? `${window.location.origin}/auth/google/callback?mode=${mode}`
    : `${window.location.origin}/auth/google/callback`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) {
    console.error("Google OAuth error:", error.message);
    throw error;
  }
}

export async function updateProfile(params: {
  name: string;
  phone?: string;
  linkedGmail?: string;
  semester?: number;
  section?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/auth/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error };
    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong." };
  }
}

