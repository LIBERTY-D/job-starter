import { JobType } from "@/app/page";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);
type JobDetailProps = {
  job: JobType | null;
};
export default function JobDetail({ job }: JobDetailProps) {
  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg mt-5">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{job?.job_title}</h1>
        <p className="text-lg text-gray-700">
          {job?.company_id?.company}- {job?.country}, {job?.city}
        </p>
      </div>

      <div className="mb-6 flex space-x-4 text-gray-600">
        <div>
          <p className="font-semibold">Posted:</p>
          <p>
            {" "}
            <ReactTimeAgo
              date={
                new Date(job?.created_at !== undefined ? job.created_at : 1000)
              }
            />
          </p>
        </div>
        <div>
          <p className="font-semibold">Salary:</p>
          <p>{job?.salary} a year</p>
        </div>
        <div>
          <p className="font-semibold">Job Type:</p>
          <p>{job?.full_time}</p>
        </div>
      </div>

      {/* Job Description */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Job Description
        </h2>
        <p className="text-gray-700">{job?.job_desc}</p>
      </div>

      {/* Apply Button */}
      <div className="text-center mt-8">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Apply Now
        </button>
      </div>
    </div>
  );
}
