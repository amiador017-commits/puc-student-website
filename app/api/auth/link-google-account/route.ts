import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { verifyToken } from "@/lib/custom-auth";
import { revalidateTag } from "next/cache";

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
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/session=([^;]+)/);
    if (!match) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyToken<{ studentId: string }>(match[1]);
    if (!payload) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const supabase = supabaseFromRequest(request);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated with Google" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("link_google_account", {
      p_student_id: payload.studentId,
      p_linked_gmail: session.user.email,
    });

    const result = data as { success: boolean; error?: string } | null;

    if (error || !result?.success) {
      return NextResponse.json(
        { error: result?.error || error?.message || "Failed to link account" },
        { status: 409 }
      );
    }

    // Invalidate next.js data cache for this student profile
    revalidateTag(`student_profile_${payload.studentId}`, "max");

    return NextResponse.json({ success: true, linkedGmail: session.user.email });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
