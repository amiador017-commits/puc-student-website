"use client";
import { useState, useEffect } from "react";
import { SEMESTERS, calculateGPA, getLetterGrade, getCourseTotalAndMax, type Course, mapDbRowsToCourses } from "../../lib/mockData";
import { TrendingUp, Award, ChevronDown } from "lucide-react";
import { createClient } from "../../lib/supabase";
import { useSession } from "../../lib/useSession";
import { getCoursesWithGrades } from "../../lib/grades";
import type { SessionUser } from "../../lib/server-session";

function SemesterButton({ sem, active, onClick }: { sem: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-clay-sm text-xs font-space-mono font-bold transition-all duration-200 ${
        active ? "text-space-950 bg-neon shadow-clay-neon" : "text-gray-500 hover:text-gray-300 shadow-clay-flat"
      }`}
    >
      S{sem}
    </button>
  );
}

function letterColor(letter: string) {
  if (letter.startsWith("A")) return "#a3e635";
  if (letter.startsWith("B")) return "#60a5fa";
  if (letter.startsWith("C")) return "#fb923c";
  return "#f87171";
}

function getShortName(name: string): string {
  const ignore = ["and", "of", "to", "in", "for", "with", "a", "an", "the", "&"];
  return name
    .split(/\s+/)
    .filter((word) => !ignore.includes(word.toLowerCase()))
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function GradesClient({
  initialUser,
  initialCourses,
}: {
  initialUser: SessionUser | null;
  initialCourses: Course[];
}) {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [dataFetched, setDataFetched] = useState(initialCourses.length > 0);
  const [showRetakeTab, setShowRetakeTab] = useState(false);
  const [selectedRetakeIds, setSelectedRetakeIds] = useState<string[]>([]);
  const [selectedRecourseIds, setSelectedRecourseIds] = useState<string[]>([]);
  const [openSemesters, setOpenSemesters] = useState<Record<number, boolean>>({});
  const session = useSession();

  useEffect(() => {
    if (dataFetched || !session) return;
    setSelectedSemester(session.semester);
    const supabase = createClient();
    async function fetchData() {
      const [{ data: courseRows }, { data: componentRows }] = await Promise.all([
        supabase.from("courses").select("course_id, code, name, semester, credits, instructor"),
        supabase.from("course_assessment_components").select("course_id, component_key, label, max_marks"),
      ]);
      const mapped = mapDbRowsToCourses(courseRows ?? [], componentRows ?? []);
      const withGrades = await getCoursesWithGrades(session.studentId, mapped);
      setCourses(withGrades);
      setDataFetched(true);
    }
    fetchData();
  }, [session?.studentId, dataFetched]);

  useEffect(() => {
    if (!session?.studentId) return;
    const storedRetakes = localStorage.getItem(`puc_retakes_${session.studentId}`);
    const storedRecourses = localStorage.getItem(`puc_recourses_${session.studentId}`);
    if (storedRetakes) { try { setSelectedRetakeIds(JSON.parse(storedRetakes)); } catch { setSelectedRetakeIds([]); } }
    else { setSelectedRetakeIds([]); }
    if (storedRecourses) { try { setSelectedRecourseIds(JSON.parse(storedRecourses)); } catch { setSelectedRecourseIds([]); } }
    else { setSelectedRecourseIds([]); }
  }, [session?.studentId]);

  const toggleRetake = (courseId: string) => {
    if (!session?.studentId) return;
    let next: string[];
    if (selectedRetakeIds.includes(courseId)) { next = selectedRetakeIds.filter((id) => id !== courseId); }
    else { next = [...selectedRetakeIds, courseId]; }
    const nextRecourse = selectedRecourseIds.filter((id) => id !== courseId);
    setSelectedRetakeIds(next);
    setSelectedRecourseIds(nextRecourse);
    localStorage.setItem(`puc_retakes_${session.studentId}`, JSON.stringify(next));
    localStorage.setItem(`puc_recourses_${session.studentId}`, JSON.stringify(nextRecourse));
  };

  const toggleRecourse = (courseId: string) => {
    if (!session?.studentId) return;
    let next: string[];
    if (selectedRecourseIds.includes(courseId)) { next = selectedRecourseIds.filter((id) => id !== courseId); }
    else { next = [...selectedRecourseIds, courseId]; }
    const nextRetake = selectedRetakeIds.filter((id) => id !== courseId);
    setSelectedRecourseIds(next);
    setSelectedRetakeIds(nextRetake);
    localStorage.setItem(`puc_recourses_${session.studentId}`, JSON.stringify(next));
    localStorage.setItem(`puc_retakes_${session.studentId}`, JSON.stringify(nextRetake));
  };

  const toggleSemester = (sem: number) => {
    setOpenSemesters((prev) => ({ ...prev, [sem]: !prev[sem] }));
  };

  const semCourses = courses.filter((c) => c.semester === selectedSemester);
  const semGPA = calculateGPA(semCourses);
  const cgpa = calculateGPA(courses);

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="page-title-lg">Grades</h1>
        <p className="page-subtitle">Academic performance across all semesters</p>
      </header>

      <div className="grid grid-cols-2 gap-5 mb-8">
        {[
          { label: "Semester GPA", value: semGPA.toFixed(2), sub: `Semester ${selectedSemester}`, icon: <TrendingUp size={16} /> },
          { label: "Cumulative GPA", value: cgpa.toFixed(2), sub: "All semesters", icon: <Award size={16} /> },
        ].map((card) => (
          <div
            key={card.label}
            className="clay-card p-4 sm:p-5 rounded-clay-xl flex flex-col justify-between aspect-square sm:aspect-auto sm:flex-row sm:items-center sm:justify-start gap-4 sm:gap-5"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-clay-lg flex items-center justify-center text-neon shrink-0 shadow-clay-inset" style={{ background: "rgba(163,230,53,0.1)" }}>
              {card.icon}
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-0.5 sm:mb-1 leading-tight">{card.label}</p>
              <p className="font-space-mono text-xl sm:text-3xl font-bold text-white leading-none">{card.value}</p>
              <p className="text-[9px] sm:text-xs text-gray-600 mt-1 leading-none">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="shadow-clay-raised rounded-clay-xl overflow-hidden animate-fade-in" style={{ background: "#121216" }}>
        <div className="px-6 py-5 border-b border-white/[0.04]">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <h2 className="font-syne font-bold text-white">Grade Report</h2>
            <div className="flex flex-wrap gap-2 items-center">
              {SEMESTERS.map((sem) => (
                <SemesterButton key={sem} sem={sem} active={selectedSemester === sem && !showRetakeTab} onClick={() => { setSelectedSemester(sem); setShowRetakeTab(false); }} />
              ))}
              <button
                onClick={() => setShowRetakeTab(true)}
                className={`px-4 py-1.5 rounded-clay-sm text-xs font-space-mono font-bold transition-all duration-200 ${
                  showRetakeTab ? "text-space-950 bg-neon shadow-clay-neon" : "text-gray-500 hover:text-gray-300 shadow-clay-flat"
                }`}
              >
                Retake
              </button>
            </div>
          </div>
        </div>

        {showRetakeTab ? (
          <div className="p-6 space-y-4">
            <div className="mb-4">
              <h3 className="text-sm font-syne font-bold text-white mb-1">Select Retake & Recourse Courses</h3>
              <p className="text-xs text-gray-500">Toggle courses below to decide which ones you are retaking or recoursing. This will update your dashboard cards.</p>
            </div>
            <div className="space-y-3">
              {SEMESTERS.map((sem) => {
                const semCoursesList = courses.filter((c) => c.semester === sem);
                const isOpen = openSemesters[sem] ?? false;
                return (
                  <div key={sem} className="rounded-clay-lg overflow-hidden shadow-clay-flat" style={{ background: "#1c1c22" }}>
                    <button
                      onClick={() => toggleSemester(sem)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors focus:outline-none"
                    >
                      <div>
                        <span className="font-syne font-bold text-sm text-white">Semester {sem}</span>
                        <span className="text-xs text-gray-500 ml-3">({semCoursesList.length} courses)</span>
                      </div>
                      <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-2 border-t border-white/[0.03] space-y-3">
                        {semCoursesList.length === 0 ? (
                          <p className="text-xs text-gray-600">No courses in this semester.</p>
                        ) : (
                          semCoursesList.map((c) => {
                            const isRetake = selectedRetakeIds.includes(c.courseId);
                            const isRecourse = selectedRecourseIds.includes(c.courseId);
                            return (
                              <div
                                key={c.courseId}
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-clay-lg gap-4 shadow-clay-flat"
                                style={{ background: "#1c1c22" }}
                              >
                                <div className="flex items-center gap-3">
                                  {(() => {
                                    const [prefix, ...suffixParts] = c.code.split(" ");
                                    const formattedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase();
                                    const suffix = suffixParts.join(" ");
                                    return (
                                      <div
                                        className="inline-flex flex-col items-center justify-center rounded-clay-sm px-3 py-1 font-space-mono text-center min-w-[75px] shadow-clay-inset"
                                        style={{ background: "rgba(163,230,53,0.06)", border: "1px solid rgba(163,230,53,0.15)" }}
                                      >
                                        <span className="text-[9px] font-bold tracking-wider" style={{ color: "#a3e635" }}>{formattedPrefix}</span>
                                        {suffix && <span className="text-[8px] font-bold mt-0.5" style={{ color: "#a3e635", opacity: 0.8 }}>{suffix}</span>}
                                      </div>
                                    );
                                  })()}
                                  <div>
                                    <h4 className="text-xs font-syne font-bold text-white leading-snug">{c.name}</h4>
                                    <p className="text-[10px] text-gray-500 font-medium font-space-mono mt-0.5">{c.credits} Credits</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => toggleRetake(c.courseId)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-space-mono font-bold transition-all duration-200 cursor-pointer select-none border ${
                                      isRetake ? "text-space-950 border-lime-400/60" : "text-gray-400 hover:text-white border-white/10"
                                    }`}
                                    style={
                                      isRetake
                                        ? { background: "rgba(163,230,53,0.85)", boxShadow: "0 4px 12px rgba(163,230,53,0.25)" }
                                        : { background: "rgba(255,255,255,0.05)" }
                                    }
                                  >
                                    {isRetake ? "✓ Retake" : "Retake"}
                                  </button>
                                  <button
                                    onClick={() => toggleRecourse(c.courseId)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-space-mono font-bold transition-all duration-200 cursor-pointer select-none border ${
                                      isRecourse ? "text-white border-pink-400/60" : "text-gray-400 hover:text-white border-white/10"
                                    }`}
                                    style={
                                      isRecourse
                                        ? { background: "rgba(236,72,153,0.85)", boxShadow: "0 4px 12px rgba(236,72,153,0.25)" }
                                        : { background: "rgba(255,255,255,0.05)" }
                                    }
                                  >
                                    {isRecourse ? "✓ Recourse" : "Recourse"}
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-[75px_1fr_25px_95px] lg:grid-cols-[120px_1fr_80px_160px_90px_100px] gap-3 lg:gap-4 px-4 lg:px-5 pb-3.5 text-[9px] lg:text-[10px] uppercase tracking-widest text-gray-500 font-semibold border-b border-white/[0.04]">
                <div className="text-center lg:text-left">Code</div>
                <div className="text-left">Name</div>
                <div className="text-center">Cr</div>
                <div className="text-left">Total</div>
                <div className="hidden lg:block text-center">Grade</div>
                <div className="hidden lg:block text-center">Attendance</div>
              </div>

              {semCourses.map((c) => {
                const letter = getLetterGrade(c);
                const { total, max } = getCourseTotalAndMax(c);
                const pct = max > 0 ? Math.round((total / max) * 100) : 0;
                const lc = letterColor(letter);

                let attendancePct = 0;
                let hasAttendance = false;
                if (c.assessmentComponents) {
                  const attComp = c.assessmentComponents.find((comp) => comp.key === "attendance");
                  if (attComp) {
                    const attVal = c.grades.attendance ?? 0;
                    attendancePct = attComp.max > 0 ? Math.round((attVal / attComp.max) * 100) : 0;
                    hasAttendance = true;
                  }
                } else {
                  attendancePct = c.grades.attendance;
                  hasAttendance = true;
                }

                return (
                  <div
                    key={c.courseId}
                    className="grid grid-cols-[75px_1fr_25px_95px] lg:grid-cols-[120px_1fr_80px_160px_90px_100px] items-center gap-3 lg:gap-4 px-4 lg:px-5 py-3 lg:py-4 rounded-clay-lg border border-transparent transition-all duration-300 hover:-translate-y-0.5 shadow-clay-flat"
                    style={{ background: "#1c1c22" }}
                  >
                    <div className="flex justify-center lg:justify-start w-full">
                      {(() => {
                        const [prefix, ...suffixParts] = c.code.split(" ");
                        const formattedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase();
                        const suffix = suffixParts.join(" ");
                        return (
                          <div
                            className="inline-flex flex-col items-center justify-center rounded-clay-sm px-2 lg:px-3.5 py-1 lg:py-1.5 font-space-mono text-center min-w-[60px] lg:min-w-[80px] shadow-clay-inset"
                            style={{ background: "rgba(163,230,53,0.06)", border: "1px solid rgba(163,230,53,0.15)" }}
                          >
                            <span className="text-[9px] lg:text-[10px] font-bold tracking-wider" style={{ color: "#a3e635" }}>{formattedPrefix}</span>
                            {suffix && <span className="text-[7px] lg:text-[9px] font-bold mt-0.5" style={{ color: "#a3e635", opacity: 0.8 }}>{suffix}</span>}
                          </div>
                        );
                      })()}
                    </div>
                    <div className="text-left">
                      <span className="lg:hidden text-xs text-gray-200 font-bold">{getShortName(c.name)}</span>
                      <span className="hidden lg:inline text-sm text-gray-200 font-medium">{c.name}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs lg:text-sm font-space-mono text-gray-400">{c.credits}</span>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center justify-start gap-1.5 lg:gap-2">
                        <span className="font-space-mono text-xs lg:text-sm text-white font-bold">{pct}%</span>
                        <div className="w-12 lg:w-16 h-1.5 rounded-full overflow-hidden shadow-clay-inset" style={{ background: "rgba(0,0,0,0.4)" }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: lc }} />
                        </div>
                      </div>
                    </div>
                    <div className="hidden lg:block lg:text-center w-full">
                      <span
                        className="text-xs font-space-mono font-bold px-3 py-1 rounded-clay-sm shadow-clay-inset border select-none"
                        style={{ color: lc, background: `${lc}18`, borderColor: `${lc}35` }}
                      >
                        {letter}
                      </span>
                    </div>
                    <div className="hidden lg:block lg:text-center w-full">
                      {hasAttendance ? (
                        <span className={`text-sm font-space-mono font-bold ${attendancePct >= 90 ? "text-neon" : attendancePct >= 75 ? "text-amber-400" : "text-red-400"}`}>
                          {attendancePct}%
                        </span>
                      ) : (
                        <span className="text-gray-600 font-space-mono text-sm">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-4 border-t border-white/[0.04] flex justify-end">
              <p className="text-xs text-gray-500">
                Semester {selectedSemester} GPA:{" "}
                <span className="font-space-mono font-bold text-neon">{semGPA.toFixed(2)}</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
