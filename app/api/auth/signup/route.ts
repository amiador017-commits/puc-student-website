import { NextRequest, NextResponse } from "next/server";
import { isValidStudentId } from "@/lib/auth";
import {
  signupStudent,
  createToken,
} from "@/lib/custom-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, name, phone, semester, section, department, password } = body;

    if (!studentId || !isValidStudentId(studentId)) {
      return NextResponse.json({ error: "Invalid Student ID." }, { status: 400 });
    }
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const result = await signupStudent({
      studentId: studentId.trim(),
      name: name.trim(),
      phone: phone?.trim(),
      semester,
      section,
      department,
      password,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    const token = await createToken(studentId.trim());

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