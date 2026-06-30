import { NextRequest, NextResponse } from "next/server";
import { isValidStudentId } from "@/lib/auth";
import { loginStudent, createToken } from "@/lib/custom-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, password } = body;

    if (!studentId || !isValidStudentId(studentId)) {
      return NextResponse.json({ error: "Invalid Student ID." }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    const result = await loginStudent(studentId.trim(), password);

    if (!result.success) {
      return NextResponse.json({ error: (result as { success: false; error: string }).error }, { status: 401 });
    }

    const token = await createToken(result.studentId);

    const response = NextResponse.json({ success: true });
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
