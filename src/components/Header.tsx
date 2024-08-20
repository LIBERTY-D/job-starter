"use client";
import { useUser } from "@/context/usercontext/UserContext";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const { setUser, user } = useUser();
  const router = useRouter();

  const handleLogout = async (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => {
    try {
      const res = await axios.post("/api/users/logout", {
        logout: true,
      });
      if (res.data && res.data.logout && res.status == 200) {
        setUser(null);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header>
      <div className="container flex items-center justify-between py-4 px-6">
        <Link href="/" className="font-bold text-xl">
          Job Starter
        </Link>
        <nav className="flex gap-2 *:py-2 *:px-4 *:rounded-md">
          {user && user.session_token ? (
            <Link className="bg-gray-100" href="#" onClick={handleLogout}>
              Logout
            </Link>
          ) : (
            <Link className="bg-gray-100" href="login">
              Login
            </Link>
          )}

          <Link className="bg-blue-800 text-white" href="/jobs">
            Post Job
          </Link>
        </nav>
      </div>
    </header>
  );
}
