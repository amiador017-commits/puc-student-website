import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/custom-auth";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/session=([^;]+)/);
    if (!match) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const payload = await verifyToken<{ studentId: string }>(match[1]);
    if (!payload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, linkedGmail, semester, section } = body;

    console.log("UPDATE_PROFILE REQUEST:", {
      studentId: payload.studentId,
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
      p_student_id: payload.studentId,
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

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}