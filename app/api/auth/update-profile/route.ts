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
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("student_id")
          .eq("user_id", session.user.id)
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
    const { name, phone, linkedGmail, semester, section } = body;

    console.log("UPDATE_PROFILE REQUEST:", {
      studentId,
      name,
      phone,
      linkedGmail,
      semester,
      section
    });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase.rpc("update_student_profile", {
      p_student_id: studentId,
      p_name: name ?? null,
      p_phone: phone ?? null,
      p_linked_gmail: linkedGmail ?? null,
      p_semester: semester ?? null,
      p_section: section ?? null,
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