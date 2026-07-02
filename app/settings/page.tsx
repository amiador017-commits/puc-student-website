"use client";
import { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Bell, Eye, Globe, Shield, Save, Check } from "lucide-react";
import { updateProfile, googleLogin } from "../../lib/auth";
import { useSession } from "../../lib/useSession";

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-all duration-300 flex items-center ${
        checked ? "bg-neon shadow-clay-neon" : "shadow-clay-inset"
      }`}
      style={checked ? {} : { background: "#0b0b0e" }}
    >
      <span
        className={`absolute w-4 h-4 rounded-full transition-transform duration-300 ${
          checked ? "translate-x-5 bg-space-950" : "translate-x-1 bg-gray-500"
        }`}
        style={{ boxShadow: "1px 1px 3px rgba(0,0,0,0.4)" }}
      />
    </button>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`clay-input w-full py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none transition-all ${readOnly ? "opacity-60 cursor-default" : ""}`}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  options: { value: string | number; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="clay-input w-full py-3 px-4 text-sm text-white focus:outline-none transition-all appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 16px center',
          backgroundSize: '16px',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#121216]">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const SEMESTER_OPTIONS = [
  { value: 1, label: "1st Semester" },
  { value: 2, label: "2nd Semester" },
  { value: 3, label: "3rd Semester" },
  { value: 4, label: "4th Semester" },
  { value: 5, label: "5th Semester" },
  { value: 6, label: "6th Semester" },
  { value: 7, label: "7th Semester" },
  { value: 8, label: "8th Semester" },
];

const SECTION_OPTIONS = [
  { value: "A", label: "Section A" },
  { value: "B", label: "Section B" },
  { value: "C", label: "Section C" },
  { value: "D", label: "Section D" },
  { value: "E", label: "Section E" },
  { value: "F", label: "Section F" },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="shadow-clay-raised rounded-clay-xl p-6" style={{ background: "#121216" }}>
      <h2 className="font-syne font-bold text-white mb-5">{title}</h2>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState(0);
  const [section, setSection] = useState("");
  const [batch, setBatch] = useState(0);
  const [saved, setSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const session = useSession();

  useEffect(() => {
    if (session) {
      setName(session.name);
      setStudentId(session.studentId);
      setPhone(session.phone ?? "");
      setDepartment(session.department);
      setSemester(session.semester);
      setSection(session.section);
      setBatch(session.batch);
      setEmail(session.linkedGmail ?? "");
    }
  }, [session]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const linkError = params.get("linkError");
      if (linkError) setErrorMsg(linkError);
    }
  }, []);

  const [notifications, setNotifications] = useState({
    assignments: true,
    grades: true,
    announcements: true,
    messages: true,
    reminders: false,
    newsletter: false,
  });

  const handleSave = async () => {
    setErrorMsg("");
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        setErrorMsg("Please fill in both current and new password fields to change your password.");
        return;
      }
      try {
        const pwdRes = await fetch("/api/auth/update-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        const pwdData = await pwdRes.json();
        if (!pwdRes.ok) {
          setErrorMsg(pwdData.error || "Failed to update password.");
          return;
        }
      } catch {
        setErrorMsg("Failed to update password. Please try again.");
        return;
      }
    }
    const res = await updateProfile({
      name,
      phone,
      linkedGmail: email || undefined,
      semester,
      section,
    });
    if (res.success) {
      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => { setSaved(false); window.location.reload(); }, 1500);
    } else {
      setErrorMsg(res.error || "Failed to update profile.");
    }
  };

  const handleUnlinkGmail = async () => {
    setEmail("");
    await updateProfile({ name, phone, linkedGmail: undefined });
  };

  const toggleNotif = (key: keyof typeof notifications) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <header className="mb-8">
        <h1 className="page-title-lg">Settings</h1>
        <p className="page-subtitle">Manage your profile and preferences</p>
      </header>

      <div className="space-y-6">
        <SectionCard title="Profile">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-clay-lg flex items-center justify-center shrink-0 shadow-clay-flat" style={{ background: "rgba(163,230,53,0.1)", border: "1px solid rgba(163,230,53,0.15)" }}>
              <User size={28} className="text-neon" />
            </div>
            <div>
              <p className="font-syne font-bold text-white mb-0.5">{name || "Student"}</p>
              <p className="text-xs text-gray-500 font-space-mono">
                ID: {studentId || "—"} · {department} · Sem {semester} · Sec {section} · Batch {batch}
              </p>
              <button className="text-xs text-neon mt-2 hover:underline">Change avatar</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Full Name" value={name} onChange={setName} placeholder="Your name" />
            <InputField label="Student ID" value={studentId} onChange={() => {}} placeholder="Student ID" readOnly />
            <div>
              <label className="block text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Email</label>
              {email ? (
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="clay-input w-full py-3 pl-4 pr-24 text-sm text-white placeholder-gray-600 focus:outline-none opacity-90 cursor-default"
                  />
                  <button
                    type="button"
                    onClick={handleUnlinkGmail}
                    className="absolute right-2 px-3 py-1.5 rounded-clay-sm text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all font-syne"
                  >
                    Unlink
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    try { await googleLogin("link"); }
                    catch (e: any) { setErrorMsg(e?.message || "Failed to start Google sign-in. Please try again."); }
                  }}
                  className="clay-btn w-full rounded-clay py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 text-space-950 transition-all duration-300 hover:scale-[1.01] font-syne"
                  style={{ background: "linear-gradient(90deg, #a3e635 0%, #6ee7b7 100%)" }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.48 1 0 6.48 0 13s5.48 12 12.24 12c7.06 0 11.758-4.967 11.758-11.96 0-.807-.087-1.427-.193-1.755H12.24z"/>
                  </svg>
                  Link Google Account
                </button>
              )}
            </div>
            <InputField label="Phone" value={phone} onChange={setPhone} placeholder="+880-xxx-xxx-xxx" />
            <SelectField
              label="Semester"
              value={semester}
              onChange={(v) => { const sem = Number(v); setSemester(sem); setBatch(50 - sem); }}
              options={SEMESTER_OPTIONS}
            />
            <SelectField label="Section" value={section} onChange={setSection} options={SECTION_OPTIONS} />
          </div>
        </SectionCard>

        <SectionCard title="Security">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Current Password" value={currentPassword} onChange={setCurrentPassword} type="password" placeholder="••••••••" />
              <InputField label="New Password" value={newPassword} onChange={setNewPassword} type="password" placeholder="••••••••" />
            </div>
            <div className="flex items-center gap-3 p-4 rounded-clay-lg shadow-clay-inset" style={{ background: "rgba(163,230,53,0.05)", border: "1px solid rgba(163,230,53,0.1)" }}>
              <Shield size={15} className="text-neon" />
              <p className="text-xs text-gray-400">Two-factor authentication is <span className="text-neon font-semibold">enabled</span> for your account.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Notification Preferences">
          <div className="space-y-4">
            {(
              [
                { key: "assignments",   label: "New Assignments",    desc: "Get notified when an assignment is posted",       icon: <Bell size={14} />    },
                { key: "grades",        label: "Grade Updates",      desc: "Alert when grades are published",                 icon: <Eye size={14} />     },
                { key: "announcements", label: "Announcements",      desc: "Receive class and campus announcements",          icon: <Globe size={14} />   },
                { key: "messages",      label: "Direct Messages",    desc: "Notify on new messages from instructors",         icon: <Mail size={14} />    },
                { key: "reminders",     label: "Schedule Reminders", desc: "15-min reminder before each class",              icon: <Phone size={14} />   },
                { key: "newsletter",    label: "Monthly Newsletter", desc: "University news and events digest",               icon: <Lock size={14} />    },
              ] as const
            ).map(({ key, label, desc, icon }) => (
              <div key={key} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-clay-sm flex items-center justify-center text-gray-500 mt-0.5 shrink-0 shadow-clay-inset" style={{ background: "#1c1c22" }}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
                <ToggleSwitch checked={notifications[key]} onChange={() => toggleNotif(key)} />
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-4">
          {errorMsg && (
            <p className="text-sm text-red-400 font-medium font-syne" role="alert">{errorMsg}</p>
          )}
          <button
            onClick={handleSave}
            className="clay-btn flex items-center gap-2 px-6 py-3 rounded-clay text-sm font-semibold font-syne text-space-950 transition-all duration-300"
            style={{ background: saved ? "#6ee7b7" : "#a3e635" }}
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
