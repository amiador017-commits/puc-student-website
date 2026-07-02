"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  User, 
  Lock, 
  Check, 
  Phone, 
  ChevronDown, 
  Hash, 
  GraduationCap
} from "lucide-react";
import Link from "next/link";
import { register, login, isValidStudentId, googleLogin } from "../lib/auth";

interface AuthFormProps {
  initialMode: "login" | "signup";
}

const SEMESTERS = [
  { value: 1, label: "1st Semester" },
  { value: 2, label: "2nd Semester" },
  { value: 3, label: "3rd Semester" },
  { value: 4, label: "4th Semester" },
  { value: 5, label: "5th Semester" },
  { value: 6, label: "6th Semester" },
  { value: 7, label: "7th Semester" },
  { value: 8, label: "8th Semester" },
];

const SECTIONS = ["A", "B", "C", "D", "E", "F"];

const DEPARTMENTS = [
  { code: "CSE", name: "Computer Science & Engineering", enabled: true },
  { code: "EEE", name: "Electrical & Electronic Eng.", enabled: false },
  { code: "LLB", name: "Bachelor of Laws", enabled: false },
  { code: "Economics", name: "Department of Economics", enabled: false },
];

export default function AuthForm({ initialMode }: AuthFormProps) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
  const [showPassword, setShowPassword] = useState(false);
  
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [semester, setSemester] = useState(1);
  const [section, setSection] = useState("A");
  const [department, setDepartment] = useState("CSE");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [isSemDropdownOpen, setIsSemDropdownOpen] = useState(false);
  const [isSecDropdownOpen, setIsSecDropdownOpen] = useState(false);
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [studentIdError, setStudentIdError] = useState("");

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setSuccess("");
    setIsSemDropdownOpen(false);
    setIsSecDropdownOpen(false);
    setIsDeptDropdownOpen(false);
    if (isSignUp) { router.push("/login"); } else { router.push("/signup"); }
  };

  const calculatedBatch = 50 - semester;

  const handleStudentIdChange = (val: string) => {
    setStudentId(val);
    if (val.trim() === "") { setStudentIdError(""); }
    else if (!/^\d*$/.test(val.trim())) { setStudentIdError("Invalid"); }
    else if (val.trim().length > 0 && val.trim().length !== 16) { setStudentIdError(val.trim().length < 16 ? "" : "Invalid"); }
    else if (val.trim().length === 16) { setStudentIdError(isValidStudentId(val.trim()) ? "" : "Invalid"); }
    else { setStudentIdError(""); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!studentId.trim()) { setStudentIdError("Please enter your Student ID."); return; }
    if (!isValidStudentId(studentId.trim())) { setStudentIdError("Invalid"); return; }
    setStudentIdError("");

    if (isSignUp) {
      if (!name.trim()) { setError("Please enter your name."); return; }
      if (!agreeTerms) { setError("You must agree to the Terms & Privacy policy."); return; }
    }

    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setIsLoading(true);

    if (isSignUp) {
      const result = await register({
        studentId: studentId.trim(),
        name: name.trim(),
        phone: phone.trim() || undefined,
        semester, section, department, password,
      });
      setIsLoading(false);
      if (!result.success) {
        const err = (result as { success: false; error: string }).error;
        if (err === "Invalid") { setStudentIdError("Invalid"); } else { setError(err); }
        return;
      }
      setSuccess(`Registration successful for Batch ${calculatedBatch}! Redirecting...`);
      setTimeout(() => { window.location.href = "/"; }, 1400);
    } else {
      const result = await login({ studentId: studentId.trim(), password });
      setIsLoading(false);
      if (!result.success) {
        const err = (result as { success: false; error: string }).error;
        if (err === "Invalid") { setStudentIdError("Invalid"); } else { setError(err); }
        return;
      }
      setSuccess("Logged in successfully! Redirecting...");
      setTimeout(() => { window.location.href = "/"; }, 1400);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#09090b]">
      <div 
        className="w-full max-w-[1100px] grid grid-cols-1 md:grid-cols-12 gap-2 p-3 rounded-clay-xl relative overflow-hidden transition-all duration-500 shadow-clay-floating"
        style={{ background: "#121216", border: "1px solid rgba(255,255,255,0.02)" }}
      >
        {/* Left Side: Visual Panel */}
        <div className="md:col-span-5 relative hidden md:flex flex-col justify-between p-8 rounded-clay-lg overflow-hidden min-h-[580px] select-none" style={{ background: "#18181b" }}>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex flex-col items-center text-center mt-12">
                <div className="w-56 h-44 flex items-center justify-center mb-6">
                  <img 
                    src="/logo.png" 
                    alt="Premier University Logo" 
                    className="max-w-full max-h-full object-contain" 
                  />
                </div>
                <h2 className="text-3xl font-syne font-extrabold text-white leading-tight tracking-tight whitespace-nowrap">
                  Premier University
                </h2>
                <p className="text-sm md:text-base text-gray-400 mt-3 font-semibold leading-relaxed max-w-[340px] tracking-wide">
                  Center of Excellence for Quality Learning
                </p>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <div className="flex items-center gap-4 opacity-55 hover:opacity-85 transition-opacity duration-300">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-neon transition-colors duration-200">
                  <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="md:col-span-7 flex flex-col justify-center px-4 py-6 sm:px-8 md:px-10 lg:px-12 overflow-visible">
          <div className="w-full max-w-[440px] mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-syne font-bold text-white mb-1.5 tracking-tight">
                {isSignUp ? "Get Started Now" : "Welcome Back"}
              </h1>
              <p className="text-xs text-gray-400 font-medium">
                {isSignUp 
                  ? "Create your student account to get started." 
                  : "Please log in to your account to continue."}
              </p>
            </div>

            {error && (
              <div className="p-3 mb-5 rounded-clay-sm text-xs bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 mb-5 rounded-clay-sm text-xs bg-neon/10 border border-neon/20 text-neon font-medium">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp ? (
                <>
                  <div className="space-y-1">
                    <label htmlFor="name-input" className="block text-xs font-semibold text-gray-400 tracking-wide">Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-600 pointer-events-none">
                        <User size={15} />
                      </span>
                      <input
                        id="name-input"
                        type="text"
                        placeholder="Enter your name..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="clay-input w-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="student-id-signup" className="block text-xs font-semibold text-gray-400 tracking-wide flex items-center gap-1.5">
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
                          id="student-id-signup"
                          type="text"
                          maxLength={16}
                          placeholder="16-digit Student ID"
                          value={studentId}
                          onChange={(e) => handleStudentIdChange(e.target.value)}
                          className={`clay-input w-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none ${
                            studentIdError ? "!border-red-500/40" : ""
                          }`}
                        />
                      </div>
                      <p className="text-[10px] text-gray-600 pl-1">Must be exactly 16 digits</p>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="phone-input" className="block text-xs font-semibold text-gray-400 tracking-wide flex items-center gap-1">
                        Number <span className="text-[10px] text-gray-600 font-medium">(Optional)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-600 pointer-events-none">
                          <Phone size={15} />
                        </span>
                        <input
                          id="phone-input"
                          type="tel"
                          placeholder="e.g. 017xxxxxxxx"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="clay-input w-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 relative z-20">
                    <div className="space-y-1 relative">
                      <label className="block text-xs font-semibold text-gray-400 tracking-wide">Semester</label>
                      <button
                        type="button"
                        onClick={() => { setIsSemDropdownOpen(!isSemDropdownOpen); setIsSecDropdownOpen(false); setIsDeptDropdownOpen(false); }}
                        className="clay-input w-full py-2.5 px-3 flex items-center justify-between text-xs text-white focus:outline-none"
                      >
                        <span>{SEMESTERS.find(s => s.value === semester)?.label.split(" ")[0]}</span>
                        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isSemDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isSemDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1 rounded-clay border border-white/5 py-1 z-30 shadow-clay-floating max-h-48 overflow-y-auto" style={{ background: "#18181b" }}>
                          {SEMESTERS.map((s) => (
                            <button key={s.value} type="button" onClick={() => { setSemester(s.value); setIsSemDropdownOpen(false); }}
                              className={`w-full text-left px-3 py-2 text-xs transition-colors ${semester === s.value ? "text-neon bg-white/[0.04] font-semibold" : "text-gray-400 hover:text-white hover:bg-white/[0.02]"}`}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 relative">
                      <label className="block text-xs font-semibold text-gray-400 tracking-wide">Section</label>
                      <button
                        type="button"
                        onClick={() => { setIsSecDropdownOpen(!isSecDropdownOpen); setIsSemDropdownOpen(false); setIsDeptDropdownOpen(false); }}
                        className="clay-input w-full py-2.5 px-3 flex items-center justify-between text-xs text-white focus:outline-none"
                      >
                        <span>Section {section}</span>
                        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isSecDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isSecDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-1 rounded-clay border border-white/5 py-1 z-30 shadow-clay-floating" style={{ background: "#18181b" }}>
                          {SECTIONS.map((sec) => (
                            <button key={sec} type="button" onClick={() => { setSection(sec); setIsSecDropdownOpen(false); }}
                              className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${section === sec ? "text-neon bg-white/[0.04] font-semibold" : "text-gray-400 hover:text-white hover:bg-white/[0.02]"}`}
                            >
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
                      <div className="clay-input py-2.5 px-3 text-xs text-neon/80 font-bold font-space-mono text-center select-none" style={{ background: "rgba(163,230,53,0.03)" }}>
                        {calculatedBatch}th
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 relative z-10">
                    <label className="block text-xs font-semibold text-gray-400 tracking-wide">Department</label>
                    <button
                      type="button"
                      onClick={() => { setIsDeptDropdownOpen(!isDeptDropdownOpen); setIsSemDropdownOpen(false); setIsSecDropdownOpen(false); }}
                      className="clay-input w-full py-2.5 px-3.5 flex items-center justify-between text-xs text-white focus:outline-none"
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap size={15} className="text-neon" />
                        {DEPARTMENTS.find(d => d.code === department)?.name} ({department})
                      </span>
                      <ChevronDown size={14} className={`text-gray-500 transition-transform ${isDeptDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isDeptDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-1 rounded-clay border border-white/5 py-1 z-30 shadow-clay-floating" style={{ background: "#18181b" }}>
                        {DEPARTMENTS.map((d) => (
                          <button
                            key={d.code}
                            type="button"
                            disabled={!d.enabled}
                            onClick={() => { if (d.enabled) { setDepartment(d.code); setIsDeptDropdownOpen(false); } }}
                            className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors ${
                              !d.enabled ? "text-gray-600 cursor-not-allowed opacity-50" 
                              : department === d.code ? "text-neon bg-white/[0.04] font-semibold" 
                              : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                            }`}
                          >
                            <span>{d.name} ({d.code})</span>
                            {!d.enabled && (
                              <span className="text-[9px] uppercase tracking-wider font-space-mono bg-white/[0.02] text-gray-500 px-1.5 py-0.5 rounded border border-white/5">
                                Locked
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-1">
                  <label htmlFor="student-id-signin" className="block text-xs font-semibold text-gray-400 tracking-wide flex items-center gap-1.5">
                    Student ID
                    {studentIdError && (
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                        {studentIdError}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-600 pointer-events-none">
                      <User size={15} />
                    </span>
                    <input
                      id="student-id-signin"
                      type="text"
                      maxLength={16}
                      placeholder="Enter your 16-digit Student ID"
                      value={studentId}
                      onChange={(e) => handleStudentIdChange(e.target.value)}
                      className={`clay-input w-full py-3 pl-10 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none ${
                        studentIdError ? "!border-red-500/40" : ""
                      }`}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="password-input" className="block text-xs font-semibold text-gray-400 tracking-wide">Password</label>
                  {!isSignUp && (
                    <a href="#forgot" className="text-[10px] font-bold text-neon hover:underline">Forgot Password?</a>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-600 pointer-events-none">
                    <Lock size={15} />
                  </span>
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="***********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="clay-input w-full py-2.5 pl-10 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div className="flex items-start gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setAgreeTerms(!agreeTerms)}
                    className="w-4 h-4 rounded-clay-sm border border-white/10 flex items-center justify-center shrink-0 transition-all focus:outline-none"
                    style={{
                      background: agreeTerms ? "#a3e635" : "#0b0b0e",
                      boxShadow: agreeTerms ? "0 0 8px rgba(163,230,53,0.3)" : "inset 2px 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    {agreeTerms && <Check size={11} className="text-space-950 stroke-[3.5]" />}
                  </button>
                  <span className="text-[11px] text-gray-400 font-medium leading-tight select-none">
                    I agree to the <a href="#terms" className="text-neon hover:underline font-bold">Terms</a> & <a href="#privacy" className="text-neon hover:underline font-bold">Privacy</a>
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="clay-btn w-full py-3.5 mt-2 rounded-clay text-xs font-space-mono font-bold uppercase tracking-wider text-space-950 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "#a3e635" }}
              >
                {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
              </button>
            </form>

            <div className="text-center mt-6">
              <span className="text-xs text-gray-500 font-medium">
                {isSignUp ? "Already have an account? " : "Don't have an account? "}
              </span>
              <button type="button" onClick={toggleMode} className="text-xs font-bold text-neon hover:underline transition-all focus:outline-none">
                {isSignUp ? "Log in" : "Sign up"}
              </button>
            </div>

            <div className="relative my-6 text-center">
              <hr className="border-white/[0.04]" />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#121216] px-3.5 text-[10px] font-space-mono font-bold text-gray-600 uppercase tracking-widest">
                Or
              </span>
            </div>

            <div className="w-full">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await googleLogin();
                  } catch (e: any) {
                    setError(e?.message || "Google sign-in failed. Please try again.");
                  }
                }}
                className="clay-card w-full flex items-center justify-center gap-2 py-3 px-4 rounded-clay-lg text-[11px] font-semibold text-white border border-white/[0.02] transition-all hover:bg-white/[0.02] active:translate-y-[1px]"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.745.982 15.06 0 12 0 7.355 0 3.398 2.673 1.503 6.559l3.763 3.206z"/>
                  <path fill="#4285F4" d="M23.764 12.24c0-.853-.082-1.7-.22-2.51H12v4.713h6.614a5.666 5.666 0 01-2.455 3.714l3.823 3.256c2.236-2.06 3.782-5.091 3.782-9.173z"/>
                  <path fill="#FBBC05" d="M5.266 14.235A7.098 7.098 0 014.909 12c0-.79.13-1.545.357-2.235L1.503 6.56A11.957 11.957 0 000 12c0 1.92.454 3.737 1.258 5.36l4.008-3.125z"/>
                  <path fill="#34A853" d="M12 19.091c-1.872 0-3.518-.764-4.709-1.996L3.283 20.22A11.954 11.954 0 0012 24c4.645 0 8.602-2.673 10.497-6.559l-3.823-3.256a7.077 7.077 0 01-6.674 4.906z"/>
                </svg>
                <span>Login with Google</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
