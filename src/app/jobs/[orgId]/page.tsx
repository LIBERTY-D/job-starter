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
import React, { ChangeEvent, useRef, useState } from "react";

// @ts-ignore
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { MdOutlineFileDownload } from "react-icons/md";
import { ToastError } from "@/components/ToastError";
import { ConvertToBase64 } from "@/utils/ConvertToBase64";
import axios from "axios"
import { useRouter } from "next/navigation";

type Props = {
  params: {
    orgId: string;
  };
};
export default function NewJob(props: Props) {
  const [country, setCountry] = useState(0);
  const [state, setState] = useState(0);
  const [city, setCity] = useState(0);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter()
  const [isSubmitted, setIsubmitted] = useState<boolean>(false);
  const { user } = useUser();
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
  }>({
    job_title: "",
    job_desc: "",
    user_id: user?.id!!,
    remote: "hybrid",
    full_time: "full",
    country: "",
    state: "",
    city: "",
    salary: "",
    job_icon: "",
    company_id: parseInt(props.params.orgId),
  });

  const [personData, setPersonData] = useState<{
    full_name: string;
    email: string;
    phone_number: string;
    user_id: number;
  }>({ full_name: "", email: "", phone_number: "", user_id: user?.id!! });

  const [err, setErr] = useState<{ isErr: boolean; message: string }>({
    isErr: false,
    message: "",
  });

  const upload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      const base64 = await ConvertToBase64(e.target.files[0]);
      setJobData((prevState) => {
        {
          return { ...prevState, job_icon: base64 };
        }
      });
    }
  };

  const handlePersonData = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
        user_id: user?.id,
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
        user_id: user?.id,
        company_id: parseInt(props.params.orgId),
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
      setErr({ isErr: true, message: "fields can't be empty" });
    } else {
      try {
        setIsubmitted(true)
        const { data } = await axios.post(
          "/api/jobs/create",
          {
            personData: {
              ...personData,
            },
            jobData: {
              ...jobData,
              company_id: parseInt(props.params.orgId),
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (data.status == 201) {
          setIsubmitted(false)
          setErr({isErr:false,message:""})
          router.push("/")
        }
        if(data.status==400){
          setIsubmitted(false)
          setErr({isErr:true,message:data.message})
        }
      } catch (error) {
        setErr({isErr:true,message:"retry again there was an error"})
        setIsubmitted(false)
      }
    }
  }

  return (
    <>
      {err.isErr && <ToastError setErr={setErr} err={err} />}
      <Theme className="border shadow-lg rounded-md">
        <form className="container mt-6 flex flex-col gap-4" method="POST">
          
          <TextField.Root
            placeholder="job title"
            name="job_title"
            onChange={handleJobData}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex flex-col gap-3">
              <h1>Job Icon</h1>
              <div className="border rounded-md flex items-center justify-center bg-gray-200 p-50 w-50 h-auto">
                {jobData.job_icon.length > 0 ? (
                  <img
                    className="w-fit bg-transparent"
                    src={jobData.job_icon}
                    alt="[icon]"
                  />
                ) : (
                  "icon"
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
                  onChange={handlePersonData}
                />
                <TextField.Root
                  onChange={handlePersonData}
                  type="email"
                  placeholder="email"
                  name="email"
                />
                <TextField.Root
                  onChange={handlePersonData}
                  type="tel"
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
                defaultValue="hybrid"
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
                defaultValue="full"
                name="full_time"
                onValueChange={(value) => handleRadioChange("full_time", value)}
              >
                <RadioGroup.Item value="project">Project </RadioGroup.Item>
                <RadioGroup.Item value="part">Part-Time</RadioGroup.Item>
                <RadioGroup.Item value="full">Full time</RadioGroup.Item>
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
            <TextField.Root name="salary" onChange={handleJobData}>
              <TextField.Slot>zl</TextField.Slot>
            </TextField.Root>
          </div>
          <TextArea
            placeholder="job desc"
            name="job_desc"
            resize="vertical"
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
