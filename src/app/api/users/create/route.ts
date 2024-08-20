import { LoginUserToSuperBase, signUpUserToSuperBase } from "@/utils/auth";
import { NextRequest, NextResponse } from "next/server";




export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const type = formData.get("type");


  if (type == "signup") {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const first_name = formData.get("first-name") as string;
    const last_name = formData.get("last-name") as string;
    return await signUpUserToSuperBase(email, first_name, last_name, password);
  } else if (type == "login") {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    return await LoginUserToSuperBase(email, password);
  }else{
    return NextResponse.json({})
  }

}
