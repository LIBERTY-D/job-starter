"use client"

import { JobType } from "@/app/page";
import JobDetail from "@/components/JobDetail";
import axios from "axios";
import { useEffect, useState } from "react";

type JobPageProps= {
    params:{
        id:number
    }
}
export  default function JobPage ({params}:JobPageProps){
     const [job,setJob] =  useState<JobType|null>(null)
     const [err,setErr] =  useState<{isErr:boolean,message:string}>({isErr:false,message:""})
     
    useEffect(() => {
        const fetchJob = async () => {
            try {
              const {data}=  await axios.get(`/api/jobs/findOne?id=${params.id}`)
             
              setJob({...data.job,...data.job[0]})
           
          
            } catch (error) {
              setErr({isErr:true,message:"failed to retrieve data"})
              console.log(error)
            }
    
        };
         if(params.id){
          fetchJob()
      }
    
      }, [params.id]);
   
    return (
      <div className=" bg-gray-100 min-h-screen">
        <JobDetail job={job} />
      </div>
    );
  };