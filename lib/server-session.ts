import { cache } from "react";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";
import { verifyToken, getStudentProfile } from "./custom-auth";

export type SessionUser = {
  studentId: string;
  name: string;
  phone?: string;
  semester: number;
  section: string;
  department: string;
  batch: number;
  linkedGmail?: string;
  email?: string;
};

const getCachedProfile = (studentId: string) =>
  unstable_cache(
    async () => getStudentProfile(studentId),
    ["student_profile", studentId],
    { revalidate: 300, tags: [`student_profile_${studentId}`] }
  )();

export const getServerSession = cache(async (): Promise<SessionUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  const payload = await verifyToken<{ studentId: string }>(token);
  if (!payload) return null;
  const profile = await getCachedProfile(payload.studentId);
  if (!profile) return null;
  return {
    studentId: profile.studentId,
    name: profile.name,
    phone: profile.phone,
    semester: profile.semester,
    section: profile.section,
    department: profile.department,
    batch: profile.batch,
    linkedGmail: profile.linkedGmail,
  };
});
