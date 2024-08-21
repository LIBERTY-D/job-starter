"use client";
import Form from "@/components/Form";
import { ToastError } from "@/components/ToastError";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const [userData, setUserData] = useState<{
    email: string;
    password: "";
    "first-name": string;
    "last-name": string;
  }>({
    email: "",
    password: "",
    "first-name": "",
    "last-name": "",
  });
  const [err, setErr] = useState<{ isErr: boolean; message: string }>({
    isErr: false,
    message: "",
  });
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    setUserData((prevState) => {
      return { ...prevState, [input.name]: input.value };
    });
  };
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setErr({ isErr: false, message: "" });
    if (
      userData.email == "" ||
      userData["first-name"] == "" ||
      userData["last-name"] == "" ||
      userData.password == ""
    ) {
      setErr({ isErr: true, message: "All fields are required" });
    } else {
      setErr({ isErr: false, message: "" });
      try {
        const formData = new FormData();
        formData.set("email", userData.email);
        formData.set("password", userData.password);
        formData.set("last-name", userData["last-name"]);
        formData.set("first-name", userData["first-name"]);
        formData.set("type", "signup");

        const post = await axios.post("/api/users/create", formData);
        if (post.status == 201) {
          router.replace("/login");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response && error.response.status > 200) {
            setErr({ isErr: true, message: error.response.data.message });
          }
        } else {
          setErr({ isErr: true, message: "an unknown error occured" });
        }
      }
    }
  };
  return (
    <main className="mt-40">
      {err.isErr && (
        <>
          <ToastError setErr={setErr} err={err} />
        </>
      )}
      <Form
        type="SIGNUP"
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
    </main>
  );
}
