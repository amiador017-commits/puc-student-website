"use client";
import { useState, useEffect } from "react";
import { Award, BookOpen, Activity, MoreHorizontal, TrendingUp } from "lucide-react";
import CourseCard from "../components/CourseCard";
import NotificationsPanel from "../components/NotificationsPanel";
import { SEMESTERS, calculateGPA, type Course, mapDbRowsToCourses } from "../lib/mockData";
import { createClient } from "../lib/supabase";
import { useSession } from "../lib/useSession";
import { getCoursesWithGrades } from "../lib/grades";

function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendDown,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  trendDown?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="p-5 rounded-[26px] relative overflow-hidden"
      style={{
        background: "#1c1c22",
        boxShadow: "8px 8px 24px rgba(0,0,0,0.55), inset -6px -6px 12px rgba(0,0,0,0.65), inset 3px 3px 6px rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{title}</p>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-neon"
          style={{
            background: "rgba(163,230,53,0.1)",
            boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(255,255,255,0.1)",
          }}
        >
          {icon}
        </div>
      </div>
      <p className="font-space-mono text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-gray-500 mb-3">{subtitle}</p>
      <div className={`flex items-center gap-1 text-[11px] font-medium ${trendDown ? "text-red-400" : "text-neon"}`}>
        <TrendingUp size={11} className={trendDown ? "rotate-180" : ""} />
        <span>{trend}</span>
      </div>
    </div>
  );
}

function SemesterPill({
  sem,
  active,
  onClick,
}: {
  sem: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-xl text-xs font-space-mono font-bold transition-all duration-200 ${
        active
          ? "text-space-950"
          : "text-gray-500 hover:text-gray-300"
      }`}
      style={
        active
          ? {
              background: "#a3e635",
              boxShadow: "3px 3px 8px rgba(163,230,53,0.2), inset -2px -2px 4px rgba(0,0,0,0.3), inset 1.5px 1.5px 3px rgba(255,255,255,0.5)",
            }
          : {
              background: "#0b0b0e",
              boxShadow: "inset 3px 3px 6px rgba(0,0,0,0.6), inset -1.5px -1.5px 3px rgba(255,255,255,0.03)",
            }
      }
    >
      S{sem}
    </button>
  );
}

export default function OverviewPage() {
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

  const refreshCourses = async () => {
    if (!session?.studentId) return;
    const supabase = createClient();

    const [{ data: courseRows }, { data: componentRows }] = await Promise.all([
      supabase.from("courses").select("course_id, code, name, semester, credits, instructor"),
      supabase.from("course_assessment_components").select("course_id, component_key, label, max_marks"),
    ]);

    const mapped = mapDbRowsToCourses(courseRows ?? [], componentRows ?? []);
    const withGrades = await getCoursesWithGrades(session.studentId, mapped);
    setCourses(withGrades);
  };

  const currentCourses = courses.filter((c) => c.semester === selectedSemester);
  const cgpa = calculateGPA(courses);
  const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
  const avgAttendance = courses.length > 0
    ? Math.round(courses.reduce((acc, c) => acc + c.grades.attendance, 0) / courses.length)
    : 0;

  return (
    <div className="flex min-h-screen">
      {/* Left column — main content */}
      <div className="flex-1 min-w-0 p-6 md:p-8 space-y-8">
        {/* Header */}
        <header className="mb-8">
          <p className="text-xs text-gray-600 mb-1 font-space-mono tracking-widest uppercase">Dashboards / Overview</p>
          <h1 className="text-2xl font-syne font-bold text-white">
            {session?.name ? `Welcome, ${session.name.split(" ")[0]} 👋` : "Overview"}
          </h1>
          {session?.name && (
            <p className="text-xs text-gray-500 mt-1">Here&apos;s your academic overview for Semester {selectedSemester}.</p>
          )}
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="CGPA"
            icon={<Award size={16} />}
            value={cgpa.toFixed(2)}
            subtitle="Cumulative GPA"
            trend="+0.02 vs last sem"
          />
          <StatCard
            title="Credits"
            icon={<BookOpen size={16} />}
            value={String(totalCredits)}
            subtitle="Completed overall"
            trend="+12 this semester"
          />
          <StatCard
            title="Attendance"
            icon={<Activity size={16} />}
            value={`${avgAttendance}%`}
            subtitle="Average this semester"
            trend="-2% vs last sem"
            trendDown
          />
        </section>

        {/* Course section */}
        <section
          className="rounded-[26px] p-6"
          style={{
            background: "#121216",
            boxShadow: "10px 10px 30px rgba(0,0,0,0.5), inset -6px -6px 12px rgba(0,0,0,0.7), inset 3px 3px 6px rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-syne font-bold text-white">Course Progression</h2>
            <MoreHorizontal size={18} className="text-gray-600" />
          </div>

          {/* Semester filter */}
          <div className="mb-5">
            <p className="text-xs text-gray-600 mb-3">Select Semester</p>
            <div className="flex flex-wrap gap-2">
              {SEMESTERS.map((sem) => (
                <SemesterPill
                  key={sem}
                  sem={sem}
                  active={selectedSemester === sem}
                  onClick={() => setSelectedSemester(sem)}
                />
              ))}
            </div>
          </div>

          {/* Course grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {currentCourses.map((course) => (
              <CourseCard key={course.courseId} course={course} onGradesUpdate={refreshCourses} />
            ))}
          </div>
        </section>
      </div>

      {/* Right column — notifications panel */}
      <aside
        className="hidden xl:flex flex-col w-80 shrink-0 border-l border-white/[0.04] h-screen sticky top-0 p-6"
        style={{ background: "#0e0e11" }}
      >
        <NotificationsPanel />
      </aside>
    </div>
  );
}