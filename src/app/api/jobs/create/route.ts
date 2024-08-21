import { supabase } from "@/lib/superbase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { personData, jobData } = await req.json();

    // Perform both inserts concurrently
    const [contactResult, jobsResult] = await Promise.all([
      supabase
        .from("contact")
        .insert([
          {
            full_name: personData.full_name,
            email: personData.email,
            phone_number: personData.phone_number,
            user_id: jobData.user_id,
          },
        ])
        .select(),
      supabase
        .from("jobs")
        .insert([
          {
            job_title: jobData.job_title,
            job_desc: jobData.job_desc,
            user_id: jobData.user_id,
            remote: jobData.remote,
            full_time: jobData.full_time,
            country: jobData.country,
            state: jobData.state,
            city: jobData.city,
            salary: jobData.salary,
            job_icon: jobData.job_icon,
            company_id: jobData.company_id,
          },
        ])
        .select(),
    ]);

    const { data: contact, error: contactError } = contactResult;
    const { data: jobs, error: jobError } = jobsResult;

    // Check for errors and return appropriate response
    if (contactError || jobError) {
      return NextResponse.json({
        status: 400,
        message: "There was an error creating the contact or job",
        errors: { contactError, jobError },
      });
    }

    // Success response
    return NextResponse.json({
      status: 201,
      message: "Job and contact created successfully",
      data: { contact, jobs },
    });
  } catch (error) {
   
    if(error instanceof Error){
      return NextResponse.json({
        status: 500,
        message: "An unexpected error occurred",
        error: error.message,
      });
    }
  }
}
