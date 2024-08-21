"use client";

import { JobType } from "@/app/page";
import JobDetail from "@/components/JobDetail";
import { Loading } from "@/components/Loading";
import axios from "axios";
import { useEffect, useState } from "react";

type JobPageProps = {
  params: {
    id: number;
  };
};
export default function JobPage({ params }: JobPageProps) {
  const [job, setJob] = useState<JobType | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/api/jobs/findOne?id=${params.id}`);

        if (data.status === 200) {
          setIsFetching(false);
          setJob({ ...data.job, ...data.job[0] });
        }
      } catch (error) {
        setIsFetching(true);
      }
    };
    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  return (
    <div className=" bg-gray-100 min-h-screen">
      {isFetching ? <Loading /> : <JobDetail job={job} />}
    </div>
  );
}
