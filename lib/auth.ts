// ─── Auth Storage Layer ────────────────────────────────────────────────────
// Uses localStorage for client-side persistence.
// One account per 16-digit Student ID — enforced at registration.

export interface StoredUser {
  studentId: string;
  name: string;
  phone?: string;
  semester: number;
  section: string;
  department: string;
  batch: number;
  passwordHash: string; // simple Base64 encoding (not real hashing — demo only)
  createdAt: string;
}

const USERS_KEY = "puc_users";
const SESSION_KEY = "puc_session";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Very lightweight obfuscation for demo purposes */
function encodePassword(password: string): string {
  return btoa(password);
}

function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── Validation ────────────────────────────────────────────────────────────────

/**
 * Returns true when the student ID is exactly 16 numeric digits.
 */
export function isValidStudentId(id: string): boolean {
  return /^\d{16}$/.test(id.trim());
}

// ── Registration ──────────────────────────────────────────────────────────────

export type RegisterResult =
  | { success: true; user: StoredUser }
  | { success: false; error: string };

export function register(params: {
  studentId: string;
  name: string;
  phone?: string;
  semester: number;
  section: string;
  department: string;
  password: string;
}): RegisterResult {
  const { studentId, name, phone, semester, section, department, password } =
    params;

  const trimmedId = studentId.trim();

  // 1. Validate Student ID format (16 digits)
  if (!isValidStudentId(trimmedId)) {
    return { success: false, error: "Invalid" };
  }

  const users = getUsers();

  // 2. Check for duplicate Student ID
  if (users.some((u) => u.studentId === trimmedId)) {
    return {
      success: false,
      error: "An account with this Student ID already exists.",
    };
  }

  // 3. Create and persist new user
  const newUser: StoredUser = {
    studentId: trimmedId,
    name: name.trim(),
    phone: phone?.trim() || undefined,
    semester,
    section,
    department,
    batch: 50 - semester,
    passwordHash: encodePassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, user: newUser };
}

// ── Login ─────────────────────────────────────────────────────────────────────

export type LoginResult =
  | { success: true; user: StoredUser }
  | { success: false; error: string };

export function login(params: {
  studentId: string;
  password: string;
}): LoginResult {
  const trimmedId = params.studentId.trim();

  // 1. Validate format first
  if (!isValidStudentId(trimmedId)) {
    return { success: false, error: "Invalid" };
  }

  const users = getUsers();

  // 2. Find user
  const user = users.find((u) => u.studentId === trimmedId);
  if (!user) {
    return { success: false, error: "No account found with this Student ID." };
  }

  // 3. Check password
  if (!verifyPassword(params.password, user.passwordHash)) {
    return { success: false, error: "Incorrect password." };
  }

  return { success: true, user };
}

// ── Session ───────────────────────────────────────────────────────────────────

export function setSession(user: StoredUser): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
