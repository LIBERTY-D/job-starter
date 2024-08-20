import { supabase } from "@/lib/superbase";

import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { jobId } = await req.json();

    const user = JSON.parse(req.headers.get("user-data")!!);

    const { error } = await supabase.from("jobs").delete().eq("job_id", jobId);
    await supabase.from("contact").delete().eq("user_id", user.id);
    if (error) {
      return NextResponse.json({
        status: 400,
        message: "failed to deleted",
        data: null,
      });
    }
    return NextResponse.json({
      status: 200,
      message: "deleted",
      data: null,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: error?.message,
      data: null,
    });
  }
}
