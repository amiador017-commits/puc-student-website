"use client";
import { useState, useEffect, useRef } from "react";
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
  X,
} from "lucide-react";
import CourseCard from "../components/CourseCard";
import NotificationsPanel from "../components/NotificationsPanel";
import { SEMESTERS, calculateGPA, getCourseTotalAndMax, type Course, mapDbRowsToCourses, getLetterGrade } from "../lib/mockData";
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
      className="p-3 sm:p-5 rounded-[20px] sm:rounded-[26px] relative overflow-hidden"
      style={{
        background: "#1c1c22",
        boxShadow: "8px 8px 24px rgba(0,0,0,0.55), inset -6px -6px 12px rgba(0,0,0,0.65), inset 3px 3px 6px rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <p className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold truncate mr-1">{title}</p>
        <div
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center text-neon shrink-0 [&_svg]:w-3.5 [&_svg]:h-3.5 sm:[&_svg]:w-4 sm:[&_svg]:h-4"
          style={{
            background: "rgba(163,230,53,0.1)",
            boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(255,255,255,0.1)",
          }}
        >
          {icon}
        </div>
      </div>
      <p className="font-space-mono text-lg sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">{value}</p>
      <p className="text-[9px] sm:text-xs text-gray-500 mb-1.5 sm:mb-3 truncate">{subtitle}</p>
      <div className={`flex items-center gap-1 text-[8px] sm:text-[11px] font-medium ${trendDown ? "text-red-400" : "text-neon"}`}>
        <TrendingUp size={10} className={trendDown ? "rotate-180" : ""} />
        <span className="truncate">{trend}</span>
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
  onClick,
}: {
  title: string;
  value: string;
  subtitle: string | React.ReactNode;
  icon: React.ReactNode;
  glowColor?: string;
  iconColor?: string;
  onClick?: () => void;
}) {
  const isClickable = !!onClick;
  return (
    <div
      onClick={onClick}
      className={`p-3 sm:p-5 rounded-[20px] sm:rounded-[26px] relative overflow-hidden flex flex-col justify-between min-h-[110px] sm:min-h-[140px] ${
        isClickable
          ? "cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          : ""
      }`}
      style={{
        background: "#1c1c22",
        boxShadow: "8px 8px 24px rgba(0,0,0,0.55), inset -6px -6px 12px rgba(0,0,0,0.65), inset 3px 3px 6px rgba(255,255,255,0.06)",
        ...(isClickable ? { border: "1px solid rgba(255,255,255,0.02)" } : {}),
      }}
    >
      <div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-semibold truncate mr-1">{title}</p>
          <div
            className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${iconColor} [&_svg]:w-3.5 [&_svg]:h-3.5 sm:[&_svg]:w-4 sm:[&_svg]:h-4`}
            style={{
              background: glowColor,
              boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(255,255,255,0.1)",
            }}
          >
            {icon}
          </div>
        </div>
        <p className="font-space-mono text-lg sm:text-2xl font-bold text-white mb-0.5 sm:mb-1 truncate">{value}</p>
      </div>
      <div className="text-[10px] sm:text-xs text-gray-500 font-medium truncate mt-1 sm:mt-2">{subtitle}</div>
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
  const [showBestModal, setShowBestModal] = useState(false);
  const [showWorstModal, setShowWorstModal] = useState(false);
  const session = useSession();

  const scrollTarget = useRef(0);
  const scrollAnimFrame = useRef<number | null>(null);

  const handleSmoothWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (scrollAnimFrame.current === null) {
      scrollTarget.current = container.scrollTop;
    }
    scrollTarget.current = Math.max(
      0,
      Math.min(
        container.scrollHeight - container.clientHeight,
        scrollTarget.current + e.deltaY
      )
    );
    e.preventDefault();

    const animate = () => {
      const current = container.scrollTop;
      const diff = scrollTarget.current - current;
      if (Math.abs(diff) > 0.5) {
        container.scrollTop = current + diff * 0.12; // 12% lerp for momentum glide
        scrollAnimFrame.current = requestAnimationFrame(animate);
      } else {
        container.scrollTop = scrollTarget.current;
        scrollAnimFrame.current = null;
      }
    };

    if (scrollAnimFrame.current === null) {
      scrollAnimFrame.current = requestAnimationFrame(animate);
    }
  };

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

  const getBestAndWorstForSemester = (sem: number) => {
    const semCourses = courses.filter((c) => c.semester === sem && c.hasSavedGrades);
    if (semCourses.length === 0) return { best: null, worst: null };

    const perf = semCourses.map((c) => {
      const { total, max } = getCourseTotalAndMax(c);
      const pct = max > 0 ? (total / max) * 100 : 0;
      return { course: c, pct };
    });

    const best = perf.reduce((prev, curr) => (curr.pct > prev.pct ? curr : prev)).course;
    const worst = perf.reduce((prev, curr) => (curr.pct < prev.pct ? curr : prev)).course;

    return { best, worst };
  };

  const { best: bestCourse, worst: worstCourse } = getBestAndWorstForSemester(S);

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

        <section className="grid grid-cols-3 gap-2 sm:gap-5">
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
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
              onClick={() => setShowBestModal(true)}
            />
            <AcademicCard
              title="Worst Performing"
              value={worstCourse ? worstCourse.code : "N/A"}
              subtitle={worstCourse ? worstCourse.name : "No grades entered"}
              icon={<AlertTriangle size={16} />}
              glowColor="rgba(249,115,22,0.1)"
              iconColor="text-orange-400"
              onClick={() => setShowWorstModal(true)}
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

      {/* History Modal */}
      {(showBestModal || showWorstModal) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 cursor-default animate-fade-in"
          onClick={() => {
            setShowBestModal(false);
            setShowWorstModal(false);
          }}
        >
          <div
            className="w-full max-w-lg rounded-[32px] p-6 text-left relative overflow-hidden border border-white/[0.05]"
            style={{
              background: "#121216",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.05)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-syne font-bold text-white">
                  {showBestModal ? "Best Performing Courses" : "Worst Performing Courses"}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Historical performance history across semesters
                </p>
              </div>
              <button
                onClick={() => {
                  setShowBestModal(false);
                  setShowWorstModal(false);
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  boxShadow: "inset -1px -1px 2px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(255,255,255,0.1)",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div
              data-lenis-prevent
              onWheel={handleSmoothWheel}
              className="space-y-3 max-h-[350px] overflow-y-auto pr-1"
              style={{ overscrollBehavior: "contain" }}
            >
              {Array.from({ length: 8 }, (_, i) => i + 1).map((semNum) => {
                const { best, worst } = getBestAndWorstForSemester(semNum);
                const targetCourse = showBestModal ? best : worst;
                
                return (
                  <div
                    key={semNum}
                    className="p-4 rounded-2xl flex items-center justify-between border border-white/[0.02]"
                    style={{
                      background: "#1c1c22",
                      boxShadow: "4px 4px 12px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(255,255,255,0.03)",
                    }}
                  >
                    <div>
                      <p className="text-[10px] font-space-mono text-neon font-bold uppercase tracking-wider">
                        Semester {semNum}
                      </p>
                      {targetCourse ? (
                        <div className="mt-1">
                          <h4 className="text-sm font-syne font-bold text-white flex items-center gap-2">
                            <span>{targetCourse.name}</span>
                            <span className="text-xs font-mono font-normal text-gray-500">
                              ({targetCourse.code})
                            </span>
                          </h4>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Instructor: {targetCourse.instructor}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-600 mt-1 font-medium italic">
                          No grades entered
                        </p>
                      )}
                    </div>

                    {targetCourse && (
                      <div className="text-right">
                        <span
                          className="text-xs font-syne font-bold px-2.5 py-1 rounded-xl"
                          style={{
                            color: showBestModal ? "#a3e635" : "#f97316",
                            background: showBestModal ? "rgba(163,230,53,0.1)" : "rgba(249,115,22,0.1)",
                            border: showBestModal ? "1px solid rgba(163,230,53,0.2)" : "1px solid rgba(249,115,22,0.2)",
                          }}
                        >
                          {getLetterGrade(targetCourse)}
                        </span>
                        <p className="text-[10px] font-space-mono text-gray-500 mt-2">
                          {Math.round((getCourseTotalAndMax(targetCourse).total / getCourseTotalAndMax(targetCourse).max) * 100)}%
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
