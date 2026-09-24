// import react ,{useState} from "react";

// import Icons from "../assets/icons.svg";
// function Signup() {
//   return (
//     <div>
//       {/* <main
//         className="
//     min-h-full w-full
//     px-4 pb-1 pt-8
//     sm:px-6 sm:pt-9
//     md:px-10 md:pt-10
//     lg:px-20 lg:pt-1"
//       >
//         <div
//           className="raper mx-auto flex w-full max-w-6xl flex-col gap-5 pb-4 mt-1 sm:block sm:mt-2 md:mt-3
//   md:flex-row md:items-center md:gap-7 lg:gap-10"
//         >
//           <div className="forms flex w-full max-w-sm flex-col  md:w-[40%] md:max-w-xs"></div>
//           <div
//             className=" sm:w-
//     flex min-h-[60px] flex-1
//     items-center justify-center
//     rounded-3xl border border-gray-200
//     p-6
//     sm:p-8
//     md:min-h-[320px]
//     lg:min-h-[100px]
//   "
//           >
//             <img
//               src={Icons}
//               alt="Icons"
//               className="sm:w-[0px] md:w-[500px] lg:w-[700px]  max-w-none"
//             />
//           </div>
// </div>
//       </main> */}
//     </div>
//   );
// }

// export default Signup;
import Icons from "../assets/icons.svg";

import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

function Field({ label, id, value, defaultValue, onChange, ...props }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = String(currentValue ?? "").length > 0;
  const floated = focused || hovered || hasValue;

  const handleChange = (e) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        id={id}
        value={isControlled ? value : internalValue}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
        className="w-full border-b px-4 pt-7 pb-3 text-base text-neutral-700  transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-150 pointer-events-none ${
          floated
            ? "top-2.5 translate-y-0 text-xs text-neutral-500"
            : "top-1/2 -translate-y-1/2 text-base text-neutral-400"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

function PasswordField({ label, id, value, defaultValue, onChange, ...props }) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const hasValue = String(currentValue ?? "").length > 0;
  const floated = focused || hovered || hasValue;

  const handleChange = (e) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        id={id}
        value={isControlled ? value : internalValue}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
        type={visible ? "text" : "password"}
        className="w-full  px-4 pt-7 pb-3 pr-12 text-base text-neutral-700 outline-none   focus:ring-1 focus:ring-neutral-900"
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-150 pointer-events-none ${
          floated
            ? "top-2.5 translate-y-0 text-xs text-neutral-500"
            : "top-1/2 -translate-y-1/2 text-base text-neutral-400"
        }`}
      >
        {label}
      </label>
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors"
      >
        {visible ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}

function LoginForm() {
  //   const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const email = e.target.email.value;

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:2300/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ← add this to both login and regi
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password.");
      }

      const result = await response.json();
      console.log("Login success:", result);
      // redirect, save token, etc. — next step

      if (result.user.role === "admin") {
        navigate("/admin");
        return;
      }
      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field
        id="login-email"
        name="email"
        label="Email"
        type="email"
        required
      />
      <PasswordField
        id="login-password"
        label="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-b-2 border-neutral-300 accent-neutral-900"
          />
          <span className="text-sm text-neutral-600">Remember me</span>
        </label>

        <a
          href="#"
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900 underline underline-offset-2"
        >
          Forgot password?
        </a>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-neutral-400 text-white text-base font-semibold tracking-widest uppercase py-4 hover:bg-neutral-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting && (
          <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        )}
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}

function RegisterForm() {
  //   const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const passwordsMatch =
    confirmPassword.length === 0 || password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed || !passwordsMatch || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const username = e.target.username.value;
    const email = e.target.email.value;

    const userData = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:2300/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ← add this to both login and register fetch calls
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Registration failed. Try again.");
      }

      const result = await response.json();
      console.log("Success:", result);

      navigate("/products");

      // redirect, show success message, whatever you want next
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field
        id="register-username"
        name="username"
        label="Username"
        type="text"
        required
      />
      <Field
        id="register-email"
        name="email"
        label="Email"
        type="email"
        required
      />

      <PasswordField
        id="register-password"
        label="Password"
        minLength={8}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div>
        <PasswordField
          id="register-confirm-password"
          label="Confirm Password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {!passwordsMatch && (
          <p className="mt-2 text-sm text-red-600">Passwords do not match.</p>
        )}
      </div>

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={agreed}
          onChange={() => setAgreed((a) => !a)}
          className="h-4 w-4 mt-0.5 rounded border-neutral-300 accent-neutral-900"
        />
        <span className="text-sm text-neutral-600">
          I agree to the Terms of Service and Privacy Policy
        </span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={!agreed || !passwordsMatch || isSubmitting}
        className="w-full rounded-md bg-neutral-900 text-white text-base font-semibold tracking-widest uppercase py-4 transition-colors hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting && (
          <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
        )}
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const isLogin = mode === "login";

  //   min-h-screen w-full flex bg-neutral-50 text-neutral-900
  return (
    //
    <div
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 pb-4 mt-1 sm:mt-2 md:mt-3
  md:flex-row md:items-center md:gap-6 lg:gap-10"
    >
      {/* <BrandPanel /> */}

      <div className=" bg-[#fef]  rounded-2xl flex items-center justify-center px-6 sm:px-10 py-10 lg:w-[600px]">
        <div className="w-full max-w-lg   ">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-2">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>
          {isLogin && (
            <p className="text-base text-neutral-500 mb-9">Welcome back</p>
          )}
          {!isLogin && <div className="mb-7" />}

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <p className="mt-7 text-center text-base text-neutral-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(isLogin ? "register" : "login")}
              className="font-semibold text-neutral-900 underline underline-offset-2 hover:text-neutral-700"
            >
              {isLogin ? "Register" : "Sign In"}
            </button>
          </p>
        </div>
      </div>

      <div
        className=" sm:w-
    flex min-h-[60px] flex-1
    items-center justify-center
    rounded-3xl border border-gray-200
    p-6
    sm:p-8
    md:min-h-[320px]
    lg:min-h-[100px]
  "
      >
        <div>
          <h3
            className="max-w-2xl
      lg:h-10
      text-center
      font-poppins
      text-2xl
      font-semibold
      leading-[1.3]
      tracking-[-0.05em]
      text-black
      sm:text-4xl
      md:text-5xl
      lg:text-6xl
      xl:text-7xl"
          >
            Let's Blog it
          </h3>
          <img
            src={Icons}
            alt="Icons"
            className="mt-5 sm:w-[0px] md:w-[500px] lg:w-[500px]  max-w-none"
          />
        </div>
      </div>
    </div>
  );
}
