"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Menu,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useSession } from "../lib/useSession";
import { clearSession } from "../lib/auth";

const PRIMARY_NAV = [
  { href: "/",          label: "Overview",  icon: LayoutDashboard },
  { href: "/courses",   label: "Courses",   icon: BookOpen        },
  { href: "/grades",    label: "Grades",    icon: BarChart3       },
  { href: "/schedule",  label: "Schedule",  icon: CalendarDays    },
];

const SECONDARY_NAV = [
  { href: "/messages",  label: "Messages",  icon: Mail            },
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

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const NavItem = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => {
    const active = isActive(href);
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl font-medium text-sm transition-all duration-200 ${
          active
            ? "bg-neon text-space-950 shadow-[4px_4px_12px_rgba(163,230,53,0.25),inset_-3px_-3px_6px_rgba(0,0,0,0.35),inset_2px_2px_4px_rgba(255,255,255,0.5)] font-semibold"
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
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-40 flex flex-col
          border-r border-white/[0.04]
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ background: "#0e0e11" }}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: "#a3e635",
                boxShadow: "2px 2px 6px rgba(0,0,0,0.4), inset -2px -2px 4px rgba(0,0,0,0.25), inset 1.5px 1.5px 3px rgba(255,255,255,0.5)",
              }}
            >
              <User size={16} className="text-space-950" />
            </div>
            <span className="font-syne font-bold text-base text-white tracking-tight">
              PUC Portal
            </span>
          </div>
          {/* Mobile close */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 mb-6">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-2xl py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none transition-all focus:ring-1 focus:ring-neon/30"
              style={{
                background: "#0b0b0e",
                boxShadow: "inset 4px 4px 8px rgba(0,0,0,0.65), inset -2px -2px 4px rgba(255,255,255,0.03)",
              }}
            />
          </div>
        </div>

        {/* Primary nav */}
        <div className="px-3 flex-1 overflow-y-auto">
          <p className="text-[10px] font-semibold text-gray-600 mb-2.5 px-3 uppercase tracking-widest">
            Dashboards
          </p>
          <nav className="space-y-1 mb-8">
            {PRIMARY_NAV.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </nav>

          <p className="text-[10px] font-semibold text-gray-600 mb-2.5 px-3 uppercase tracking-widest">
            Account
          </p>
          <nav className="space-y-1">
            {SECONDARY_NAV.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </nav>
        </div>

        {/* User card */}
        <div className="px-4 py-5 mt-auto">
          <div
            className="flex items-center justify-between p-3 rounded-2xl gap-2"
            style={{
              background: "#1c1c22",
              boxShadow: "4px 4px 10px rgba(0,0,0,0.4), inset -3px -3px 6px rgba(0,0,0,0.5), inset 1.5px 1.5px 3px rgba(255,255,255,0.04)",
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "#0b0b0e",
                  boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.5), inset -1px -1px 2px rgba(255,255,255,0.03)",
                }}
              >
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
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 shrink-0 cursor-pointer"
                style={{
                  boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.02)",
                }}
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
