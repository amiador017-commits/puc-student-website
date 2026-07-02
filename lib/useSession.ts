"use client";
import { useEffect, useState } from "react";
import { createClient } from "./supabase";
import { useSessionContext } from "./session-context";
import type { SessionUser } from "./server-session";

export { type SessionUser };

export function useSession(): SessionUser | null {
  const contextUser = useSessionContext();
  const [user, setUser] = useState<SessionUser | null>(contextUser);

  useEffect(() => {
    // Try loading from custom JWT first (student ID + password auth)
    async function loadFromCustomJwt() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setUser(data);
            return true;
          }
        }
      } catch {
        return false;
      }
      return false;
    }

    async function loadFromSupabase() {
      const supabase = createClient();
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user?.id) return false;

      const { data, error } = await supabase
        .from("profiles")
        .select("student_id, name, phone, semester, section, department, batch, linked_gmail")
        .eq("user_id", sessionData.session.user.id)
        .single();

      if (error || !data) return false;

      setUser({
        studentId: data.student_id,
        name: data.name,
        phone: data.phone ?? undefined,
        semester: data.semester,
        section: data.section,
        department: data.department,
        batch: data.batch,
        linkedGmail: data.linked_gmail ?? undefined,
      });
      return true;
    }

    async function init() {
      const loaded = await loadFromCustomJwt();
      if (!loaded) {
        await loadFromSupabase();
      }
    }

    init();

    // Listen for Supabase auth state changes (Google OAuth)
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.id) {
        loadFromSupabase();
      } else {
        loadFromCustomJwt().then((ok) => {
          if (!ok) setUser(null);
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return user;
}