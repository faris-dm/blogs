import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

  return (
    <main className=" mt-30 px-5 flex items-center justify-center">
      <div className="w-full max-w-md text-center">
        {/* 404 */}
        <h1 className="text-[120px] font-black leading-none tracking-tight text-gray-300 sm:text-[160px]">
          404
        </h1>

        {/* Silver line */}
        <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-gray-400" />

        {/* Title */}
        <h2 className="mt-7 text-2xl font-bold text-gray-800">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
          Sorry, the page you are looking for doesn't exist or may have been
          moved to another location.
        </p>

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-7 rounded-xl bg-gray-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 active:scale-95"
        >
          ← Go Back
        </button>
      </div>
    </main>
  );
}

export default NotFound;
