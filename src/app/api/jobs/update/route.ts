import { supabase } from '@/lib/superbase';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const { personData, jobData } = await req.json();

  console.log(jobData)
    const [contactResult, jobsResult] = await Promise.all([
      supabase
        .from("contact")
        .update([
          {
            full_name: personData.full_name,
            email: personData.email,
            phone_number: personData.phone_number,
            user_id: personData.user?.id,
          },
        ]).eq("contact_id",jobData.contact.contact_id)
        .select(),
      supabase
        .from("jobs")
        .update([
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
            company_id: jobData.company_id.company_id,
          },
        ]).eq("job_id",jobData.job_id)
        .select(),
    ]);

    const { data: contact, error: contactError } = contactResult;
    const { data: job, error: jobError } = jobsResult;
    if (contactError || jobError) {
      return NextResponse.json({
        status: 400,
        message: "There was an error updating the contact or job",
        errors: { contactError, jobError },
      });
    }

    // Success response
    return NextResponse.json({
      status: 200,
      message: "Job and contact updated successfully",
      data: { contact, job },
    });
  } catch (error) {
    // Handle any unexpected errors
    return NextResponse.json({
      status: 500,
      message: "An unexpected error occurred",
      error: error.message,
    });
  }
}
