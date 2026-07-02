import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createToken } from "@/lib/custom-auth";

function supabaseFromRequest(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get("cookie") || "";
          return cookieHeader.split(";").filter(Boolean).map((c) => {
            const [name, ...rest] = c.trim().split("=");
            return { name, value: decodeURIComponent(rest.join("=")) };
          });
        },
        setAll() {},
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseFromRequest(request);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated with Google" }, { status: 401 });
    }

    const body = await request.json();
    const { studentId, name, phone, semester, section, department } = body;

    if (!studentId || !name || !semester || !section || !department) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!/^\d{16}$/.test(studentId.trim())) {
      return NextResponse.json({ error: "Invalid Student ID format" }, { status: 400 });
    }

    const googleEmail = session.user.email || "";

    const { data, error } = await supabase.rpc("create_google_student_profile", {
      p_student_id: studentId.trim(),
      p_name: name.trim(),
      p_phone: phone?.trim() || null,
      p_semester: semester,
      p_section: section,
      p_department: department,
      p_linked_gmail: googleEmail,
    });

    const result = data as { success: boolean; error?: string } | null;

    if (error || !result?.success) {
      return NextResponse.json(
        { error: result?.error || error?.message || "Failed to create profile" },
        { status: 409 }
      );
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
