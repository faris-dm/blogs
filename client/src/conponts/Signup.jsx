import React, { useState } from "react";
import Icons from "../assets/icons.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

// --------------------------------------------------
// MOCK API
// Replace this later with your real backend request
// --------------------------------------------------

async function loginRequest(data) {
  const res = await fetch("http://localhost:2019/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // required so the browser stores the cookies your backend sets
    body: JSON.stringify(data),
  });

  const json = await res.json();

  if (!res.ok) {
    // your backend sends plain strings on error, e.g. "incorrect inputs "
    throw new Error(typeof json === "string" ? json : "Login failed");
  }

  return json; // { success, message, user }
}

async function Register(data) {
  const Response = await fetch(`http://localhost:2019/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

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

    // Basic register validation
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
        navigate(Location.state?.from || "/post", { replace: true });
      } else {
        // Data that will eventually go to your register API
        const registerData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        };

        const result = await Register(registerData);

        console.log(result);
        setUser(result.user);

        navigate(Location.state?.from || "/post", { replace: true });
      }

      // Clear form after successful request
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
  }

  return (
    <main
      className="
    min-h-screen
    w-full
    px-3
    py-6
    pt-20
    sm:px-5
    sm:py-8
    sm:pt-24
    md:px-10
    lg:px-20
  "
    >
      <div
        className="
      mx-auto
      flex
      w-full
      max-w-6xl
      flex-col
      gap-6
      overflow-hidden
      rounded-xl
      bg-white
      px-1
      sm:gap-8
      sm:px-2
      md:flex-row
      md:items-center
      md:gap-8
      md:px-0
      lg:gap-10
    "
      >
        {/* =========================================
            FORM
        ========================================= */}

        <section
          className="
    flex
    w-full
    min-w-0
    items-center
    justify-center
    px-2
    py-5
    sm:px-4
    sm:py-8
    md:w-1/2
    md:px-6
    md:py-10
    lg:px-8
  "
        >
          <div className="w-full max-w-md min-w-0">
            {/* TITLE */}

            <div className="mb-8">
              <h1
                className="
                  text-3xl
                  font-black
                  uppercase
                  tracking-tight
                  text-neutral-900

                  sm:text-4xl
                "
              >
                {isLogin ? "Sign In" : "Create Account"}
              </h1>

              {isLogin ? (
                <p className="mt-2 text-sm text-neutral-500 sm:text-base">
                  Welcome back
                </p>
              ) : (
                <p className="mt-2 text-sm text-neutral-500 sm:text-base">
                  Create your account
                </p>
              )}
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* USERNAME - REGISTER ONLY */}

              {!isLogin && (
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-medium text-neutral-700"
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
                      rounded-md
                      border
                      border-neutral-300
                      bg-white
                      px-4
                      py-3
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
                  className="mb-2 block text-sm font-medium text-neutral-700"
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
                    rounded-md
                    border
                    border-neutral-300
                    bg-white
                    px-4
                    py-3
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
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="
                    w-full
                    rounded-md
                    border
                    border-neutral-300
                    bg-white
                    px-4
                    py-3
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

              {/* CONFIRM PASSWORD */}

              {!isLogin && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-neutral-700"
                  >
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm your password"
                    className="
                      w-full
                      rounded-md
                      border
                      border-neutral-300
                      bg-white
                      px-4
                      py-3
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

              {/* LOGIN OPTIONS */}

              {isLogin && (
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-neutral-900"
                    />

                    <span className="text-xs text-neutral-600 sm:text-sm">
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

                      sm:text-sm
                    "
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* ERROR */}

              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  rounded-md
                  bg-neutral-900
                  px-4
                  py-3.5
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

                  sm:py-4
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

            <p className="mt-7 text-center text-sm text-neutral-600 sm:text-base">
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

        {/* =========================================
            SVG / DESIGN
            Hidden on mobile
        ========================================= */}

        <section
          className="
            hidden

            md:flex
            md:min-h-[320px]
            md:flex-1
            md:items-center
            md:justify-center
            md:rounded-3xl
            md:border
            md:border-gray-200
            md:p-6

            lg:p-8
          "
        >
          <div className="w-full text-center">
            <h2
              className="
                font-poppins
                text-4xl
                font-semibold
                leading-[1.3]
                tracking-[-0.05em]
                text-black

                lg:text-5xl
              "
            >
              Let's Blog it
            </h2>

            <img
              src={Icons}
              alt="Blog illustration"
              className="
                mx-auto
                mt-6
                h-auto
                w-full
                max-w-[500px]
                object-contain
              "
            />
          </div>
        </section>
      </div>
    </main>
  );
}
