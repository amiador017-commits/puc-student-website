"use client";
import { useState, useEffect } from "react";
import CourseCard from "../../components/CourseCard";
import { SEMESTERS, calculateGPA, type Course, mapDbRowsToCourses } from "../../lib/mockData";
import { Search, SlidersHorizontal } from "lucide-react";
import { createClient } from "../../lib/supabase";
import { useSession } from "../../lib/useSession";
import { getCoursesWithGrades } from "../../lib/grades";
import type { SessionUser } from "../../lib/server-session";

function SemesterButton({
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
      className={`px-2 md:px-5 py-2 rounded-2xl text-sm font-space-mono font-bold transition-all duration-200 w-full md:w-auto text-center ${
        active ? "text-space-950" : "text-gray-500 hover:text-gray-300"
      }`}
      style={
        active
          ? {
              background: "#a3e635",
              boxShadow: "4px 4px 10px rgba(163,230,53,0.2), inset -2px -2px 4px rgba(0,0,0,0.3), inset 1.5px 1.5px 3px rgba(255,255,255,0.5)",
            }
          : {
              background: "#1c1c22",
              boxShadow: "4px 4px 10px rgba(0,0,0,0.4), inset -3px -3px 6px rgba(0,0,0,0.5), inset 1.5px 1.5px 3px rgba(255,255,255,0.04)",
            }
      }
    >
      <span className="md:hidden">S{sem}</span>
      <span className="hidden md:inline">Semester {sem}</span>
    </button>
  );
}


export default function CoursesClient({
  initialUser,
  initialCourses,
}: {
  initialUser: SessionUser | null;
  initialCourses: Course[];
}) {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [search, setSearch] = useState("");
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

  const filtered = courses.filter(
    (c) =>
      c.semester === selectedSemester &&
      (search === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()))
  );

  const semesterCourses = courses.filter((c) => c.semester === selectedSemester);
  const semesterGPA = calculateGPA(semesterCourses);

  const studentSemester = session?.semester || initialUser?.semester || 1;
  const cumulativeCourses = courses.filter((c) => c.semester <= studentSemester);
  const cumulativeCGPA = calculateGPA(cumulativeCourses);

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <p className="text-xs text-gray-600 mb-1 font-space-mono tracking-widest uppercase">Dashboards / Courses</p>
          <h1 className="text-2xl font-syne font-bold text-white">Courses</h1>
          <p className="text-sm text-gray-500 mt-1">Browse and filter courses by semester</p>
        </div>

        <div
          className="flex items-center gap-6 px-6 py-4 rounded-[22px] border border-white/[0.04]"
          style={{
            background: "#1c1c22",
            boxShadow: "8px 8px 24px rgba(0,0,0,0.55), inset -4px -4px 8px rgba(0,0,0,0.65), inset 2px 2px 4px rgba(255,255,255,0.06)",
          }}
        >
          <div className="text-left">
            <p className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-0.5">Semester {selectedSemester} GPA</p>
            <p className="font-space-mono text-xl font-bold text-neon">{semesterGPA.toFixed(2)}</p>
          </div>
          <div className="h-8 w-px bg-white/[0.08]" />
          <div className="text-left">
            <p className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-0.5">Total CGPA</p>
            <p className="font-space-mono text-xl font-bold text-white">{cumulativeCGPA.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <section
        className="rounded-[26px] p-6 mb-6"
        style={{
          background: "#121216",
          boxShadow: "10px 10px 30px rgba(0,0,0,0.5), inset -6px -6px 12px rgba(0,0,0,0.7), inset 3px 3px 6px rgba(255,255,255,0.04)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="w-full md:w-auto">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-widest font-semibold">Select Semester</p>
            <div className="grid grid-cols-4 gap-2 md:flex md:flex-wrap">
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

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Search course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-52 rounded-2xl py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-neon/30"
              style={{
                background: "#0b0b0e",
                boxShadow: "inset 4px 4px 8px rgba(0,0,0,0.65), inset -2px -2px 4px rgba(255,255,255,0.03)",
              }}
            />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-6 mb-6 px-1">
        <span className="text-sm text-gray-400">
          <span className="font-space-mono font-bold text-white">{filtered.length}</span> courses in Semester {selectedSemester}
        </span>
        <span className="text-gray-700">|</span>
        <span className="text-sm text-gray-400">
          <span className="font-space-mono font-bold text-white">
            {filtered.reduce((acc, c) => acc + c.credits, 0)}
          </span> total credits
        </span>
        <SlidersHorizontal size={14} className="text-gray-600 ml-auto" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 text-sm">No courses found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <CourseCard key={course.courseId} course={course} onGradesUpdate={refreshCourses} />
          ))}
        </div>
      )}
    </div>
  );
}
