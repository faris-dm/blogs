export default function WavyBackground({ children }) {
  // Generate vertical offsets for 35 parallel lines across the screen
  const lines = Array.from({ length: 35 }, (_, i) => i * 25 - 200);

  return (
    <div className="relative min-h-screen bg-[#EBEBEB] text-gray-900 overflow-hidden">
      {/* Dense Wave Pattern Layer */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-90"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 800"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#F5F5F7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#E0E0E0" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        <g stroke="url(#lineGradient)" strokeWidth="1.8" fill="none">
          {lines.map((offset, index) => (
            <path
              key={index}
              d={`M -200,${offset} C 200,${offset + 400} 400,${
                offset - 200
              } 1200,${offset + 500}`}
            />
          ))}
        </g>
      </svg>

      {/* Page Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// const WavyBackground = ({ children, className = "" }) => {
//   const waves = Array.from({ length: 18 }, (_, i) => i);

//   return (
//     <div
//       className={`relative min-h-screen overflow-hidden bg-[#eeeeee] ${className}`}
//     >
//       <svg
//         className="pointer-events-none absolute inset-0 h-full w-full"
//         viewBox="0 0 1200 800"
//         preserveAspectRatio="none"
//         xmlns="http://www.w3.org/2000/svg"
//         aria-hidden="true"
//       >
//         <g fill="none" stroke="#fafafa" strokeWidth="4" strokeLinecap="round">
//           {waves.map((i) => {
//             const y = -170 + i * 52;

//             return (
//               <path
//                 key={i}
//                 d={`
//                   M -180 ${y}

//                   C 120 ${y - 170},
//                     500 ${y - 120},
//                     650 ${y + 40}

//                   C 800 ${y + 200},
//                     690 ${y + 360},
//                     820 ${y + 500}

//                   C 930 ${y + 620},
//                     1080 ${y + 640},
//                     1320 ${y + 700}
//                 `}
//               />
//             );
//           })}
//         </g>
//       </svg>

//       {/* Your page content */}
//       <div className="relative z-10">{children}</div>
//     </div>
//   );
// };

// export default WavyBackground;
