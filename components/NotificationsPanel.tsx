"use client";
import { useState } from "react";
import { X, Bell, BookOpen, Award, Megaphone, MessageSquare } from "lucide-react";
import { NOTIFICATIONS, type Notification } from "../lib/mockData";

const TYPE_CONFIG: Record<Notification["type"], { icon: React.ElementType; color: string; bg: string }> = {
  assignment:   { icon: BookOpen,      color: "text-neon",    bg: "bg-neon/15 border-neon/20"        },
  grade:        { icon: Award,         color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" },
  announcement: { icon: Megaphone,     color: "text-sky-400",  bg: "bg-sky-400/10 border-sky-400/20"    },
  message:      { icon: MessageSquare, color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/20" },
};

export default function NotificationsPanel() {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = NOTIFICATIONS.filter((n) => !dismissed.has(n.id));

  const dismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="text-sm font-syne font-bold text-white">Notifications</h3>
        <div className="flex items-center gap-2">
          {visible.length > 0 && (
            <span className="text-[10px] font-space-mono text-neon bg-neon/10 px-2 py-0.5 rounded-full border border-neon/20">
              {visible.length}
            </span>
          )}
          {visible.length > 0 && (
            <button
              onClick={() => setDismissed(new Set(NOTIFICATIONS.map((n) => n.id)))}
              className="text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-20 flex-1 flex flex-col justify-center">
          <Bell size={24} className="text-gray-700 mx-auto mb-2" />
          <p className="text-xs text-gray-600">You&apos;re all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {visible.map((n) => {
            const cfg = TYPE_CONFIG[n.type];
            const Icon = cfg.icon;
            return (
              <div
                key={n.id}
                className="flex gap-3 group p-3 rounded-2xl transition-colors hover:bg-white/[0.02]"
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${cfg.bg}`}
                  style={{ boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.15)" }}
                >
                  <Icon size={12} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-white mb-0.5">{n.title}</p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{n.body}</p>
                  <p className="text-[10px] text-gray-600 mt-1.5 font-space-mono">{n.time}</p>
                </div>
                <button
                  onClick={() => dismiss(n.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 text-gray-600 hover:text-gray-400 mt-0.5"
                  aria-label="Dismiss notification"
                >
                  <X size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
