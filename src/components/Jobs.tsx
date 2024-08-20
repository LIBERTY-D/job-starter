"use client";
import { JobType } from "@/app/page";
import Job from "./Job";
import axios from "axios";
import { useUser } from "@/context/usercontext/UserContext";
import {  Dispatch, SetStateAction, useState } from "react";

type JobPropType = {
  jobs: JobType[] | null;

};
export default function Jobs({ jobs }: JobPropType) {
  const { user } = useUser();


  const deleteJob = async (
    _: React.MouseEvent<HTMLSpanElement>,
    id: number
  ) => {
    try {
      const { data } = await axios.delete("/api/jobs/delete", {
        data: {
          jobId: id,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data.status == 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const likeJob = async (_: React.MouseEvent<SVGElement>, id: number, setLike: Dispatch<SetStateAction<boolean>>,liked:boolean) => {
  
    try {
      const { data } = await axios.post(
        "/api/jobs/like",
        { jobId: id, userId: user?.id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.status == 200) {
        if(data.message=="liked"){
          setLike(true)
        }else{
          setLike(false)
        }
           
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gray-100 p-8 rounded-t-3xl my-4 ">
      <h2 className="font-bold mb-4"> Recent jobs</h2>

      <div className="flex flex-col gap-4">
        {jobs &&
          jobs?.map((jb, index) => {
            return (
              <Job
                likeJob={likeJob}
                jb={jb}
                deleteJob={deleteJob}
                key={index}
              />
            );
          })}
      </div>
    </div>
  );
}
