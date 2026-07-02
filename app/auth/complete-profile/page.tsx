"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User, Hash, Phone, ChevronDown, GraduationCap, Loader2
} from "lucide-react";
import { isValidStudentId } from "@/lib/auth";

const SEMESTERS = [
  { value: 1, label: "1st" }, { value: 2, label: "2nd" },
  { value: 3, label: "3rd" }, { value: 4, label: "4th" },
  { value: 5, label: "5th" }, { value: 6, label: "6th" },
  { value: 7, label: "7th" }, { value: 8, label: "8th" },
];

const SECTIONS = ["A", "B", "C", "D", "E", "F"];

const DEPARTMENTS = [
  { code: "CSE", name: "Computer Science & Engineering", enabled: true },
  { code: "EEE", name: "Electrical & Electronic Eng.", enabled: false },
  { code: "LLB", name: "Bachelor of Laws", enabled: false },
  { code: "Economics", name: "Department of Economics", enabled: false },
];

function CompleteProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledName = searchParams.get("name") || "";
  const prefilledEmail = searchParams.get("email") || "";

  const [name, setName] = useState(prefilledName);
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [semester, setSemester] = useState(1);
  const [section, setSection] = useState("A");
  const [department, setDepartment] = useState("CSE");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSemOpen, setIsSemOpen] = useState(false);
  const [isSecOpen, setIsSecOpen] = useState(false);
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [studentIdError, setStudentIdError] = useState("");

  const handleStudentIdChange = (val: string) => {
    setStudentId(val);
    if (val.trim() === "") {
      setStudentIdError("");
    } else if (!/^\d*$/.test(val.trim())) {
      setStudentIdError("Invalid");
    } else if (val.trim().length > 0 && val.trim().length !== 16) {
      setStudentIdError(val.trim().length < 16 ? "" : "Invalid");
    } else if (val.trim().length === 16) {
      setStudentIdError(isValidStudentId(val.trim()) ? "" : "Invalid");
    } else {
      setStudentIdError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Name is required."); return; }
    if (!studentId.trim() || !isValidStudentId(studentId.trim())) {
      setStudentIdError("Invalid"); return;
    }
    setStudentIdError("");

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/complete-google-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentId.trim(),
          name: name.trim(),
          phone: phone.trim() || undefined,
          semester,
          section,
          department,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create account.");
        setIsLoading(false);
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const inputStyle = {
    background: "#0b0b0e",
    boxShadow: "inset 4px 4px 8px rgba(0,0,0,0.65), inset -2px -2px 4px rgba(255,255,255,0.03)",
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#09090b]">
      <div
        className="w-full max-w-lg rounded-[36px] p-8"
        style={{
          background: "#121216",
          border: "1px solid rgba(255, 255, 255, 0.02)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset -8px -8px 16px rgba(0, 0, 0, 0.8), inset 4px 4px 8px rgba(255, 255, 255, 0.03)",
        }}
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(163,230,53,0.1)", border: "1px solid rgba(163,230,53,0.15)" }}>
            <svg className="w-7 h-7 text-neon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.48 1 0 6.48 0 13s5.48 12 12.24 12c7.06 0 11.758-4.967 11.758-11.96 0-.807-.087-1.427-.193-1.755H12.24z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-syne font-bold text-white tracking-tight">Complete Your Profile</h1>
          <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">
            Signed in with <span className="text-neon font-semibold">{prefilledEmail}</span>. Fill in your PUC details to finish.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-5 rounded-xl text-xs bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-400 tracking-wide">Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-600 pointer-events-none">
                <User size={15} />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-neon/30 border border-white/[0.02]"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-400 tracking-wide flex items-center gap-1.5">
              Student ID
              {studentIdError && (
                <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                  {studentIdError}
                </span>
              )}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-600 pointer-events-none">
                <Hash size={15} />
              </span>
              <input
                type="text"
                maxLength={16}
                value={studentId}
                onChange={(e) => handleStudentIdChange(e.target.value)}
                placeholder="16-digit Student ID"
                className={`w-full rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 border ${
                  studentIdError ? "border-red-500/40 focus:ring-red-500/30" : "border-white/[0.02] focus:ring-neon/30"
                }`}
                style={inputStyle}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-400 tracking-wide">
              Phone <span className="text-[10px] text-gray-600 font-medium">(Optional)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-600 pointer-events-none">
                <Phone size={15} />
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 017xxxxxxxx"
                className="w-full rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-neon/30 border border-white/[0.02]"
                style={inputStyle}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 relative">
              <label className="block text-xs font-semibold text-gray-400 tracking-wide">Semester</label>
              <button
                type="button"
                onClick={() => { setIsSemOpen(!isSemOpen); setIsSecOpen(false); setIsDeptOpen(false); }}
                className="w-full rounded-2xl py-2.5 px-3 flex items-center justify-between text-xs text-white border border-white/[0.02]"
                style={inputStyle}
              >
                <span>{SEMESTERS.find(s => s.value === semester)?.label}</span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform ${isSemOpen ? "rotate-180" : ""}`} />
              </button>
              {isSemOpen && (
                <div className="absolute left-0 right-0 mt-1 rounded-xl border border-white/5 py-1 z-30 shadow-2xl max-h-48 overflow-y-auto"
                  style={{ background: "#18181b" }}>
                  {SEMESTERS.map((s) => (
                    <button key={s.value} type="button"
                      onClick={() => { setSemester(s.value); setIsSemOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                        semester === s.value ? "text-neon bg-white/[0.04] font-semibold" : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                      }`}>
                      {s.label} Semester
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1 relative">
              <label className="block text-xs font-semibold text-gray-400 tracking-wide">Section</label>
              <button
                type="button"
                onClick={() => { setIsSecOpen(!isSecOpen); setIsSemOpen(false); setIsDeptOpen(false); }}
                className="w-full rounded-2xl py-2.5 px-3 flex items-center justify-between text-xs text-white border border-white/[0.02]"
                style={inputStyle}
              >
                <span>Sec {section}</span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform ${isSecOpen ? "rotate-180" : ""}`} />
              </button>
              {isSecOpen && (
                <div className="absolute left-0 right-0 mt-1 rounded-xl border border-white/5 py-1 z-30 shadow-2xl"
                  style={{ background: "#18181b" }}>
                  {SECTIONS.map((sec) => (
                    <button key={sec} type="button"
                      onClick={() => { setSection(sec); setIsSecOpen(false); }}
                      className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                        section === sec ? "text-neon bg-white/[0.04] font-semibold" : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                      }`}>
                      Section {sec}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-400 tracking-wide">
                Batch <span className="text-[9px] text-neon font-bold">(Auto)</span>
              </label>
              <div className="w-full rounded-2xl py-2.5 px-3 text-xs text-neon/80 font-bold font-space-mono text-center border border-neon/10"
                style={{ background: "rgba(163, 230, 53, 0.03)", boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.4)" }}>
                {50 - semester}th
              </div>
            </div>
          </div>

          <div className="space-y-1 relative">
            <label className="block text-xs font-semibold text-gray-400 tracking-wide">Department</label>
            <button
              type="button"
              onClick={() => { setIsDeptOpen(!isDeptOpen); setIsSemOpen(false); setIsSecOpen(false); }}
              className="w-full rounded-2xl py-2.5 px-3.5 flex items-center justify-between text-xs text-white border border-white/[0.02]"
              style={inputStyle}
            >
              <span className="flex items-center gap-2">
                <GraduationCap size={15} className="text-neon" />
                {DEPARTMENTS.find(d => d.code === department)?.name}
              </span>
              <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDeptOpen ? "rotate-180" : ""}`} />
            </button>
            {isDeptOpen && (
              <div className="absolute left-0 right-0 mt-1 rounded-xl border border-white/5 py-1 z-30 shadow-2xl"
                style={{ background: "#18181b" }}>
                {DEPARTMENTS.map((d) => (
                  <button key={d.code} type="button" disabled={!d.enabled}
                    onClick={() => { if (d.enabled) { setDepartment(d.code); setIsDeptOpen(false); } }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                      !d.enabled ? "text-gray-600 cursor-not-allowed opacity-50"
                      : department === d.code ? "text-neon bg-white/[0.04] font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                    }`}>
                    <span>{d.name} ({d.code})</span>
                    {!d.enabled && (
                      <span className="text-[9px] uppercase tracking-wider font-space-mono bg-white/[0.02] text-gray-500 px-1.5 py-0.5 rounded border border-white/5">Locked</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-4 rounded-[18px] text-xs font-space-mono font-bold uppercase tracking-wider text-space-950 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:translate-y-[1px] flex items-center justify-center gap-2"
            style={{
              background: "#a3e635",
              boxShadow: "3px 3px 8px rgba(163,230,53,0.2), inset -2px -2px 4px rgba(0,0,0,0.35), inset 1.5px 1.5px 3px rgba(255,255,255,0.45)",
            }}
          >
            {isLoading ? <><Loader2 size={14} className="animate-spin" /> Setting up...</> : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    }>
      <CompleteProfileForm />
    </Suspense>
  );
}
