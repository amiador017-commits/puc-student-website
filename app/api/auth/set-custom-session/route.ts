import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createToken, getStudentProfile } from "@/lib/custom-auth";

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
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("student_id")
      .eq("user_id", session.user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "No profile found" }, { status: 404 });
    }

    const token = await createToken(profile.student_id);
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
