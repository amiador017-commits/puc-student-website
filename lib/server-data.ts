import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createClient as createDirectClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "./supabase-server";
import { mapDbRowsToCourses, mapDbRowsToSchedule, type Course } from "./mockData";

const publicClient = createDirectClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const getCachedCourses = unstable_cache(
  async () => {
    const { data } = await publicClient
      .from("courses")
      .select("course_id, code, name, semester, credits, instructor");
    return data ?? [];
  },
  ["courses"],
  { revalidate: 600, tags: ["courses"] }
);

const getCachedComponents = unstable_cache(
  async () => {
    const { data } = await publicClient
      .from("course_assessment_components")
      .select("course_id, component_key, label, max_marks");
    return data ?? [];
  },
  ["course_components"],
  { revalidate: 600, tags: ["course_components"] }
);

export const getCoursesWithGradesServer = cache(async (
  studentId: string
): Promise<Course[]> => {
  const supabase = await createServerClient();

  const [courseRows, componentRows, { data: gradeRows }] = await Promise.all([
    getCachedCourses(),
    getCachedComponents(),
    supabase
      .from("grades")
      .select("course_id, component_key, marks")
      .eq("student_id", studentId),
  ]);

  const mapped = mapDbRowsToCourses(courseRows ?? [], componentRows ?? []);
  const saved: Record<string, Record<string, number>> = {};
  for (const row of gradeRows ?? []) {
    if (!saved[row.course_id]) saved[row.course_id] = {};
    saved[row.course_id][row.component_key] = Number(row.marks);
  }

  return mapped.map((course) => {
    const custom = saved[course.courseId];
    return custom
      ? { ...course, grades: { ...course.grades, ...custom } }
      : course;
  });
});

export const getScheduleDataServer = cache(async (
  semester: number,
  section: string
) => {
  const supabase = await createServerClient();
  const [{ data: scheduleRows }, { count: totalCourses }] = await Promise.all([
    supabase
      .from("schedules")
      .select(
        "day, start_time, end_time, duration, course_code, course_name, room, instructor, color"
      )
      .eq("semester", semester)
      .eq("section", section),
    supabase
      .from("courses")
      .select("course_id", { count: "exact", head: true })
      .eq("semester", semester),
  ]);
  return {
    scheduleEntries: mapDbRowsToSchedule(scheduleRows ?? []),
    totalCourses: totalCourses ?? 0,
  };
});
