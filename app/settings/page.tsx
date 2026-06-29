"use client";
import { useState } from "react";
import { User, Mail, Phone, Lock, Bell, Eye, Globe, Shield, Save, Check } from "lucide-react";

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-all duration-300 flex items-center ${
        checked ? "bg-neon" : ""
      }`}
      style={
        checked
          ? { background: "#a3e635", boxShadow: "0 0 8px rgba(163,230,53,0.3)" }
          : {
              background: "#0b0b0e",
              boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.6), inset -1.5px -1.5px 3px rgba(255,255,255,0.03)",
            }
      }
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-neon/30 transition-all"
        style={{
          background: "#0b0b0e",
          boxShadow: "inset 4px 4px 8px rgba(0,0,0,0.65), inset -2px -2px 4px rgba(255,255,255,0.03)",
        }}
      />
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-[26px] p-6"
      style={{
        background: "#121216",
        boxShadow: "10px 10px 30px rgba(0,0,0,0.5), inset -6px -6px 12px rgba(0,0,0,0.7), inset 3px 3px 6px rgba(255,255,255,0.04)",
      }}
    >
      <h2 className="font-syne font-bold text-white mb-5">{title}</h2>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [name, setName] = useState("Ador");
  const [email, setEmail] = useState("ador@puc.edu.bd");
  const [phone, setPhone] = useState("+880-123-456-789");
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    assignments: true,
    grades: true,
    announcements: true,
    messages: true,
    reminders: false,
    newsletter: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleNotif = (key: keyof typeof notifications) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs text-gray-600 mb-1 font-space-mono tracking-widest uppercase">Account / Settings</p>
        <h1 className="text-2xl font-syne font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your profile and preferences</p>
      </header>

      <div className="space-y-6">
        {/* Avatar section */}
        <SectionCard title="Profile">
          <div className="flex items-center gap-5 mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: "rgba(163,230,53,0.1)",
                boxShadow: "4px 4px 12px rgba(0,0,0,0.4), inset -3px -3px 6px rgba(0,0,0,0.4), inset 1.5px 1.5px 3px rgba(255,255,255,0.1)",
                border: "1px solid rgba(163,230,53,0.15)",
              }}
            >
              <User size={28} className="text-neon" />
            </div>
            <div>
              <p className="font-syne font-bold text-white mb-0.5">{name || "Student"}</p>
              <p className="text-xs text-gray-500 font-space-mono">ID: 21201045 · B.Sc. CSE</p>
              <button className="text-xs text-neon mt-2 hover:underline">Change avatar</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Full Name" value={name} onChange={setName} placeholder="Your name" />
            <InputField label="Student ID" value="21201045" onChange={() => {}} placeholder="Student ID" />
            <InputField label="Email" value={email} onChange={setEmail} type="email" placeholder="your@email.com" />
            <InputField label="Phone" value={phone} onChange={setPhone} placeholder="+880-xxx-xxx-xxx" />
          </div>
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Current Password" value="" onChange={() => {}} type="password" placeholder="••••••••" />
              <InputField label="New Password" value="" onChange={() => {}} type="password" placeholder="••••••••" />
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "rgba(163,230,53,0.05)", border: "1px solid rgba(163,230,53,0.1)" }}>
              <Shield size={15} className="text-neon" />
              <p className="text-xs text-gray-400">Two-factor authentication is <span className="text-neon font-semibold">enabled</span> for your account.</p>
            </div>
          </div>
        </SectionCard>

        {/* Notification preferences */}
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
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center text-gray-500 mt-0.5 shrink-0"
                    style={{ background: "#1c1c22", boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.4), inset -1px -1px 2px rgba(255,255,255,0.04)" }}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications[key]}
                  onChange={() => toggleNotif(key)}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold font-syne transition-all duration-300 ${
              saved ? "text-space-950" : "text-space-950"
            }`}
            style={{
              background: saved ? "#6ee7b7" : "#a3e635",
              boxShadow: "4px 4px 12px rgba(163,230,53,0.2), inset -2px -2px 4px rgba(0,0,0,0.3), inset 1.5px 1.5px 3px rgba(255,255,255,0.5)",
            }}
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
