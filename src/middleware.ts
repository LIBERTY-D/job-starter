import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "./lib/superbase";
import { decodeToken } from "./utils/jwt";

export async function middleware(req: NextRequest) {
  const next = NextResponse.next();
  const cookie = cookies();
  const cookieObj = cookie.get("auth-job-starter");

  const { pathname } = req.nextUrl;
  if (pathname === "/api/jobs") {
    return next;
  }
  if (cookieObj?.name === "auth-job-starter" && cookieObj.value) {
    //decode token
    const { payload } = await decodeToken(cookieObj.value);
    if (payload.sub) {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", payload.sub)
        .single();
      if (user && error == null) {
        if (user.session_token === cookieObj.value) {
          next.headers.set("user-data", JSON.stringify(user));
          return next;
        } else {
          return NextResponse.redirect(new URL("/login", req.url));
        }
      } else {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/jobs/:path*", "/api/users/user/:path*", "/api/jobs/:path*"],
};
