import { supabase } from "@/lib/superbase";

import { NextRequest, NextResponse } from "next/server";
import { JobType } from "../../../page";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  try {
    let { data: job, error } = await supabase
      .from("jobs")
      .select(
        `
       *,
       company_id (
         *
       )
     `
      )
      .eq("job_id", id);
    if (error) {
      return NextResponse.json({
        status: 400,
        message: "failed to retrieve jobs",
      });
    }
    job = job as JobType[];
    const { data: contact } = await supabase
      .from("contact")
      .select("*")
      .eq("user_id", job[0].company_id.user_id);

    return NextResponse.json({
      status: 200,
      message: "job found",

      job: {
        ...job,
        contact: contact && contact[0],
      },
    });
  } catch (error) {
    if (error instanceof Error){
      return NextResponse.json({
        status: 400,
        message: error.message,
      });
  }
}
}
