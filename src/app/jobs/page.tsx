"use client";
import CreateListing from "@/components/CreateListing";
import { useUser } from "@/context/usercontext/UserContext";
import { supabase } from "@/lib/superbase";

import { useEffect, useState } from "react";

export default function NewListing() {
  const { user } = useUser();
  const [companies, setCompanies] = useState<
    | [
        {
          company: string;
          company_id: number;
          created_at: string;
          user_id: number;
        }
      ]
    | null
  >(null);
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        let { data: company, error } = await supabase
          .from("company")
          .select("*")
          .eq("user_id", user?.id);
        if (!error) {
          setCompanies(
            company as [
              {
                company: string;
                company_id: number;
                created_at: string;
                user_id: number;
              }
            ]
          );
        }
      } catch (error) {
        // console.log(error)
      }
    };
    if (user) {
      fetchCompanies();
    }
  }, [user]);

  return <CreateListing companies={companies} />;
}
