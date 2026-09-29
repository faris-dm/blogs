import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const QUOTE = "Share Your Idea.";

export default function Splash({ children }) {
  const { checkingAuth } = useAuth();
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [typed, setTyped] = useState("");

  // minimum display time
  useEffect(() => {
    const t = setTimeout(() => setMinTimePassed(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // typewriter effect
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(QUOTE.slice(0, i));
      if (i >= QUOTE.length) clearInterval(t);
    }, 35);
    return () => clearInterval(t);
  }, []);

  const visible = checkingAuth || !minTimePassed;

  // remove from the DOM after the fade-out
  useEffect(() => {
    if (visible) return;
    const t = setTimeout(() => setRemoved(true), 500);
    return () => clearTimeout(t);
  }, [visible]);

  if (removed) return <>{children}</>;

  return (
    <>
      {children}
      <div
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-white px-6 transition-opacity duration-500 ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <style>{`
        @keyframes write {
          0% { width: 0; }
          60%, 100% { width: var(--w); }
        }
        @keyframes pen {
          0%, 100% { transform: translate(0, 0) rotate(-8deg); }
          50% { transform: translate(6px, 4px) rotate(4deg); }
        }
        @keyframes caret {
          50% { opacity: 0; }
        }
      `}</style>

        <div className="relative w-64 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <div className="mb-5 h-4 w-24 rounded bg-gray-900" />

          <div className="space-y-3">
            {[
              { w: "100%", d: "0s" },
              { w: "85%", d: "0.5s" },
              { w: "60%", d: "1s" },
            ].map((line, i) => (
              <div
                key={i}
                className="h-2.5 rounded bg-gray-300"
                style={{
                  "--w": line.w,
                  width: 0,
                  animation: `write 1.8s ease-out ${line.d} infinite`,
                }}
              />
            ))}
          </div>

          <svg
            className="absolute -bottom-5 -right-5 h-14 w-14 text-gray-900"
            style={{ animation: "pen 1.2s ease-in-out infinite" }}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </div>

        <p className="min-h-[3rem] max-w-xs text-center font-poppins text-base font-semibold tracking-tight text-gray-900">
          {typed}
          <span
            className="ml-0.5 inline-block h-4 w-0.5 translate-y-0.5 bg-gray-900"
            style={{ animation: "caret 0.8s step-end infinite" }}
          />
        </p>
      </div>
    </>
  );
}
