"use client";
import { useState, useEffect } from "react";
import {
  Award,
  BookOpen,
  Activity,
  MoreHorizontal,
  TrendingUp,
  History,
  PieChart,
  Percent,
  Clock,
  Trophy,
  AlertTriangle,
  RotateCcw,
  Layers,
} from "lucide-react";
import CourseCard from "../components/CourseCard";
import NotificationsPanel from "../components/NotificationsPanel";
import { SEMESTERS, calculateGPA, getCourseTotalAndMax, type Course, mapDbRowsToCourses } from "../lib/mockData";
import { createClient } from "../lib/supabase";
import { useSession } from "../lib/useSession";
import { getCoursesWithGrades } from "../lib/grades";
import type { SessionUser } from "../lib/server-session";

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

function AcademicCard({
  title,
  value,
  subtitle,
  icon,
  glowColor = "rgba(163,230,53,0.1)",
  iconColor = "text-neon",
}: {
  title: string;
  value: string;
  subtitle: string | React.ReactNode;
  icon: React.ReactNode;
  glowColor?: string;
  iconColor?: string;
}) {
  return (
    <div
      className="p-5 rounded-[26px] relative overflow-hidden flex flex-col justify-between min-h-[140px]"
      style={{
        background: "#1c1c22",
        boxShadow: "8px 8px 24px rgba(0,0,0,0.55), inset -6px -6px 12px rgba(0,0,0,0.65), inset 3px 3px 6px rgba(255,255,255,0.06)",
      }}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">{title}</p>
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconColor}`}
            style={{
              background: glowColor,
              boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(255,255,255,0.1)",
            }}
          >
            {icon}
          </div>
        </div>
        <p className="font-space-mono text-2xl font-bold text-white mb-1">{value}</p>
      </div>
      <div className="text-xs text-gray-500 font-medium truncate mt-2">{subtitle}</div>
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

export default function OverviewClient({
  initialUser,
  initialCourses,
}: {
  initialUser: SessionUser | null;
  initialCourses: Course[];
}) {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [dataFetched, setDataFetched] = useState(initialCourses.length > 0);
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

  const [selectedRetakeIds, setSelectedRetakeIds] = useState<string[]>([]);
  const [selectedRecourseIds, setSelectedRecourseIds] = useState<string[]>([]);

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

  const currentCourses = courses.filter((c) => c.semester === selectedSemester);
  const cgpa = calculateGPA(courses);
  const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
  const avgAttendance = courses.length > 0
    ? Math.round(courses.reduce((acc, c) => acc + c.grades.attendance, 0) / courses.length)
    : 0;

  const S = session?.semester || initialUser?.semester || 1;
  const ongoingCourses = courses.filter((c) => c.semester === S);
  const ongoingCGPA = ongoingCourses.length > 0 ? calculateGPA(ongoingCourses) : 0;
  const prevCourses = courses.filter((c) => c.semester < S);
  const prevSemCGPA = prevCourses.length > 0 ? calculateGPA(prevCourses) : 0;

  let sumCGPA = 0;
  let countSem = 0;
  for (let i = 1; i < S; i++) {
    const coursesUpToI = courses.filter((c) => c.semester <= i);
    if (coursesUpToI.length > 0) {
      sumCGPA += calculateGPA(coursesUpToI);
      countSem++;
    }
  }
  const averageCGPA = countSem > 0 ? sumCGPA / countSem : 0;

  const totalAttendance = courses.length > 0
    ? Math.round(courses.reduce((acc, c) => acc + (c.grades.attendance || 0), 0) / courses.length)
    : 0;

  const ongoingAttendance = ongoingCourses.length > 0
    ? Math.round(ongoingCourses.reduce((acc, c) => acc + (c.grades.attendance || 0), 0) / ongoingCourses.length)
    : 0;

  const coursePerformance = courses
    .map((c) => {
      const { total, max } = getCourseTotalAndMax(c);
      const pct = max > 0 ? (total / max) * 100 : 0;
      return { course: c, pct, max };
    })
    .filter((cp) => cp.max > 0);

  const bestCourse = coursePerformance.length > 0
    ? coursePerformance.reduce((prev, curr) => (curr.pct > prev.pct ? curr : prev)).course
    : null;

  const worstCourse = coursePerformance.length > 0
    ? coursePerformance.reduce((prev, curr) => (curr.pct < prev.pct ? curr : prev)).course
    : null;

  const retakeCourses = courses.filter((c) => selectedRetakeIds.includes(c.courseId));
  const recourseCourses = courses.filter((c) => selectedRecourseIds.includes(c.courseId));

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 min-w-0 p-6 md:p-8 space-y-8">
        <header className="mb-8">
          <p className="text-xs text-gray-600 mb-1 font-space-mono tracking-widest uppercase">Dashboards / Overview</p>
          <h1 className="text-2xl font-syne font-bold text-white">
            {session?.name ? `Welcome, ${session.name.split(" ")[0]} 👋` : "Overview"}
          </h1>
          {session?.name && (
            <p className="text-xs text-gray-500 mt-1">Here&apos;s your academic overview for Semester {selectedSemester}.</p>
          )}
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="On Going Sem's CGPA"
            icon={<Award size={16} />}
            value={ongoingCGPA.toFixed(2)}
            subtitle={`Semester ${S} GPA`}
            trend={S > 1 ? `Semester ${S}` : "First semester"}
          />
          <StatCard
            title="Avg CGPA ( Passed Semester's )"
            icon={<PieChart size={16} />}
            value={averageCGPA.toFixed(2)}
            subtitle={`Average of semesters 1 to ${S - 1}`}
            trend={S > 1 ? "Passed semesters avg" : "No passed semesters"}
          />
          <StatCard
            title="Retakes"
            icon={<RotateCcw size={16} />}
            value={String(retakeCourses.length)}
            subtitle="Selected retake courses"
            trend={retakeCourses.length > 0 ? `${retakeCourses.length} active` : "No active retakes"}
            trendDown={retakeCourses.length === 0}
          />
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-syne font-bold text-white text-lg">Academic Insights</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <AcademicCard
              title="Total Credits"
              value={String(totalCredits)}
              subtitle="Completed overall"
              icon={<BookOpen size={16} />}
              glowColor="rgba(163,230,53,0.1)"
              iconColor="text-neon"
            />
            <AcademicCard
              title="Total Attendance"
              value={`${totalAttendance}%`}
              subtitle="All semesters combined"
              icon={<Percent size={16} />}
              glowColor="rgba(168,85,247,0.1)"
              iconColor="text-purple-400"
            />
            <AcademicCard
              title="Ongoing Attendance"
              value={`${ongoingAttendance}%`}
              subtitle={`Semester ${S} attendance`}
              icon={<Clock size={16} />}
              glowColor="rgba(234,179,8,0.1)"
              iconColor="text-yellow-400"
            />
            <AcademicCard
              title="Best Performing"
              value={bestCourse ? bestCourse.code : "N/A"}
              subtitle={bestCourse ? bestCourse.name : "No grades entered"}
              icon={<Trophy size={16} />}
              glowColor="rgba(163,230,53,0.1)"
              iconColor="text-neon"
            />
            <AcademicCard
              title="Worst Performing"
              value={worstCourse ? worstCourse.code : "N/A"}
              subtitle={worstCourse ? worstCourse.name : "No grades entered"}
              icon={<AlertTriangle size={16} />}
              glowColor="rgba(249,115,22,0.1)"
              iconColor="text-orange-400"
            />
            <AcademicCard
              title="Recourse Courses"
              value={`${recourseCourses.length}`}
              subtitle={
                recourseCourses.length > 0
                  ? recourseCourses.map((c) => c.code).join(", ")
                  : "No recourse courses"
              }
              icon={<Layers size={16} />}
              glowColor="rgba(236,72,153,0.1)"
              iconColor="text-pink-400"
            />
          </div>
        </section>
      </div>

      <aside
        className="hidden xl:flex flex-col w-80 shrink-0 border-l border-white/[0.04] h-screen sticky top-0 p-6"
        style={{ background: "#0e0e11" }}
      >
        <NotificationsPanel />
      </aside>
    </div>
  );
}
