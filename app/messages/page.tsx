"use client";
import { useState } from "react";
import { MESSAGES, type Message } from "../../lib/mockData";
import { Mail, Inbox, Search, X, Star } from "lucide-react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = messages.filter(
    (m) =>
      m.from.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase())
  );

  const selected = messages.find((m) => m.id === selectedId);
  const unreadCount = messages.filter((m) => !m.read).length;

  const open = (msg: Message) => {
    setSelectedId(msg.id);
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
    );
  };

  const close = () => setSelectedId(null);

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs text-gray-600 mb-1 font-space-mono tracking-widest uppercase">Account / Messages</p>
        <h1 className="text-2xl font-syne font-bold text-white">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          {unreadCount > 0 ? (
            <span>
              <span className="font-space-mono font-bold text-neon">{unreadCount}</span> unread messages
            </span>
          ) : (
            "All messages read"
          )}
        </p>
      </header>

      <div
        className="rounded-[26px] overflow-hidden"
        style={{
          background: "#121216",
          boxShadow: "10px 10px 30px rgba(0,0,0,0.5), inset -6px -6px 12px rgba(0,0,0,0.7), inset 3px 3px 6px rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex h-[600px]">
          {/* Message list */}
          <div
            className={`flex flex-col border-r border-white/[0.04] transition-all ${
              selected ? "hidden md:flex md:w-72 lg:w-80" : "w-full md:w-72 lg:w-80"
            }`}
          >
            {/* Search */}
            <div className="p-4 border-b border-white/[0.04]">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl py-2 pl-8 pr-3 text-sm text-white placeholder-gray-600 focus:outline-none"
                  style={{
                    background: "#0b0b0e",
                    boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -1.5px -1.5px 3px rgba(255,255,255,0.03)",
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-700">
                  <Inbox size={28} />
                  <p className="text-sm">No messages found</p>
                </div>
              ) : (
                filtered.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => open(msg)}
                    className={`w-full text-left px-4 py-4 border-b border-white/[0.03] transition-all hover:bg-white/[0.02] ${
                      selectedId === msg.id ? "bg-white/[0.04]" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        {!msg.read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-neon shrink-0 mt-1" />
                        )}
                        <p className={`text-xs truncate max-w-[150px] ${!msg.read ? "text-white font-semibold" : "text-gray-400"}`}>
                          {msg.from}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-600 font-space-mono shrink-0">{msg.time}</span>
                    </div>
                    <p className={`text-xs mb-1 truncate ${!msg.read ? "text-gray-200 font-medium" : "text-gray-500"}`}>
                      {msg.subject}
                    </p>
                    <p className="text-[11px] text-gray-600 truncate">{msg.preview}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message detail */}
          {selected ? (
            <div className="flex-1 flex flex-col min-w-0">
              {/* Detail header */}
              <div className="px-6 py-4 border-b border-white/[0.04] flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] text-gray-600 font-space-mono mb-1">{selected.time}</p>
                  <h2 className="font-syne font-bold text-white mb-1">{selected.subject}</h2>
                  <p className="text-xs text-gray-400">From: <span className="text-gray-200">{selected.from}</span></p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="text-gray-600 hover:text-amber-400 transition-colors"><Star size={15} /></button>
                  <button className="text-gray-600 hover:text-white transition-colors"><Mail size={15} /></button>
                  <button onClick={close} className="text-gray-600 hover:text-white transition-colors md:hidden">
                    <X size={16} />
                  </button>
                </div>
              </div>
              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "#0e0e11",
                    boxShadow: "inset 4px 4px 8px rgba(0,0,0,0.5), inset -2px -2px 4px rgba(255,255,255,0.03)",
                  }}
                >
                  <p className="text-sm text-gray-300 leading-relaxed">{selected.body}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center">
              <div className="text-center">
                <Inbox size={40} className="text-gray-700 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
