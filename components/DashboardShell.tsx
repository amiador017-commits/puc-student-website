"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Menu, Bell, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "../lib/supabase";
import { SessionProvider } from "../lib/session-context";
import type { SessionUser } from "../lib/server-session";

export default function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: SessionUser | null;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(!user);
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname?.startsWith("/auth");

  useEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    let active = true;

    async function checkAuth() {
      const { data } = await supabase.auth.getSession();

      let customSession = null;
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) customSession = await res.json();
      } catch {}

      if (!active) return;

      const isAuthenticated = !!data.session || !!customSession;

      if (!isAuthenticated) {
        if (!isAuthPage) router.push("/login");
        else setLoading(false);
      } else {
        if (isAuthPage) router.push("/");
        else setLoading(false);
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;
        if (session && isAuthPage) router.push("/");
        else if (!session && !isAuthPage) router.push("/login");
      }
    );

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [pathname, isAuthPage, router, user]);

  if (isAuthPage && !loading) {
    return <div className="min-h-screen bg-space-950 font-dm-sans">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse"
          style={{
            background: "#a3e635",
            boxShadow: "0 0 20px rgba(163,230,53,0.3)",
          }}
        >
          <span className="font-syne font-black text-xl text-space-950 select-none">
            P
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-sm font-syne font-bold text-white tracking-wide">
            Loading PUC Portal
          </h2>
          <Loader2 className="animate-spin text-neon w-5 h-5" />
        </div>
      </div>
    );
  }

  return (
    <SessionProvider user={user}>
      <div className="min-h-screen bg-space-950">
        <Sidebar
          mobileOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="lg:ml-64 min-h-screen flex flex-col">
          <header
            className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-white/[0.04] sticky top-0 z-20"
            style={{ background: "#0e0e11" }}
          >
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <span className="font-syne font-bold text-white text-sm">
              PUC Portal
            </span>
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Bell size={18} />
            </Link>
          </header>

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
