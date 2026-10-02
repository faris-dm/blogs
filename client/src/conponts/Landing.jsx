import Icons from "../assets/icons.svg";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function Landing() {
  const { user, checkingAuth } = useAuth();
  const navigate = useNavigate();

  const handleCreateClick = () => {
    if (checkingAuth) return; // /me hasn't answered yet
    if (!user) {
      navigate("/signup"); // guest -> signup
      return;
    }
    navigate("/post"); // logged in -> post page
  };

  return (
    <main
      className="pt-20 sm:pt-24
    min-h-full w-full
    px-4 pb-1 lg:pt-25 md:pt-22
    sm:px-6 
    md:px-10 md:pt-10
    lg:px-20 lg:pt-1
  "
    >
      {/* Title */}
      <section className="flex justify-start pt-10">
        <h1
          className="
      max-w-2xl
      lg:h-10
      text-left
      font-poppins
      text-xl
      font-semibold
      leading-[1.3]
      tracking-[-0.05em]
      text-black
      sm:text-xl
      md:text-3xl
      lg:text-4xl
      xl:text-6xl pb-10
    "
        >
          <span className="whitespace-nowrap pb-1">
            {" "}
            " The secret to getting ahead
          </span>{" "}
          is getting started."
        </h1>
      </section>

      {/* Idea */}
      <section
        className="mx-auto flex w-full max-w-6xl flex-col gap-12 pb-4 mt-1 sm:mt-2 md:mt-3
  md:flex-row md:items-center md:gap-20 lg:gap-80"
      >
        {/* Buttons */}
        <div className="flex w-full max-w-sm flex-col gap-4 md:w-[40%] md:max-w-xs">
          {/* Create Blog */}
          <button
            className="
              group flex w-full gap-5 items-center 
              rounded-2xl border border-gray-300
              bg-gray-200 px-5 py-4
              text-base font-medium text-black
              transition-all duration-300
              hover:-translate-y-1
              hover:bg-gray-300
              hover:shadow-lg
              active:scale-[0.98] mb-5
            "
            onClick={() => handleCreateClick()}
          >
            <span className="text-2xl font-light leading-none transition-transform duration-300 group-hover:rotate-90">
              {" "}
              +
            </span>
            <span className="flex items-center gap-2">
              <span> Create a blog</span>
            </span>
          </button>

          {/* Read Blog */}
          <button
            onClick={() => navigate("/post")}
            className="
              group flex w-70 items-center gap-5
              rounded-2xl border border-gray-300
              bg-white px-5 py-4
              text-base font-medium text-black
              transition-all duration-300
              hover:-translate-y-1
              hover:bg-gray-100
              hover:shadow-lg
              active:scale-[0.98]
            "
          >
            <span className="flex items-center gap-5">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                />
                <circle cx="12" cy="12" r="2.5" />
              </svg>

              <span>Read blog</span>
            </span>
          </button>
        </div>

        {/* Icons */}
        <div
          className="
    flex min-h-[60px] w-full flex-1
    items-center justify-center
    overflow-hidden
    rounded-3xl border border-gray-200
    p-3
    sm:p-4
    md:min-h-[320px]
    md:p-8
    lg:min-h-[100px]
  "
        >
          <img
            src={Icons}
            alt="Icons"
            className="
    h-auto
    w-full
    max-w-[280px]
    object-contain
    sm:max-w-[340px]
    md:w-[400px]
    md:max-w-none
    lg:w-[500px]
  "
          />
        </div>
      </section>
    </main>
  );
}
