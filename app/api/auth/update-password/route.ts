import { NextRequest, NextResponse } from "next/server";
import { verifyToken, verifyPassword, hashPassword } from "@/lib/custom-auth";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    let studentId: string | null = null;

    // 1. Get studentId from custom session cookie
    const match = cookieHeader.match(/session=([^;]+)/);
    if (match) {
      const payload = await verifyToken<{ studentId: string }>(match[1]);
      if (payload) {
        studentId = payload.studentId;
      }
    }

    if (!studentId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return NextResponse.json({ error: "Both current and new passwords are required." }, { status: 400 });
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Both current and new passwords are required." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters long." }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get the current password hash
    const { data: hash, error: hashError } = await supabase.rpc("get_student_password_hash", {
      p_student_id: studentId,
    });

    if (hashError || !hash) {
      return NextResponse.json({ error: "Could not verify current password." }, { status: 400 });
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, hash);
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
    }

    // Hash the new password
    const newHash = await hashPassword(newPassword);

    // Update the password hash in the database
    const { error: updateError } = await supabase.rpc("update_student_password", {
      p_student_id: studentId,
      p_new_password_hash: newHash,
    });

    if (updateError) {
      console.error("Error updating password:", updateError);
      return NextResponse.json({ error: "Failed to update password." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update password API error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
