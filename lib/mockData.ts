export interface AssessmentComponent {
  key: string;
  label: string;
  max: number;
}

export interface Course {
  courseId: string;
  code: string;
  name: string;
  semester: number;
  credits: number;
  instructor: string;
  grades: {
    midterm: number;
    midtermMax: number;
    final: number;
    finalMax: number;
    attendance: number;
    classTest?: number;
    classTestMax?: number;
    [key: string]: number | undefined;
  };
  assessmentComponents?: AssessmentComponent[];
}

export interface Notification {
  id: string;
  type: "assignment" | "grade" | "announcement" | "message";
  title: string;
  body: string;
  time: string;
}

export interface Message {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
  time: string;
  read: boolean;
}

export interface ScheduleEntry {
  day: string;
  startTime: string;
  endTime: string;
  duration: string;
  courseCode: string;
  courseName: string;
  room: string;
  instructor: string;
  color: string;
}

// ── Semester list ─────────────────────────────────────────────────────────────

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

// ── Pure helper functions (no DB dependency) ──────────────────────────────────

export function getCoursesBySemester(courses: Course[], semester: number): Course[] {
  return courses.filter((c) => c.semester === semester);
}

export function getCourseTotalAndMax(course: Course): { total: number; max: number } {
  if (course.assessmentComponents && course.assessmentComponents.length > 0) {
    let total = 0;
    let max = 0;
    for (const comp of course.assessmentComponents) {
      total += course.grades[comp.key] ?? 0;
      max += comp.max;
    }
    return { total, max };
  }
  return {
    total: course.grades.midterm + course.grades.final,
    max: course.grades.midtermMax + course.grades.finalMax,
  };
}

export function getGradePoint(course: Course): number {
  const { total, max } = getCourseTotalAndMax(course);
  if (max === 0) return 0;
  const pct = (total / max) * 100;
  if (pct >= 80) return 4.00;
  if (pct >= 75) return 3.75;
  if (pct >= 70) return 3.50;
  if (pct >= 65) return 3.25;
  if (pct >= 60) return 3.00;
  if (pct >= 55) return 2.75;
  if (pct >= 50) return 2.50;
  if (pct >= 45) return 2.25;
  if (pct >= 40) return 2.00;
  return 0.00;
}

export function calculateGPA(courses: Course[]): number {
  if (courses.length === 0) return 0;
  let totalPoints = 0;
  let totalCredits = 0;
  for (const c of courses) {
    const { total: totalMarks, max: maxMarks } = getCourseTotalAndMax(c);
    if (maxMarks === 0) continue;
    const gp = getGradePoint(c);
    totalPoints += gp * c.credits;
    totalCredits += c.credits;
  }
  if (totalCredits === 0) return 0;
  return totalPoints / totalCredits;
}

export function getLetterGrade(course: Course): string {
  const { total, max } = getCourseTotalAndMax(course);
  if (max === 0) return "—";
  const pct = (total / max) * 100;
  if (pct >= 80) return "A+";
  if (pct >= 75) return "A";
  if (pct >= 70) return "A-";
  if (pct >= 65) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 55) return "B-";
  if (pct >= 50) return "C";
  if (pct >= 45) return "C-";
  if (pct >= 40) return "D";
  return "F";
}

// ── DB-to-Course mapper (used by pages to convert Supabase rows → Course[]) ──

export function mapDbRowsToCourses(
  courseRows: Array<{
    course_id: string;
    code: string;
    name: string;
    semester: number;
    credits: number;
    instructor: string;
  }>,
  componentRows: Array<{
    course_id: string;
    component_key: string;
    label: string;
    max_marks: number;
  }>
): Course[] {
  return courseRows.map((row) => {
    const comps = componentRows
      .filter((c) => c.course_id === row.course_id)
      .map((c) => ({ key: c.component_key, label: c.label, max: Number(c.max_marks) }));

    const grades: Course["grades"] = {
      midterm: 0,
      midtermMax: 0,
      final: 0,
      finalMax: 0,
      attendance: 0,
    };
    for (const comp of comps) {
      grades[comp.key] = 0;
    }

    return {
      courseId: row.course_id,
      code: row.code,
      name: row.name,
      semester: row.semester,
      credits: Number(row.credits),
      instructor: row.instructor || "—",
      grades,
      assessmentComponents: comps.length > 0 ? comps : undefined,
    };
  });
}

// ── DB-to-ScheduleEntry mapper ────────────────────────────────────────────────

export function mapDbRowsToSchedule(
  rows: Array<{
    day: string;
    start_time: string;
    end_time: string;
    duration: string;
    course_code: string;
    course_name: string;
    room: string;
    instructor: string;
    color: string;
  }>
): ScheduleEntry[] {
  return rows.map((r) => ({
    day: r.day,
    startTime: r.start_time,
    endTime: r.end_time,
    duration: r.duration,
    courseCode: r.course_code,
    courseName: r.course_name,
    room: r.room,
    instructor: r.instructor,
    color: r.color,
  }));
}
