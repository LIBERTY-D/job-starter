import { supabase } from "@/lib/superbase";
import { NextResponse } from "next/server";

export async function GET(){
    

   try {
    let { data: jobs, error } = await supabase
    .from('jobs')
    .select(`
      *,
      company_id (
        *
      )
    `)
    if(error){
        return NextResponse.json({
            status:400,
            message:"failed to retrieve jobs",
            jobs:jobs
        }) 
    }
    return NextResponse.json({
        status:200,
        message:"successfully retrieved jobs",
        jobs:jobs
    })
   } catch (error) {
    

    return NextResponse.json({
        status:400,
        message:error.message

    })
   }
            

}