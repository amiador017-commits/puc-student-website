"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactLenis } from "lenis/react";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  CalendarDays,
  Settings,
  Mail,
  HelpCircle,
  User,
  Search,
  X,
  LogOut,
} from "lucide-react";
import { useSession } from "../lib/useSession";
import { createClient } from "../lib/supabase";

const PRIMARY_NAV = [
  { href: "/",          label: "Overview",  icon: LayoutDashboard },
  { href: "/courses",   label: "Courses",   icon: BookOpen        },
  { href: "/grades",    label: "Grades",    icon: BarChart3       },
  { href: "/schedule",  label: "Schedule",  icon: CalendarDays    },
];

const SECONDARY_NAV = [
  { href: "/contact-admin", label: "Contact Admin", icon: Mail            },
  { href: "/settings",  label: "Settings",  icon: Settings        },
  { href: "/help",      label: "Help",      icon: HelpCircle      },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useSession();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
      }
    } catch {}
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const NavItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-clay font-medium text-sm transition-all duration-200 ${
          active
            ? "bg-neon text-space-950 shadow-clay-neon font-semibold"
            : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
        }`}
      >
        <Icon size={17} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-40 flex flex-col
          border-r border-white/[0.04]
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ background: "#0e0e11" }}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-clay flex items-center justify-center shadow-clay-flat" style={{ background: "#a3e635" }}>
              <User size={16} className="text-space-950" />
            </div>
            <span className="font-syne font-bold text-base text-white tracking-tight">PUC Portal</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 mb-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              aria-label="Search navigation"
              placeholder="Search..."
              className="clay-input w-full py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none"
            />
          </div>
        </div>

        <ReactLenis
          options={{ lerp: 0.08, duration: 1.2 }}
          className="px-3 flex-1 min-h-0 overflow-y-auto"
        >
          <div>
            <p className="section-label">Dashboards</p>
            <nav className="space-y-1 mb-8">
              {PRIMARY_NAV.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </nav>
            <p className="section-label">Account</p>
            <nav className="space-y-1">
              {SECONDARY_NAV.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </nav>
          </div>
        </ReactLenis>

        <div className="px-4 py-5 mt-auto">
          <div className="flex items-center justify-between p-3 rounded-clay-lg gap-2 shadow-clay-flat" style={{ background: "#1c1c22" }}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-clay flex items-center justify-center shrink-0 shadow-clay-inset" style={{ background: "#0b0b0e" }}>
                <User size={15} className="text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate font-syne">
                  {user ? user.name : "Loading..."}
                </p>
                <p className="text-[10px] text-gray-500 font-space-mono truncate">
                  {user ? `ID: ${user.studentId}` : "..."}
                </p>
              </div>
            </div>

            {user && (
              <button
                onClick={handleLogout}
                title="Log Out"
                className="w-8 h-8 rounded-clay flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 shrink-0 cursor-pointer"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
