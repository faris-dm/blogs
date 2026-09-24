const Navbar = () => {
  return (
    <nav className="w-full px-4 pt-4 sm:px-6 sm:pt-6 mb-7 lg:px-10">
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
        <div className="flex items-center gap-2 sm:gap-4">
          {/* User Name */}
          <div
            className="
              text-sm font-medium text-gray-700
              sm:text-base
              lg:text-lg
            "
          >
            Hey, User
          </div>

          {/* Profile Image */}
          <div
            className="
              h-9 w-9 overflow-hidden rounded-full
              bg-gray-200 shadow-sm
              sm:h-11 sm:w-11
              lg:h-12 lg:w-12
            "
          >
            <img
              src=""
              alt="User profile"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
