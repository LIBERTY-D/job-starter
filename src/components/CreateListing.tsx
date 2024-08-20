import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

type CreateListingProps = {
  companies:
    | [
        {
          company: string;
          company_id: number;
          created_at: string;
          user_id: number;
        }
      ]
    | null;
};
export default function CreateListing({ companies }: CreateListingProps) {
  return (
    <div className="container">
      <h2 className="text-lg font-bold">Your Companies</h2>
      <p className="text-gray-500 mb-5">
        Select a company from your list of companies to create a Job Post
      </p>
      {companies == null || !companies ? (
        <div className="border bg-gray-500 text-white p-4 rounded-md">
          No companies found
        </div>
      ) : (
        companies.map((company, _) => {
          return (
            <Link
              href={`/jobs/${company.company_id}`}
              key={company.company_id}
              className="border py-2 px-1  mb-5 uppercase text-blue-600 cursor-pointer rounded-md m-auto flex"
            >
              {company.company}
            </Link>
          );
        })
      )}
      <h2 className="text-lg font-bold">Create a new company</h2>
      <p className="text-gray-500 mb-5">
        To create a job listing you need to create a company
      </p>
      <form>
        <button className=" flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-md">
          {" "}
          <Link href="/new-company">Create a new company</Link>{" "}
          <FaArrowRight className="h-4" />
        </button>
      </form>
    </div>
  );
}
