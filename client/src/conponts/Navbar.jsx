import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Navbar = () => {
  // inside the Navbar component
  const [scrolled, setScrolled] = useState(false);
const { user, checkingAuth } = useAuth();
const navigate = useNavigate();

const handleProfileClick = () => {
  if (checkingAuth) return; // /me hasn't answered yet
  navigate(user ? "/user" : "/signup"); // logged in -> profile, guest -> login
};
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll(); // set the right state on first load
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-200 bg-white/80 shadow-sm backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div
        className="
          mx-auto flex max-w-7xl items-center justify-between
          px-2 py-3
          sm:px-4 sm:py-4
          lg:max-w-none lg:px-0
        "
      >
        {/* Logo + Website Name */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logo */}
          <div
            className="
              flex h-9 w-9 items-center justify-center
              rounded-xl bg-gray-900
              text-white shadow-sm
              sm:h-11 sm:w-11
            "
          >
            <span className="text-lg font-bold sm:text-xl">Q</span>
          </div>

          {/* Website Name */}
          <div
            className="
              text-xl font-bold tracking-tight text-gray-900
              sm:text-2xl
              lg:text-3xl
            "
          >
            QUILog
          </div>
        </div>

        {/* User Profile */}
        <button
          type="button"
          onClick={handleProfileClick}
          className="flex items-center gap-3"
        >
          <span className="text-sm font-medium text-gray-900 sm:text-base">
            {user ? `Hey ${user.username}` : "Login"}
          </span>

          <div
            className="
      flex h-9 w-9 items-center justify-center overflow-hidden rounded-full
      bg-gray-200 shadow-sm
      sm:h-11 sm:w-11
      lg:h-12 lg:w-12
    "
          >
            {user?.profile ? (
              <img
                src={user.profile}
                alt={`${user.username} profile`}
                className="h-full w-full object-cover"
              />
            ) : user?.username ? (
              <span className="text-sm font-semibold text-gray-700 sm:text-base">
                {user.username.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="h-5 w-5 text-gray-500 sm:h-6 sm:w-6" />
            )}
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
