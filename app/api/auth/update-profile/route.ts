import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/custom-auth";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    let studentId: string | null = null;

    // 1. Try to get studentId from custom session cookie
    const match = cookieHeader.match(/session=([^;]+)/);
    if (match) {
      const payload = await verifyToken<{ studentId: string }>(match[1]);
      if (payload) {
        studentId = payload.studentId;
      }
    }

    // 2. If not found, try to get it from Supabase session
    if (!studentId) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieHeader.split(";").filter(Boolean).map((c) => {
                const [name, ...rest] = c.trim().split("=");
                return { name, value: decodeURIComponent(rest.join("=")) };
              });
            },
            setAll() {},
          },
        }
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("student_id")
          .eq("user_id", user.id)
          .single();
        if (profile) {
          studentId = profile.student_id;
        }
      }
    }

    if (!studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, semester, section } = body;

    const trimmedName = name == null ? null : typeof name === "string" ? name.trim() : undefined;
    const trimmedPhone = phone == null || phone === "" || (typeof phone === "string" && phone.trim() === "") ? null : typeof phone === "string" ? phone.trim() : undefined;
    const normalizedSemester = semester == null || semester === "" ? null : Number(semester);
    const trimmedSection = section == null ? null : typeof section === "string" ? section.trim() : undefined;

    if (
      trimmedName === undefined ||
      trimmedPhone === undefined ||
      trimmedSection === undefined ||
      (trimmedName !== null && !trimmedName) ||
      (normalizedSemester !== null && (!Number.isInteger(normalizedSemester) || normalizedSemester < 1 || normalizedSemester > 8)) ||
      (trimmedSection !== null && !/^[A-F]$/.test(trimmedSection))
    ) {
      return NextResponse.json({ error: "Invalid profile fields" }, { status: 400 });
    }

    console.log("UPDATE_PROFILE REQUEST");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase.rpc("update_student_profile", {
      p_student_id: studentId,
      p_name: trimmedName,
      p_phone: trimmedPhone,
      p_linked_gmail: null,
      p_semester: normalizedSemester,
      p_section: trimmedSection,
    });

    console.log("UPDATE_PROFILE RPC RESPONSE:", { data, error });

    if (error) {
      console.error("UPDATE_PROFILE ERROR:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Invalidate next.js data cache for this student profile
    revalidateTag(`student_profile_${studentId}`, "max");

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}