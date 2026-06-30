"use client";
import { useState, useEffect } from "react";
import { SEMESTERS, calculateGPA, getLetterGrade, getCourseTotalAndMax, type Course, mapDbRowsToCourses } from "../../lib/mockData";
import { TrendingUp, Award } from "lucide-react";
import { createClient } from "../../lib/supabase";
import { useSession } from "../../lib/useSession";
import { getCoursesWithGrades } from "../../lib/grades";

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

export default function GradesPage() {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [courses, setCourses] = useState<Course[]>([]);
  const session = useSession();

  useEffect(() => {
    if (!session) return;

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
    }

    fetchData();
  }, [session?.studentId]);

  const semCourses = courses.filter((c) => c.semester === selectedSemester);
  const semGPA = calculateGPA(semCourses);
  const cgpa = calculateGPA(courses);

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs text-gray-600 mb-1 font-space-mono tracking-widest uppercase">Dashboards / Grades</p>
        <h1 className="text-2xl font-syne font-bold text-white">Grades</h1>
        <p className="text-sm text-gray-500 mt-1">Academic performance across all semesters</p>
      </header>

      {/* GPA summary cards */}
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

      {/* Semester selector + grades table */}
      <div
        className="rounded-[26px] overflow-hidden"
        style={{
          background: "#121216",
          boxShadow: "10px 10px 30px rgba(0,0,0,0.5), inset -6px -6px 12px rgba(0,0,0,0.7), inset 3px 3px 6px rgba(255,255,255,0.04)",
        }}
      >
        {/* Top bar */}
        <div className="px-6 py-5 border-b border-white/[0.04]">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <h2 className="font-syne font-bold text-white">Grade Report</h2>
            <div className="flex flex-wrap gap-2">
              {SEMESTERS.map((sem) => (
                <SemesterButton
                  key={sem}
                  sem={sem}
                  active={selectedSemester === sem}
                  onClick={() => setSelectedSemester(sem)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {["Course Code", "Course Name", "Credits", "Midterm", "Final", "Total", "Grade", "Attendance"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-left text-[10px] uppercase tracking-widest text-gray-600 font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {semCourses.map((c) => {
                const letter = getLetterGrade(c);
                const { total, max } = getCourseTotalAndMax(c);
                const pct = max > 0 ? Math.round((total / max) * 100) : 0;
                const lc = letterColor(letter);

                // Midterm and Final displays
                let midtermDisplay = "—";
                let finalDisplay = "—";
                
                if (c.assessmentComponents) {
                  const midComp = c.assessmentComponents.find((comp) => comp.key === "midterm");
                  if (midComp) {
                    midtermDisplay = `${c.grades.midterm}/${midComp.max}`;
                  }
                  const finComp = c.assessmentComponents.find((comp) => comp.key === "final");
                  if (finComp) {
                    finalDisplay = `${c.grades.final}/${finComp.max}`;
                  }
                } else {
                  midtermDisplay = `${c.grades.midterm}/${c.grades.midtermMax}`;
                  finalDisplay = `${c.grades.final}/${c.grades.finalMax}`;
                }

                // Attendance display
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
                  <tr
                    key={c.courseId}
                    className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors"
                  >
                    <td className="px-6 py-4">
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
                            <span className="text-[10px] font-bold tracking-wider" style={{ color: "#a3e635" }}>
                              {formattedPrefix}
                            </span>
                            {suffix && (
                              <span className="text-[9px] font-bold mt-0.5" style={{ color: "#a3e635", opacity: 0.8 }}>
                                {suffix}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200 font-medium">{c.name}</td>
                    <td className="px-6 py-4 text-sm font-space-mono text-gray-400">{c.credits}</td>
                    <td className="px-6 py-4">
                      {midtermDisplay !== "—" ? (
                        <>
                          <span className="font-space-mono text-sm text-white">{midtermDisplay.split('/')[0]}</span>
                          <span className="text-gray-600 text-xs">/{midtermDisplay.split('/')[1]}</span>
                        </>
                      ) : (
                        <span className="text-gray-600 font-space-mono text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {finalDisplay !== "—" ? (
                        <>
                          <span className="font-space-mono text-sm text-white">{finalDisplay.split('/')[0]}</span>
                          <span className="text-gray-600 text-xs">/{finalDisplay.split('/')[1]}</span>
                        </>
                      ) : (
                        <span className="text-gray-600 font-space-mono text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-space-mono text-sm text-white font-bold">{pct}%</span>
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: lc }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-xs font-space-mono font-bold px-2.5 py-1 rounded-lg"
                        style={{ color: lc, background: `${lc}18`, border: `1px solid ${lc}30` }}
                      >
                        {letter}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {hasAttendance ? (
                        <span
                          className={`text-sm font-space-mono font-bold ${
                            attendancePct >= 90 ? "text-neon" : attendancePct >= 75 ? "text-amber-400" : "text-red-400"
                          }`}
                        >
                          {attendancePct}%
                        </span>
                      ) : (
                        <span className="text-gray-600 font-space-mono text-sm">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.04] flex justify-end">
          <p className="text-xs text-gray-500">
            Semester {selectedSemester} GPA:{" "}
            <span className="font-space-mono font-bold text-neon">{semGPA.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
