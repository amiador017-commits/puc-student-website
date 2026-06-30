import { NextResponse } from "next/server";
import { verifyToken, getStudentProfile } from "@/lib/custom-auth";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/session=([^;]+)/);
  if (!match) {
    return NextResponse.json(null, { status: 401 });
  }

  const payload = await verifyToken<{ studentId: string }>(match[1]);
  if (!payload) {
    return NextResponse.json(null, { status: 401 });
  }

  const profile = await getStudentProfile(payload.studentId);
  if (!profile) {
    return NextResponse.json(null, { status: 401 });
  }

  return NextResponse.json(profile);
}