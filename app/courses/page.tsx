import { getServerSession } from "../../lib/server-session";
import { getCoursesWithGradesServer } from "../../lib/server-data";
import CoursesClient from "./CoursesClient";

export default async function CoursesPage() {
  const user = await getServerSession();

  if (user) {
    const courses = await getCoursesWithGradesServer(user.studentId);
    return <CoursesClient initialUser={user} initialCourses={courses} />;
  }

  return <CoursesClient initialUser={null} initialCourses={[]} />;
}
