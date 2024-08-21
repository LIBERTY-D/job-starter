import { supabase } from "@/lib/superbase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { jobId, userId } = await req.json();
  try {
    const { data: job, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("job_id", jobId);

    if (job && job.length > 0 && !error) {
      let liked = job[0].liked;
      if (liked == null || liked.length == 0) {
        liked = [];
        liked.push(userId);

        const { data, error } = await supabase
          .from("jobs")
          .update({ liked: liked })
          .eq("job_id", jobId)
          .select();
        return NextResponse.json({
          status: 200,
          message: "liked",
          data,
        });
      } else if (liked.includes(userId)) {
        liked = liked.filter((id: number) => id !== userId);
        const { data, error } = await supabase
          .from("jobs")
          .update({ liked: liked })
          .eq("job_id", jobId)
          .select();
        return NextResponse.json({
          status: 200,
          message: "disliked",
          data,
        });
      } else {
        liked.push(userId);
        const { data, error } = await supabase
          .from("jobs")
          .update({ liked: liked })
          .eq("job_id", jobId)
          .select();

        return NextResponse.json({
          status: 200,
          message: "liked",
          data,
        });
      }
    }
  } catch (error) {
    return NextResponse.json({
      status: 400,
      message: error?.message,
      data: null,
    });
  }
}
