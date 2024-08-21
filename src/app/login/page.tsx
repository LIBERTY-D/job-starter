"use client";

import Form from "@/components/Form";
import { ToastError } from "@/components/ToastError";
import { useUser } from "@/context/usercontext/UserContext";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [userData, setUserData] = useState<{ email: string; password: "" }>({
    email: "",
    password: "",
  });
  const [err, setErr] = useState<{ isErr: boolean; message: string }>({
    isErr: false,
    message: "",
  });

  const { setUser } = useUser();

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    setUserData((prevState) => {
      return { ...prevState, [input.name]: input.value };
    });
  };
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setErr({ isErr: false, message: "" });
    if (userData.email == "" || userData.password == "") {
      setErr({ isErr: true, message: "All fields are required" });
    } else {
      try {
        setErr({ isErr: false, message: "" });
        const formData = new FormData();
        formData.set("email", userData.email);
        formData.set("password", userData.password);
        formData.set("type", "login");
        const { data, status } = await axios.post(
          "/api/users/create",
          formData
        );
        if (status == 200) {
          setUser(data.data[0]);
          router.push("/");
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
        type="LOGIN"
        handleSubmit={handleSubmit}
        handleChange={handleChange}
      />
    </main>
  );
}
