import React, { useState } from "react";
import Icons from "../assets/icons.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// --------------------------------------------------
// API
// --------------------------------------------------

async function loginRequest(data) {
  const res = await fetch(
    "https://personal-blog-mv8w.onrender.com//api/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(typeof json === "string" ? json : "Login failed");
  }

  return json;
}

async function Register(data) {
  const Response = await fetch(
    "https://personal-blog-mv8w.onrender.com//api/signup",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    }
  );

  const json = await Response.json();

  if (!Response.ok) {
    throw new Error(typeof json === "string" ? json : "Registration failed");
  }

  return json;
}

// --------------------------------------------------
// AUTH PAGE
// --------------------------------------------------

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  const Location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const isLogin = mode === "login";

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --------------------------------------------------
  // INPUT CHANGE
  // --------------------------------------------------

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // --------------------------------------------------
  // FORM SUBMIT
  // --------------------------------------------------

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const loginData = {
          email: formData.email,
          password: formData.password,
        };

        const result = await loginRequest(loginData);

        setUser(result.user);
        console.log(result);

        navigate(Location.state?.from || "/post", {
          replace: true,
        });
      } else {
        const registerData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };

        const result = await Register(registerData);

        console.log(result);
        setUser(result.user);

        navigate(Location.state?.from || "/post", {
          replace: true,
        });
      }

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // --------------------------------------------------
  // SWITCH LOGIN / REGISTER
  // --------------------------------------------------

  function switchMode() {
    setMode(isLogin ? "register" : "login");

    setError("");

    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  // --------------------------------------------------
  // BACK BUTTON
  // --------------------------------------------------

  function handleBack() {
    navigate(-1);
  }

  return (
    <main
      className="
        flex
        w-full
        justify-center
        px-4
        py-6
        sm:px-6
        sm:py-8
        md:px-8
        md:py-10
        lg:px-0
        sm:mt-20
        md:mt-17
        lg:mt-20
      "
    >
      {/* Smaller centered auth card */}
      <div
        className="
          flex
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          bg-white
          md:max-w-2xl
          lg:max-w-3xl
          xl:max-w-3xl
          md:border
          md:border-neutral-200
          md:shadow-sm
        "
      >
        {/* FORM SECTION */}

        <section
          className="
            flex
            w-full
            items-center
            justify-center
            px-2
            py-4
            sm:px-6
            sm:py-6
            md:w-1/2
            md:px-7
            md:py-8
            lg:px-8
            lg:py-9
          "
        >
          <div className="w-full max-w-sm">
            {/* BACK BUTTON */}

            <div className="mb-4 md:mb-5">
              <button
                type="button"
                onClick={handleBack}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  px-2
                  py-1.5
                  text-sm
                  font-medium
                  text-neutral-600
                  transition
                  hover:bg-neutral-100
                  hover:text-neutral-900
                  active:scale-95
                "
              >
                <span className="text-lg leading-none">←</span>
                <span>Back</span>
              </button>
            </div>

            {/* TITLE */}

            <div className="mb-5 md:mb-6">
              <h1
                className="
                  text-2xl
                  font-black
                  uppercase
                  tracking-tight
                  text-neutral-900
                  md:text-3xl
                "
              >
                {isLogin ? "Sign In" : "Create Account"}
              </h1>

              <p className="mt-1.5 text-sm text-neutral-500">
                {isLogin ? "Welcome back" : "Create your account"}
              </p>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-3.5 md:space-y-4">
              {/* USERNAME */}

              {!isLogin && (
                <div>
                  <label
                    htmlFor="username"
                    className="mb-1 block text-sm font-medium text-neutral-700"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-neutral-300
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-neutral-900
                      outline-none
                      transition
                      placeholder:text-neutral-400
                      focus:border-neutral-900
                      focus:ring-1
                      focus:ring-neutral-900
                    "
                  />
                </div>
              )}

              {/* EMAIL */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-neutral-700"
                >
                  Email
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="
                    w-full
                    rounded-lg
                    border
                    border-neutral-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-neutral-900
                    outline-none
                    transition
                    placeholder:text-neutral-400
                    focus:border-neutral-900
                    focus:ring-1
                    focus:ring-neutral-900
                  "
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-neutral-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-neutral-300
                      bg-white
                      px-3
                      py-2.5
                      pr-16
                      text-sm
                      text-neutral-900
                      outline-none
                      transition
                      placeholder:text-neutral-400
                      focus:border-neutral-900
                      focus:ring-1
                      focus:ring-neutral-900
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="
                      absolute
                      right-2
                      top-1/2
                      -translate-y-1/2
                      rounded-md
                      px-2
                      py-1
                      text-xs
                      font-medium
                      text-neutral-500
                      hover:bg-neutral-100
                      hover:text-neutral-900
                    "
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}

              {!isLogin && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1 block text-sm font-medium text-neutral-700"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                      className="
                        w-full
                        rounded-lg
                        border
                        border-neutral-300
                        bg-white
                        px-3
                        py-2.5
                        pr-16
                        text-sm
                        text-neutral-900
                        outline-none
                        transition
                        placeholder:text-neutral-400
                        focus:border-neutral-900
                        focus:ring-1
                        focus:ring-neutral-900
                      "
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="
                        absolute
                        right-2
                        top-1/2
                        -translate-y-1/2
                        rounded-md
                        px-2
                        py-1
                        text-xs
                        font-medium
                        text-neutral-500
                        hover:bg-neutral-100
                        hover:text-neutral-900
                      "
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              )}

              {/* LOGIN OPTIONS */}

              {isLogin && (
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-neutral-900"
                    />

                    <span className="text-xs text-neutral-600">
                      Remember me
                    </span>
                  </label>

                  <button
                    type="button"
                    className="
                      text-xs
                      font-medium
                      text-neutral-600
                      underline
                      underline-offset-2
                      hover:text-neutral-900
                    "
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* ERROR */}

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  rounded-lg
                  bg-neutral-900
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  uppercase
                  tracking-widest
                  text-white
                  transition
                  hover:bg-neutral-800
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading
                  ? isLogin
                    ? "Signing In..."
                    : "Creating Account..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </form>

            {/* SWITCH LOGIN / REGISTER */}

            <p className="mt-5 text-center text-sm text-neutral-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={switchMode}
                className="
                  font-semibold
                  text-neutral-900
                  underline
                  underline-offset-2
                  hover:text-neutral-600
                "
              >
                {isLogin ? "Register" : "Sign In"}
              </button>
            </p>
          </div>
        </section>

        {/* SVG SECTION - HIDDEN ON MOBILE */}

        <section
          className="
            hidden
            md:flex
            md:w-1/2
            md:items-center
            md:justify-center
            md:border-l
            md:border-neutral-200
            md:p-5
            lg:p-7
          "
        >
          <div className="w-full text-center">
            <h2
              className="
                font-poppins
                text-3xl
                font-semibold
                leading-tight
                tracking-[-0.05em]
                text-black
                lg:text-4xl
              "
            >
              Let's Blog it
            </h2>

            <img
              src={Icons}
              alt="Blog illustration"
              className="
                mx-auto
                mt-4
                h-auto
                w-full
                max-w-[280px]
                object-contain
                lg:max-w-[320px]
              "
            />
          </div>
        </section>
      </div>
    </main>
  );
}
