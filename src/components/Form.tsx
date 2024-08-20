import Link from "next/link";

type LoginType = {
  type: "LOGIN" | "SIGNUP";
  handleSubmit: (_: React.MouseEvent<HTMLButtonElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export default function Form({ handleSubmit, handleChange, type }: LoginType) {
  return (
    <main className=" max-w-xl  mx-auto my-50 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-center text-2xl font-bold mb-6">{type}</h1>
      <form className="space-y-6">
        {type == "SIGNUP" && (
          <>
            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex flex-col w-full">
                <label
                  htmlFor="first-name"
                  className="font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="first-name"
                  onChange={handleChange}
                  id="first-name"
                  aria-label="First Name"
                  className="py-2 px-3 outline-none border border-blue-500 rounded-md mt-2 focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div className="flex flex-col w-full mt-4 md:mt-0">
                <label
                  htmlFor="last-name"
                  className="font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="last-name"
                  onChange={handleChange}
                  id="last-name"
                  aria-label="Last Name"
                  className="py-2 px-3 outline-none border border-blue-500 rounded-md mt-2 focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </>
        )}

        <div className="flex flex-col">
          <label htmlFor="email" className="font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={handleChange}
            aria-label="Email"
            className="py-2 px-3 outline-none border border-blue-500 rounded-md mt-2 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            aria-label="password"
            onChange={handleChange}
            className="py-2 px-3 outline-none border border-blue-500 rounded-md mt-2 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <button
          onClick={handleSubmit}
          type="button"
          className="w-full bg-blue-600 rounded-md text-white py-3 mt-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {type}
        </button>
        <div className="border w-fit px-5 py-2 rounded-md">
          <Link
            className=" text-cyan-700"
            href={type == "LOGIN" ? "/sign-up" : "/login"}
          >
            {type == "LOGIN" ? "create account" : "login"}
          </Link>
        </div>
      </form>
    </main>
  );
}
