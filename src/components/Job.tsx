"use client";
import { JobType } from "@/app/page";
import { useUser } from "@/context/usercontext/UserContext";
import { FaArrowRight, FaRegHeart } from "react-icons/fa";
import ReactTimeAgo from "react-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
import TimeAgo from "javascript-time-ago";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Link from "next/link";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

type JobProps = {
  jb: JobType;
  likeJob: (
    _: React.MouseEvent<SVGElement>,
    id: number,
    setLike: Dispatch<SetStateAction<boolean>>,
    liked: boolean
  ) => Promise<void>;
  deleteJob: (
    e: React.MouseEvent<HTMLSpanElement>,
    id: number
  ) => Promise<void>;
};
export default function Job({ jb: props, deleteJob, likeJob }: JobProps) {
  const { user } = useUser();
  const [liked, setLike] = useState<boolean>(false);

  useEffect(() => {
    setLike(props.liked?.includes(user?.id!!) as boolean);
  }, [props, user]);
  return (
    <>
      <div className="bg-white p-4 rounded-md shadow-lg flex gap-4 relative cursor-pointer">
        <div className="absolute top-2 right-4 cursor-pointer">
          {user && user.session_token && (
            <FaRegHeart
              className={liked ? "text-red-600" : ""}
              onClick={(e) => {
                likeJob(e, props.job_id, setLike, liked);
              }}
            />
          )}
        </div>
        <div className="content-center">
          <img className="size-12" src={props.job_icon} alt="[icon]" />
        </div>
        <div className="grow">
          {/* company name */}
          <div className="text-gray-500">{props.company_id.company}</div>
          {/* position */}
          <div className="font-bold mb-1 text-lg">{props.job_title}</div>

          <div className="*:cursor-pointer mb-5">
            {props.remote} &middot;{props.country}, {props.city}&middot;
            {props.full_time.charAt(0).toUpperCase() + props.full_time.slice(1)}
            -Time{" "}
            <div className="mt-5">
              {user && user.id == props.user_id && (
                <Link
                  href={`/jobs/edit/${props.job_id}`}
                  className="py-2 px-4 border rounded-md text-green-800 "
                >
                  Edit
                </Link>
              )}{" "}
              {user && user.id == props.user_id && (
                <span
                  className="py-2 px-4 border rounded-md text-red-700"
                  onClick={(e) => deleteJob(e, props.job_id)}
                >
                  Delete
                </span>
              )}
            </div>
          </div>
          <Link
            className="flex items-center gap-2 py-2 px-4 border rounded-md w-32"
            href={`/jobs/details/${props.job_id}`}
          >
            details <FaArrowRight />
          </Link>
        </div>
        <div className="content-end text-gray-800 text-sm">
          <ReactTimeAgo date={new Date(props.created_at)} />
        </div>
      </div>
    </>
  );
}
