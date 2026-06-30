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
      className={`px-4 py-1.5 rounded-xl text-xs font-space-mono font-bold transition-all duration-200 ${
        active ? "text-space-950" : "text-gray-500 hover:text-gray-300"
      }`}
      style={
        active
          ? { background: "#a3e635", boxShadow: "3px 3px 8px rgba(163,230,53,0.2), inset -2px -2px 4px rgba(0,0,0,0.3), inset 1.5px 1.5px 3px rgba(255,255,255,0.5)" }
          : { background: "#1c1c22", boxShadow: "4px 4px 10px rgba(0,0,0,0.4), inset -3px -3px 6px rgba(0,0,0,0.5), inset 1.5px 1.5px 3px rgba(255,255,255,0.04)" }
      }
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
    if (storedRetakes) {
      try { setSelectedRetakeIds(JSON.parse(storedRetakes)); }
      catch { setSelectedRetakeIds([]); }
    } else { setSelectedRetakeIds([]); }
    if (storedRecourses) {
      try { setSelectedRecourseIds(JSON.parse(storedRecourses)); }
      catch { setSelectedRecourseIds([]); }
    } else { setSelectedRecourseIds([]); }
  }, [session?.studentId]);

  const toggleRetake = (courseId: string) => {
    if (!session?.studentId) return;
    let next: string[];
    if (selectedRetakeIds.includes(courseId)) {
      next = selectedRetakeIds.filter((id) => id !== courseId);
    } else {
      next = [...selectedRetakeIds, courseId];
    }
    const nextRecourse = selectedRecourseIds.filter((id) => id !== courseId);
    setSelectedRetakeIds(next);
    setSelectedRecourseIds(nextRecourse);
    localStorage.setItem(`puc_retakes_${session.studentId}`, JSON.stringify(next));
    localStorage.setItem(`puc_recourses_${session.studentId}`, JSON.stringify(nextRecourse));
  };

  const toggleRecourse = (courseId: string) => {
    if (!session?.studentId) return;
    let next: string[];
    if (selectedRecourseIds.includes(courseId)) {
      next = selectedRecourseIds.filter((id) => id !== courseId);
    } else {
      next = [...selectedRecourseIds, courseId];
    }
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
    <div className="p-6 md:p-8">
      <header className="mb-8">
        <p className="text-xs text-gray-600 mb-1 font-space-mono tracking-widest uppercase">Dashboards / Grades</p>
        <h1 className="text-2xl font-syne font-bold text-white">Grades</h1>
        <p className="text-sm text-gray-500 mt-1">Academic performance across all semesters</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {[
          { label: "Semester GPA", value: semGPA.toFixed(2), sub: `Semester ${selectedSemester}`, icon: <TrendingUp size={16} /> },
          { label: "Cumulative GPA", value: cgpa.toFixed(2), sub: "All semesters", icon: <Award size={16} /> },
        ].map((card) => (
          <div
            key={card.label}
            className="p-5 rounded-[26px] flex items-center gap-5"
            style={{
              background: "#1c1c22",
              boxShadow: "8px 8px 24px rgba(0,0,0,0.55), inset -6px -6px 12px rgba(0,0,0,0.65), inset 3px 3px 6px rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-neon shrink-0"
              style={{
                background: "rgba(163,230,53,0.1)",
                boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(255,255,255,0.1)",
              }}
            >
              {card.icon}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mb-1">{card.label}</p>
              <p className="font-space-mono text-3xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-gray-600 mt-0.5">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-[26px] overflow-hidden animate-fade-in"
        style={{
          background: "#121216",
          boxShadow: "10px 10px 30px rgba(0,0,0,0.5), inset -6px -6px 12px rgba(0,0,0,0.7), inset 3px 3px 6px rgba(255,255,255,0.04)",
        }}
      >
        <div className="px-6 py-5 border-b border-white/[0.04]">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <h2 className="font-syne font-bold text-white">Grade Report</h2>
            <div className="flex flex-wrap gap-2 items-center">
              {SEMESTERS.map((sem) => (
                <SemesterButton
                  key={sem}
                  sem={sem}
                  active={selectedSemester === sem && !showRetakeTab}
                  onClick={() => { setSelectedSemester(sem); setShowRetakeTab(false); }}
                />
              ))}
              <button
                onClick={() => setShowRetakeTab(true)}
                className={`px-4 py-1.5 rounded-xl text-xs font-space-mono font-bold transition-all duration-200 ${
                  showRetakeTab ? "text-space-950" : "text-gray-500 hover:text-gray-300"
                }`}
                style={
                  showRetakeTab
                    ? { background: "#a3e635", boxShadow: "3px 3px 8px rgba(163,230,53,0.2), inset -2px -2px 4px rgba(0,0,0,0.3), inset 1.5px 1.5px 3px rgba(255,255,255,0.5)" }
                    : { background: "#1c1c22", boxShadow: "4px 4px 10px rgba(0,0,0,0.4), inset -3px -3px 6px rgba(0,0,0,0.5), inset 1.5px 1.5px 3px rgba(255,255,255,0.04)" }
                }
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
                  <div
                    key={sem}
                    className="rounded-2xl border border-transparent overflow-hidden"
                    style={{
                      background: "#1c1c22",
                      boxShadow: "6px 6px 18px rgba(0,0,0,0.45), inset -4px -4px 8px rgba(0,0,0,0.55), inset 2px 2px 4px rgba(255,255,255,0.05)",
                    }}
                  >
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
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[22px] gap-4 border border-transparent"
                                style={{
                                  background: "#1c1c22",
                                  boxShadow: "6px 6px 18px rgba(0,0,0,0.45), inset -4px -4px 8px rgba(0,0,0,0.55), inset 2px 2px 4px rgba(255,255,255,0.05)",
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  {(() => {
                                    const [prefix, ...suffixParts] = c.code.split(" ");
                                    const formattedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase();
                                    const suffix = suffixParts.join(" ");
                                    return (
                                      <div
                                        className="inline-flex flex-col items-center justify-center rounded-xl px-3 py-1 font-space-mono text-center min-w-[75px]"
                                        style={{
                                          background: "rgba(163,230,53,0.06)",
                                          border: "1px solid rgba(163,230,53,0.15)",
                                          boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.1), inset -2px -2px 4px rgba(0,0,0,0.5), 0 4px 10px rgba(163,230,53,0.05)",
                                        }}
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
                                        ? {
                                            background: "linear-gradient(135deg, rgba(163, 230, 53, 0.85) 0%, rgba(163, 230, 53, 0.45) 100%)",
                                            boxShadow: "0 6px 15px rgba(163, 230, 53, 0.35), inset 0 2.5px 3px rgba(255, 255, 255, 0.75), inset 0 -2.5px 3px rgba(0, 0, 0, 0.4)",
                                            backdropFilter: "blur(8px)",
                                          }
                                        : {
                                            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
                                            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3), inset 0 2px 2px rgba(255, 255, 255, 0.15), inset 0 -2px 2px rgba(0, 0, 0, 0.5)",
                                            backdropFilter: "blur(8px)",
                                          }
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
                                        ? {
                                            background: "linear-gradient(135deg, rgba(236, 72, 153, 0.85) 0%, rgba(236, 72, 153, 0.45) 100%)",
                                            boxShadow: "0 6px 15px rgba(236, 72, 153, 0.35), inset 0 2.5px 3px rgba(255, 255, 255, 0.75), inset 0 -2.5px 3px rgba(0, 0, 0, 0.4)",
                                            backdropFilter: "blur(8px)",
                                          }
                                        : {
                                            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
                                            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3), inset 0 2px 2px rgba(255, 255, 255, 0.15), inset 0 -2px 2px rgba(0, 0, 0, 0.5)",
                                            backdropFilter: "blur(8px)",
                                          }
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
            <div className="p-6 space-y-4">
              <div className="hidden lg:grid grid-cols-[120px_1fr_80px_160px_90px_100px] gap-4 px-5 pb-3.5 text-[10px] uppercase tracking-widest text-gray-500 font-semibold border-b border-white/[0.04]">
                <div>Course Code</div>
                <div>Course Name</div>
                <div className="text-center">Credits</div>
                <div>Total Score</div>
                <div className="text-center">Grade</div>
                <div className="text-center">Attendance</div>
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
                    className="grid grid-cols-1 lg:grid-cols-[120px_1fr_80px_160px_90px_100px] items-center gap-4 px-5 py-4 rounded-[22px] border border-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(163,230,53,0.04)]"
                    style={{
                      background: "#1c1c22",
                      boxShadow: "6px 6px 18px rgba(0,0,0,0.45), inset -4px -4px 8px rgba(0,0,0,0.55), inset 2px 2px 4px rgba(255,255,255,0.05)",
                    }}
                  >
                    <div className="flex lg:block items-center justify-between">
                      <span className="lg:hidden text-[10px] uppercase tracking-wider text-gray-500 font-medium">Code</span>
                      {(() => {
                        const [prefix, ...suffixParts] = c.code.split(" ");
                        const formattedPrefix = prefix.charAt(0).toUpperCase() + prefix.slice(1).toLowerCase();
                        const suffix = suffixParts.join(" ");
                        return (
                          <div
                            className="inline-flex flex-col items-center justify-center rounded-xl px-3.5 py-1.5 font-space-mono text-center min-w-[80px]"
                            style={{
                              background: "rgba(163,230,53,0.06)",
                              border: "1px solid rgba(163,230,53,0.15)",
                              boxShadow: "inset 1px 1px 2px rgba(255,255,255,0.1), inset -2px -2px 4px rgba(0,0,0,0.5), 0 4px 10px rgba(163,230,53,0.05)",
                            }}
                          >
                            <span className="text-[10px] font-bold tracking-wider" style={{ color: "#a3e635" }}>{formattedPrefix}</span>
                            {suffix && <span className="text-[9px] font-bold mt-0.5" style={{ color: "#a3e635", opacity: 0.8 }}>{suffix}</span>}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex lg:block items-center justify-between border-t border-white/[0.02] pt-2 lg:pt-0 lg:border-none">
                      <span className="lg:hidden text-[10px] uppercase tracking-wider text-gray-500 font-medium">Name</span>
                      <span className="text-sm text-gray-200 font-medium text-right lg:text-left">{c.name}</span>
                    </div>

                    <div className="flex lg:block items-center justify-between border-t border-white/[0.02] pt-2 lg:pt-0 lg:border-none">
                      <span className="lg:hidden text-[10px] uppercase tracking-wider text-gray-500 font-medium">Credits</span>
                      <span className="text-sm font-space-mono text-gray-400 block w-full lg:text-center">{c.credits}</span>
                    </div>

                    <div className="flex lg:block items-center justify-between border-t border-white/[0.02] pt-2 lg:pt-0 lg:border-none">
                      <span className="lg:hidden text-[10px] uppercase tracking-wider text-gray-500 font-medium">Total</span>
                      <div className="flex items-center gap-2">
                        <span className="font-space-mono text-sm text-white font-bold">{pct}%</span>
                        <div
                          className="w-16 h-1.5 rounded-full overflow-hidden"
                          style={{
                            background: "rgba(0,0,0,0.4)",
                            boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.5), inset -1px -1px 2px rgba(255,255,255,0.02)"
                          }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${pct}%`, background: lc, boxShadow: "inset 0.5px 0.5px 1px rgba(255,255,255,0.25)" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:block items-center justify-between border-t border-white/[0.02] pt-2 lg:pt-0 lg:border-none">
                      <span className="lg:hidden text-[10px] uppercase tracking-wider text-gray-500 font-medium">Grade</span>
                      <div className="lg:text-center w-full">
                        <span
                          className="text-xs font-space-mono font-bold px-3 py-1 rounded-xl shadow-[inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.25),_inset_1px_1px_2px_rgba(255,255,255,0.15)] border select-none"
                          style={{ color: lc, background: `${lc}18`, borderColor: `${lc}35` }}
                        >
                          {letter}
                        </span>
                      </div>
                    </div>

                    <div className="flex lg:block items-center justify-between border-t border-white/[0.02] pt-2 lg:pt-0 lg:border-none">
                      <span className="lg:hidden text-[10px] uppercase tracking-wider text-gray-500 font-medium">Attendance</span>
                      <div className="lg:text-center w-full">
                        {hasAttendance ? (
                          <span className={`text-sm font-space-mono font-bold ${attendancePct >= 90 ? "text-neon" : attendancePct >= 75 ? "text-amber-400" : "text-red-400"}`}>
                            {attendancePct}%
                          </span>
                        ) : (
                          <span className="text-gray-600 font-space-mono text-sm">—</span>
                        )}
                      </div>
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
