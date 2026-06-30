"use client";
import { useState, useEffect } from "react";
import { MessageSquare, ShieldAlert, Users } from "lucide-react";
import { createClient } from "../../lib/supabase";
import { useSession } from "../../lib/useSession";

interface Admin {
  id: number;
  name: string;
  role: string;
  phone: string;
  whatsap_url: string;
}

interface ClassRep {
  id: number;
  semester: number;
  section: string;
  name: string;
  phone: string;
  whatsap_url: string;
}

export default function ContactAdminPage() {
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [classReps, setClassReps] = useState<ClassRep[]>([]);

  // useSession ensures the page only fetches once auth is confirmed
  useSession();

  useEffect(() => {
    const supabase = createClient();

    async function fetchData() {
      const [adminsRes, classRepsRes] = await Promise.all([
        supabase.from("admins").select("id, name, role, phone, whatsap_url"),
        supabase.from("class_reps").select("id, semester, section, name, phone, whatsap_url"),
      ]);

      if (adminsRes.data) setAdmins(adminsRes.data as Admin[]);
      if (classRepsRes.data) setClassReps(classRepsRes.data as ClassRep[]);
    }

    fetchData();
  }, []);

  const activeCR = classReps.find((cr) => cr.semester === selectedSemester) ?? null;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs text-gray-600 mb-1 font-space-mono tracking-widest uppercase">Account / Contact Admin</p>
        <h1 className="text-3xl font-syne font-bold text-white">Contact Admin</h1>
        <p className="text-sm text-gray-500 mt-1">
          Get in touch with administrators and class representatives via WhatsApp.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Admin Section */}
        <div
          className="rounded-[26px] p-6 flex flex-col"
          style={{
            background: "#121216",
            boxShadow: "10px 10px 30px rgba(0,0,0,0.5), inset -6px -6px 12px rgba(0,0,0,0.7), inset 3px 3px 6px rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center border border-neon/20">
              <ShieldAlert className="text-neon" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-syne font-bold text-white">Administrators</h2>
              <p className="text-xs text-gray-500">Official platform admins</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="p-4 rounded-2xl flex flex-col gap-2 transition-all hover:bg-white/[0.01]"
                style={{
                  background: "#0e0e11",
                  boxShadow: "inset 4px 4px 8px rgba(0,0,0,0.5), inset -2px -2px 4px rgba(255,255,255,0.03)",
                }}
              >
                <div>
                  <h3 className="text-sm font-semibold text-white font-syne">{admin.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{admin.role}</p>
                </div>
                
                <a
                  href={admin.whatsap_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl text-space-950 transition-all duration-200 hover:opacity-90 w-fit"
                  style={{
                    background: "#a3e635",
                    boxShadow: "2px 2px 6px rgba(0,0,0,0.4), inset -2px -2px 4px rgba(0,0,0,0.25), inset 1.5px 1.5px 3px rgba(255,255,255,0.5)",
                  }}
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp: {admin.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CR Section */}
        <div
          className="rounded-[26px] p-6 flex flex-col"
          style={{
            background: "#121216",
            boxShadow: "10px 10px 30px rgba(0,0,0,0.5), inset -6px -6px 12px rgba(0,0,0,0.7), inset 3px 3px 6px rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Users className="text-blue-400" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-syne font-bold text-white">Class Representatives</h2>
              <p className="text-xs text-gray-500">Semester CR contacts</p>
            </div>
          </div>

          {/* Semester Tabs */}
          <div className="grid grid-cols-4 gap-1.5 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`py-1.5 px-1 rounded-lg text-center text-xs font-semibold font-space-mono transition-all duration-150 ${
                  selectedSemester === sem
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-white/[0.03] text-gray-400 hover:text-white hover:bg-white/[0.08]"
                }`}
              >
                Sem {sem}
              </button>
            ))}
          </div>

          <div className="min-h-[160px] flex flex-col">
            {activeCR ? (
              <div
                className="p-4 rounded-2xl flex flex-col gap-2 transition-all"
                style={{
                  background: "#0e0e11",
                  boxShadow: "inset 4px 4px 8px rgba(0,0,0,0.5), inset -2px -2px 4px rgba(255,255,255,0.03)",
                }}
              >
                <div>
                  <h3 className="text-sm font-semibold text-white font-syne">{activeCR.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {activeCR.semester === 1 ? "1st" : activeCR.semester === 2 ? "2nd" : activeCR.semester === 3 ? "3rd" : `${activeCR.semester}th`} Semester ({activeCR.section})
                  </p>
                </div>
                
                <a
                  href={activeCR.whatsap_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all duration-200 hover:opacity-90 w-fit"
                  style={{
                    background: "rgba(59,130,246,0.2)",
                    border: "1px solid rgba(59,130,246,0.3)",
                    boxShadow: "2px 2px 6px rgba(0,0,0,0.4), inset -2px -2px 4px rgba(0,0,0,0.25), inset 1.5px 1.5px 3px rgba(255,255,255,0.1)",
                  }}
                >
                  <MessageSquare size={14} className="text-blue-400" />
                  <span>WhatsApp: {activeCR.phone}</span>
                </a>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 rounded-2xl"
                   style={{
                     background: "#0e0e11",
                     boxShadow: "inset 4px 4px 8px rgba(0,0,0,0.5), inset -2px -2px 4px rgba(255,255,255,0.03)",
                   }}>
                <Users className="text-gray-600 mb-2" size={32} />
                <h3 className="text-sm font-semibold text-gray-400 font-syne">No CR Assigned Yet</h3>
                <p className="text-xs text-gray-600 mt-1 max-w-[200px]">
                  Class representative for {selectedSemester === 1 ? "1st" : selectedSemester === 2 ? "2nd" : selectedSemester === 3 ? "3rd" : `${selectedSemester}th`} Semester is not listed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
