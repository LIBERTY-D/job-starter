"use client";
import { useUser } from "@/context/usercontext/UserContext";
import { supabase } from "@/lib/superbase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";

export default function CreateNewCompany() {
  
  const {user} =  useUser()
  const router  =  useRouter()
  const [company, setCompany] = useState<{ company: string; user_id: number }>(
    { company: "", user_id: -1 }
  );
  const [err, setErr] = useState<{ isErr: boolean; message: string }>({
    isErr: false,
    message: "",
  });
  
 const [isSubmitted,setIsSubmitted] =  useState<boolean>(false)
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompany((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value , user_id:user!!.id};
    });
  };
  const createCompany = async (e:React.MouseEvent<HTMLButtonElement>) => {
    if (company.company == "" || company.user_id < 0) {
      setErr({ isErr: true, message: "fields cannot be empty" });
    } else {
      const { data, error } = await supabase
        .from("company")
        .insert([{ company: company.company, user_id: company.user_id }])
        .select();
        setIsSubmitted(true)

      if (error) {
        setErr({ isErr: true, message: error.message });
        setIsSubmitted(false)
      } else {
        router.push("/jobs")
        setIsSubmitted(false)
      }
    }
  };


  return (
    <>
    
      <div className="container">
        <h2 className="text-lg font-bold">Create a new company</h2>
        <p className="text-gray-500 mb-5">
          To create a job listing you need to create a company
        </p>
        <form>
          <input
            name="company"
            onChange={handleCompanyChange}
            type="text"
            className="border border-gray-400 rounded-md outline-none mb-2 p-2"
          />
          <button disabled={isSubmitted} onClick={createCompany}  className=" flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-md">
            {" "}
            <Link href="#">Create Company</Link>{" "}
            <FaArrowRight className="h-4" />
          </button>
        </form>
      </div>
    </>
  );
}
