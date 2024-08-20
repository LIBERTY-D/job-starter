"use client";

import { JobType } from "@/app/page";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type HeroProps = {
  temp: JobType[] | null;
  setAllJobs: Dispatch<SetStateAction<JobType[] | null>>;
  searchHandler: (e: React.MouseEvent | React.FormEvent, text: string) => void;
};

export default function Hero({ searchHandler, temp, setAllJobs }: HeroProps) {
  const [searchText, setSearchTetx] = useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTetx(e.target.value);
  };
  useEffect(() => {
    if (searchText == "") {
      setAllJobs(temp);
    }
  }, [searchText]);
  return (
    <>
      <section className="container py-12">
        <h1 className="text-4xl font-bold text-center">
          Job Search Made Easier
        </h1>
        <p className="text-center text-gray-500 py-5">
          JobStarted revolutionizes the job search and posting process by
          offering a streamlined platform that simplifies every step. Whether
          you're an employer looking to post opportunities or a job seeker in
          pursuit of your next role, JobStarted's intuitive interface and
          powerful features ensure a seamless experience. We connect talent with
          opportunity faster and more efficiently, making job searching and
          posting not just easier, but smarter
        </p>
        <form
          className="flex gap-2"
          onSubmit={(e) => searchHandler(e, searchText)}
        >
          <input
            type="search"
            value={searchText}
            className="border-gray-400 w-full py-2 px-4"
            placeholder="Search by phrase"
            onChange={handleChange}
          />

          <button
            type="button"
            className="bg-blue-600 text-white py-2 px-4 rounded-md"
            onClick={(e) => {
              searchHandler(e, searchText);
            }}
          >
            search
          </button>
        </form>
      </section>
    </>
  );
}
