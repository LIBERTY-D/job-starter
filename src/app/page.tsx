"use client";

import Hero from "@/components/Hero";
import Jobs from "@/components/Jobs";
import { Loading } from "@/components/Loading";
import { useUser } from "@/context/usercontext/UserContext";
import axios from "axios";
import { useEffect, useState } from "react";

export type JobType = {
  job_id: number;
  job_title: string;
  company_id: {
    company: string;
    company_id: number;
    name: string;
    user_id: number;
    created_at: string;
  };
  user_id: number;
  country: string;
  state: string;
  city: string;
  full_time: "full" | "part";
  job_desc: string;
  job_icon: string;
  remote: "remote" | "hybrid" | "onsite";
  salary: string;
  created_at: string;
  liked: Array<number> | null;
};
export default function Home() {
  const { user } = useUser();
  const [allJobs, setAllJobs] = useState<JobType[] | null>(null);
  const [temp, setTemp] = useState<JobType[] | null>(null);
  const [isFetching,setIsFetching] =useState<boolean>(true)
  const [err, setErr] = useState<boolean>(false);

  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get("/api/jobs");
        setAllJobs(data.jobs);
        setTemp(data.jobs);
        if(data.status==200){
          setIsFetching(false)
        }
     
      } catch (error) {
        setErr(true);
        setIsFetching(true)
      }
    };
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const searchHandler = (
    e: React.MouseEvent | React.FormEvent,
    text: string
  ) => {
    e.preventDefault();
    const find = allJobs?.filter((job) =>
      job.job_title.toLowerCase().startsWith(text.toLocaleLowerCase())
    );
    setAllJobs(find as JobType[]);
  };
  return (
    <>
      <Hero temp={temp} setAllJobs={setAllJobs} searchHandler={searchHandler} />
        {isFetching?   <Loading/>:   <Jobs jobs={allJobs} /> }
      
      
    </>
  );
}
