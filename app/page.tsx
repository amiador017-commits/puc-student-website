import { getServerSession } from "../lib/server-session";
import { getCoursesWithGradesServer } from "../lib/server-data";
import OverviewClient from "./OverviewClient";

export default async function OverviewPage() {
  const user = await getServerSession();

  if (user) {
    const courses = await getCoursesWithGradesServer(user.studentId);
    return <OverviewClient initialUser={user} initialCourses={courses} />;
  }

  return <OverviewClient initialUser={null} initialCourses={[]} />;
}
