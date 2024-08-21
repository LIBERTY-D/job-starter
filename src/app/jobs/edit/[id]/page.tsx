"use client";

import { useUser } from "@/context/usercontext/UserContext";
import {
  Button,
  RadioGroup,
  TextArea,
  TextField,
  Theme,
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { MdOutlineFileDownload } from "react-icons/md";
import { ToastError } from "@/components/ToastError";
import { ConvertToBase64 } from "@/utils/ConvertToBase64";
import axios from "axios";
import { JobType } from "@/app/page";
import Toast from "@/components/Toast";

type Props = {
  params: {
    id: string;
  };
};

type Contact = {
  contact_id: number;
  created_at: string;
  full_name: string;
  email: string;
  phone_number: string;
  user_id: number;
};

export default function NewJob(props: Props) {
  const [country, setCountry] = useState(0);
  const [state, setState] = useState(0);
  const [_, setCity] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitted, setIsubmitted] = useState<boolean>(false);
  const { user } = useUser();
  const [job, setJob] = useState<JobType & { contact: Contact }>();
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, message: "", type: "error" });
  const [jobData, setJobData] = useState<{
    job_title: string;
    job_desc: string;
    user_id: number;
    remote: "onsite" | "hybrid" | "remote" | "";
    full_time: "project" | "part" | "full" | "";
    country: string;
    state: string;
    city: string;
    salary: string;
    job_icon: string;
    company_id: number;
    job_id: number;
  }>({
    job_title: job?.job_title!!,
    job_desc: job?.job_desc!!,
    user_id: user?.id!!,
    remote: job?.remote!!,
    full_time: job?.full_time!!,
    country: job?.country!!,
    state: job?.state!!,
    city: job?.city!!,
    salary: job?.salary!!,
    job_icon: job?.job_icon!!,
    job_id: job?.job_id!!,
    company_id: job?.company_id.company_id!!,
  });

  const [personData, setPersonData] = useState<{
    full_name: string;
    email: string;
    phone_number: string;
    user_id: number;
    contact_id: number;
  }>({
    full_name: job?.contact?.full_name!!,
    email: job?.contact?.email!!,
    phone_number: job?.contact?.phone_number!!,
    user_id: user?.id!!,
    contact_id: job?.contact?.contact_id!!,
  });

  const upload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const base64 = await ConvertToBase64(e.target.files[0]);
      setJobData((prevState) => {
        {
          return { ...prevState, job_icon: base64  as string};
        }
      });
    }
  };

  const handlePersonData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
        user_id: user?.id as number,
      };
    });
  };

  const handleJobData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setJobData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
        user_id: user?.id as number,
      };
    });
  };

  const handleRadioChange = (field: string, value: string) => {
    setJobData((prevState) => {
      return { ...prevState, [field]: value };
    });
  };
  const handleSubmit = async (_: React.MouseEvent<HTMLButtonElement>) => {
    if (
      jobData.job_title == "" ||
      jobData.job_desc == "" ||
      jobData.user_id < 0 ||
      jobData.remote == "" ||
      jobData.full_time == "" ||
      jobData.country == "" ||
      jobData.state == "" ||
      jobData.city == "" ||
      jobData.salary == "" ||
      jobData.job_icon == "" ||
      personData.email == "" ||
      personData.full_name == "" ||
      personData.phone_number == "" ||
      personData.user_id <= 0 ||
      !jobData.company_id ||
      jobData.company_id < 0
    ) {
      setToast({ show: true, message: "fields can't be empty", type: "error" });
    } else {
      try {
        setIsubmitted(true);
        const { data } = await axios.patch(
          "/api/jobs/update",
          {
            personData: {
              ...personData,
            },
            jobData: {
              ...jobData,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (data.status == 200) {
          setToast({ message: "update success", show: true, type: "success" });
          setIsubmitted(false);
        }

        if (data.status == 400) {
          setIsubmitted(false);

          setToast({ message: data.message, show: true, type: "error" });
        }
      } catch (error) {
        setToast({
          message: "retry again there was an error",
          show: true,
          type: "error",
        });
        setIsubmitted(false);
      }
    }
  };

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(
          `/api/jobs/findOne?id=${props.params.id}`
        );

        setJob({ ...data.job, ...data.job[0] });
        setJobData({
          ...data.job[0],
          ...data.job,
        });
      } catch (error) {
        setToast({
          message: "failed to retrieve data",
          show: true,
          type: "error",
        });
      }
    };
    if (props.params.id) {
      fetchJob();
    }
  }, [props.params.id]);

  const closeToast = (e: React.MouseEvent<HTMLButtonElement>) => {
    setToast({ message: "", show: false, type: "error" });
  };
  return (
    <>
      {toast.show && (
        <Toast onClose={closeToast} message={toast.message} type={toast.type} />
      )}
      <Theme className="border shadow-lg rounded-md">
        <form className="container mt-6 flex flex-col gap-4" method="POST">
          <TextField.Root
            placeholder="job title"
            defaultValue={job?.job_title}
            name="job_title"
            onChange={handleJobData}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex flex-col gap-3">
              <h1>Job Icon</h1>
              <div className="border rounded-md flex items-center justify-center bg-gray-200 p-50 w-50 h-auto">
                {jobData.job_icon && jobData.job_icon.length > 0 ? (
                  <img
                    className="w-fit bg-transparent"
                    src={jobData.job_icon}
                    alt="[icon]"
                  />
                ) : (
                  <img
                    className="w-fit bg-transparent"
                    src={job?.job_icon}
                    alt="[icon]"
                  />
                )}
              </div>
              <input
                type="file"
                ref={fileRef}
                onChange={upload}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileRef.current?.click()}
                variant="soft"
              >
                {" "}
                select file <MdOutlineFileDownload />
              </Button>
            </div>
            <div className="">
              <h1>Contact Person</h1>
              <div className="*:mt-5">
                <TextField.Root
                  placeholder="full name"
                  name="full_name"
                  defaultValue={job?.contact?.full_name}
                  onChange={handlePersonData}
                />
                <TextField.Root
                  defaultValue={job?.contact?.email}
                  onChange={handlePersonData}
                  type="email"
                  placeholder="email"
                  name="email"
                />
                <TextField.Root
                  onChange={handlePersonData}
                  type="tel"
                  defaultValue={job?.contact?.phone_number}
                  placeholder="phone number"
                  name="phone_number"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-between *:flex-grow flex-wrap">
            <div className="flex gap-4 flex-col">
              <h1>Remote ?</h1>
              <RadioGroup.Root
                value={job?.remote}
                name="remote"
                onValueChange={(value) => handleRadioChange("remote", value)}
              >
                <RadioGroup.Item value="onsite">On-Site</RadioGroup.Item>
                <RadioGroup.Item value="hybrid">Hybrid-remote</RadioGroup.Item>
                <RadioGroup.Item value="remote">Remote</RadioGroup.Item>
              </RadioGroup.Root>
            </div>
            <div className="flex gap-4 flex-col">
              <h1>Full time?</h1>
              <RadioGroup.Root
                value={job?.full_time}
                name="full_time"
                onValueChange={(value) => handleRadioChange("full_time", value)}
              >
                <RadioGroup.Item value="project">Project </RadioGroup.Item>
                <RadioGroup.Item value="part">Part-Time</RadioGroup.Item>
                <RadioGroup.Item value="full">Full-Time</RadioGroup.Item>
              </RadioGroup.Root>
            </div>

            <div className="flex gap-4 flex-col">
              <h1>Location?</h1>
              <CountrySelect
                onChange={(e: any) => {
                  setJobData((prevState) => {
                    return { ...prevState, country: e.name };
                  });
                  setCountry(e.id);
                }}
                placeHolder="Select Country"
              />
              <StateSelect
                countryid={country}
                onChange={(e: any) => {
                  setJobData((prevState) => {
                    return { ...prevState, state: e.name };
                  });
                  setState(e.id);
                }}
                placeHolder="Select State"
              />
              <CitySelect
                countryid={country}
                stateid={state}
                onChange={(e: any) => {
                  setJobData((prevState) => {
                    return { ...prevState, city: e.name };
                  });
                  setCity(e.id);
                }}
                placeHolder="Select City"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h1> Salary(per year)</h1>
            <TextField.Root
              name="salary"
              defaultValue={job?.salary}
              onChange={handleJobData}
            >
              <TextField.Slot>zl</TextField.Slot>
            </TextField.Root>
          </div>
          <TextArea
            placeholder="job desc"
            name="job_desc"
            resize="vertical"
            defaultValue={job?.job_desc}
            onChange={handleJobData}
          />
          <div className="my-5">
            <Button
              type="button"
              variant="soft"
              size={"3"}
              disabled={isSubmitted}
              onClick={handleSubmit}
            >
              save
            </Button>
          </div>
        </form>
      </Theme>
    </>
  );
}
