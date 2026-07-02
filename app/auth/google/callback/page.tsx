"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const supabase = createClient();
    const mode = searchParams.get("mode");

    let active = true;

    async function handleCallback() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        if (active) processSession(session);
        return;
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
        if (!active || !s?.user?.id) return;
        subscription.unsubscribe();
        processSession(s);
      });

      setTimeout(() => {
        if (active) {
          subscription.unsubscribe();
          window.location.href = "/settings?linkError=Google sign-in timed out. Please try again.";
        }
      }, 15000);
    }

    async function processSession(session: import("@supabase/supabase-js").Session) {
      if (mode === "link") {
        const res = await fetch("/api/auth/link-google-account", { method: "POST" });
        if (res.ok) {
          window.location.href = "/settings";
        } else {
          const err = await res.json();
          window.location.href = `/settings?linkError=${encodeURIComponent(err.error || "Linking failed")}`;
        }
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("student_id")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        const res = await fetch("/api/auth/set-custom-session", { method: "POST" });
        if (res.ok) window.location.href = "/";
        return;
      }

      const email = session.user.email || "";
      const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || "";
      router.push(`/auth/complete-profile?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
    }

    handleCallback();

    return () => { active = false; };
  }, [router, searchParams]);

  return null;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={null}>
      <CallbackHandler />
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <p className="text-gray-400 text-sm">Completing Google sign in...</p>
      </div>
    </Suspense>
  );
}
