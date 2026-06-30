import { getServerSession } from "../../lib/server-session";
import { getCoursesWithGradesServer } from "../../lib/server-data";
import GradesClient from "./GradesClient";

export default async function GradesPage() {
  const user = await getServerSession();

  if (user) {
    const courses = await getCoursesWithGradesServer(user.studentId);
    return <GradesClient initialUser={user} initialCourses={courses} />;
  }

  return <GradesClient initialUser={null} initialCourses={[]} />;
}
