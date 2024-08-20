import { supabase } from "@/lib/superbase";
import { decrypt, encyrpt } from "./encrypt_decrypt";
import { UserResponseDto } from "@/dto/UserResponseDto";


import { cookies } from "next/headers";
import { generateToken } from "./jwt";

export async function signUpUserToSuperBase(
  email: string,
  first_name: string,
  last_name: string,
  password: string
) {
  // SIGNUP USER

  try {
    const data = await supabase.from("users").insert([
      {
        email,
        password: await encyrpt(password),
        "first-name": first_name,
        "last-name": last_name,
      },
    ]);

    if (!data.error && data.statusText === "Created") {
     

      return new Response(
        JSON.stringify(
          new UserResponseDto("user created", [
            {
              email,
              password: await encyrpt(password),
              "first-name": first_name,
              "last-name": last_name,
            },
          ])
        ),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    if (data.error && data.error.code === "23505") {
      return new Response(
        JSON.stringify(new UserResponseDto("email taken,if yours login", [])),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify(new UserResponseDto("uknown error occured", [])),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // END OF SIGN UP
}

export async function LoginUserToSuperBase(email: string, password: string) {
 
  // LOGIN USER
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return new Response(
        JSON.stringify(new UserResponseDto("Invalid email or password", [])),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    const isValidPassword = await decrypt(password, user.password);
    if (!isValidPassword) {
      return new Response(
        JSON.stringify(new UserResponseDto("Invalid email or password", [])),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const sessionToken = generateToken(user.id);
  
    await supabase
      .from("users")
      .update({ session_token: sessionToken })
      .eq("id", user.id);
    const cookie = cookies();
    cookie.set("auth-job-starter", sessionToken, {
      httpOnly: true, // Ensure the cookie is only accessible by the server
      secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/", // Cookie will be accessible on the entire site
      sameSite: "strict", // CSRF protection
    });
    return new Response(
      JSON.stringify(new UserResponseDto("user retrieved", [user])),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify(new UserResponseDto("uknown error occured", [])),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
