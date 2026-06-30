import { createClient } from "./supabase";
import { type Course } from "./mockData";

export interface CustomGrades {
  attendance: number;
  midterm: number;
  final: number;
  classTest?: number;
  [key: string]: number | undefined;
}

// ── Fetch grades from Supabase ────────────────────────────────────────────────

export async function getSavedGrades(
  studentId: string
): Promise<Record<string, Record<string, number>>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("grades")
    .select("course_id, component_key, marks")
    .eq("student_id", studentId);

  if (error || !data) return {};

  // Group by course_id → { component_key: marks }
  const result: Record<string, Record<string, number>> = {};
  for (const row of data) {
    if (!result[row.course_id]) result[row.course_id] = {};
    result[row.course_id][row.component_key] = Number(row.marks);
  }
  return result;
}

// ── Save grades to Supabase (delete + insert per course) ────────────────────

export async function saveSavedGrades(
  studentId: string,
  courseId: string,
  grades: Record<string, number | undefined>
): Promise<void> {
  const supabase = createClient();

  // Delete existing rows for this student+course
  await supabase
    .from("grades")
    .delete()
    .eq("student_id", studentId)
    .eq("course_id", courseId);

  // Build rows for each component_key that has a value
  const rows = Object.entries(grades)
    .filter(([, v]) => v !== undefined)
    .map(([component_key, marks]) => ({
      student_id: studentId,
      course_id: courseId,
      component_key,
      marks: marks as number,
    }));

  if (rows.length === 0) return;

  await supabase.from("grades").insert(rows);
}

// ── Merge DB grades with course list ─────────────────────────────────────────

export async function getCoursesWithGrades(
  studentId: string | undefined,
  defaultCourses: Course[]
): Promise<Course[]> {
  if (!studentId) return defaultCourses;

  const saved = await getSavedGrades(studentId);

  return defaultCourses.map((course) => {
    const custom = saved[course.courseId];
    if (custom) {
      return {
        ...course,
        grades: {
          ...course.grades,
          ...custom,
        },
      };
    }
    return course;
  });
}
