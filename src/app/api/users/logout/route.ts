import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const cookie = cookies();
  cookie.delete("auth-job-starter");

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
