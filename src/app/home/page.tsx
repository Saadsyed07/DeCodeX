"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
// Animated grid lines background
function GridLinesBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none -z-20"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        opacity: 0.18,
        animation: "gridMove 12s linear infinite",
      }}
    >
      {/* Vertical lines */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={`${i * 10}`}
          y1="0"
          x2={`${i * 10}`}
          y2="100"
          stroke="#90cdf4"
          strokeWidth="0.3"
        />
      ))}
      {/* Horizontal lines */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`h${i}`}
          y1={`${i * 10}`}
          x1="0"
          y2={`${i * 10}`}
          x2="100"
          stroke="#90cdf4"
          strokeWidth="0.3"
        />
      ))}
      <style>
        {`
          @keyframes gridMove {
            0% { transform: translateY(0); }
            100% { transform: translateY(-10px); }
          }
        `}
      </style>
    </svg>
  );
}
const LANGUAGES = [
  "C++", "Golang", "Java", "JavaScript", "Python", "R", "C", "Csharp", "Julia", "Perl", "Matlab",
  "Kotlin", "PHP", "Ruby", "Rust", "TypeScript", "Lua", "SAS", "Fortran", "Lisp", "Scala",
  "Assembly", "ActionScript", "Clojure", "CoffeeScript", "Dart", "COBOL", "Elixir", "-"
];

const ICONS: Record<string, string> = {
  Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
};

const codeBoxStyle =
  "rounded-xl bg-white border border-gray-300 shadow-inner min-h-[150px] w-full p-2 font-mono text-sm resize-none outline-none";

const rainbowBoxShadow =
  "0 0 0 4px #e0e0e0, 0 0 16px 6px #d46dda, 0 0 32px 10px #706cf8, 0 0 48px 18px #7ee8fa";

// SVG hand cursor for animation
function HandCursor({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width={40}
      height={40}
      viewBox="0 0 32 32"
      style={{
        position: "absolute",
        zIndex: 30,
        pointerEvents: "none",
        ...style,
      }}
    >
      <g>
        <path
          d="M9 20V10a2 2 0 1 1 4 0v8M13 18V8a2 2 0 1 1 4 0v10M17 18V6a2 2 0 1 1 4 0v12"
          stroke="#222"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <ellipse cx="23" cy="25" rx="5" ry="6" fill="#fff" stroke="#222" strokeWidth="2" />
        <ellipse cx="23" cy="25" rx="3" ry="4" fill="#f1c40f" />
      </g>
    </svg>
  );
}

export default function Home() {
  // Animation states
  const [step, setStep] = useState(0);
  // 0: nothing, 1: rainbow in, 2: icons in, 3: dropdown, 4: dropdown open, 5: editors in, 6: hand press explain, 7: done

  // For dropdown animation
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("Python");

  // Step timing
  useEffect(() => {
    if (step < 7) {
      const timeout = setTimeout(() => setStep(step + 1), [900, 800, 1000, 1200, 900, 1100, 1200][step]);
      return () => clearTimeout(timeout);
    }
  }, [step]);

  // Animate dropdown open/close
  useEffect(() => {
    if (step === 3) setDropdownOpen(true);
    if (step === 5) setDropdownOpen(false);
  }, [step]);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-blue-100 grid grid-rows-[auto_1fr_auto] overflow-x-hidden relative">
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      {/* Animated grid lines */}
      <GridLinesBackground />
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center relative z-10">
        {/* AI that */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl font-black mb-6"
        >
          AI that
        </motion.h1>
        {/* Python code explainer card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
          className="flex items-center justify-center bg-white rounded-2xl shadow-lg px-8 py-4 mb-6"
        >
          <Image
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
            alt="python"
            width={36}
            height={36}
            className="mr-3"
            priority
          />
          <span className="font-mono text-xl font-bold">
            print(<span className="text-green-600">"Explain's Code"</span>)
          </span>
        </motion.div>
        {/* Gradient animated title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
          className="text-5xl md:text-6xl font-extrabold mb-4"
          style={{
            background: "linear-gradient(90deg,#706cf8 30%,#d46dda 70%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 12px #b9a9f7a7)",
          }}
        >
          On Your FingerTips
        </motion.h2>
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="mt-4 text-gray-700 text-xl max-w-2xl mx-auto"
        >
          AI code explanation made super simple to save you hours of time<br />
          from reading and understanding code in new languages or frameworks.
        </motion.p>
        {/* Call to action */}
        <motion.a
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.6, type: "spring" }}
          href="/explainer"
          className="mt-8 inline-block bg-black text-white px-8 py-4 rounded-xl text-lg font-bold shadow hover:bg-gray-900 transition-all"
        >
          Try Code Explainer!
        </motion.a>
        {/* Subtle animated background effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.11 }}
          transition={{ duration: 2, delay: 0.1 }}
          className="pointer-events-none absolute -z-10 left-1/2 top-2/3 w-[700px] h-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
          style={{
            background: "radial-gradient(circle,#9eafff 10%,#e0d1fa 90%)",
          }}
        />
      </section>

      {/* Animated code explainer demo section */}
      <section
        className="flex items-center justify-center min-h-[90vh] w-full relative bg-gradient-to-br from-white via-blue-50 to-blue-100"
        style={{
          overflow: "hidden",
        }}
      >
        {/* Rainbow border background */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{
            scale: step > 0 ? 1 : 0.85,
            opacity: step > 0 ? 1 : 0,
          }}
          transition={{ type: "spring", duration: 1.1 }}
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            width: 950,
            height: 460,
            transform: "translate(-50%, -50%)",
            borderRadius: 32,
            boxShadow: rainbowBoxShadow,
            zIndex: 0,
          }}
        />
        {/* Main card */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{
            scale: step > 0 ? 1 : 0.92,
            opacity: step > 0 ? 1 : 0,
          }}
          transition={{ type: "spring", delay: 0.2, duration: 1 }}
          className="relative bg-[#f5ede6] rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center"
          style={{
            width: 900,
            minHeight: 420,
            zIndex: 10,
          }}
        >
          {/* Icons row */}
          <div className="flex items-center justify-center w-full mb-2 gap-6">
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: step > 1 ? 0 : -30, opacity: step > 1 ? 1 : 0 }}
              transition={{ delay: 0.25, duration: 0.6, type: "spring" }}
              className="flex flex-col items-center"
            >
              <Image
                src={ICONS["Python"]}
                width={60}
                height={60}
                alt="python"
                className="bg-white rounded-xl shadow p-2 border"
                style={{ marginBottom: 5 }}
              />
              {/* Dropdown */}
              <motion.div
                initial={false}
                animate={{ opacity: step > 2 ? 1 : 0, y: step > 2 ? 0 : -10 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="relative"
              >
                <div className="flex items-center">
                  <motion.select
                    initial={false}
                    animate={{
                      pointerEvents: dropdownOpen ? "auto" : "none",
                      background: dropdownOpen ? "#fff" : "#fafafa",
                    }}
                    className="px-4 py-1 text-base rounded-lg border border-gray-300 font-semibold shadow"
                    style={{
                      minWidth: 160,
                      cursor: dropdownOpen ? "pointer" : "default",
                      outline: dropdownOpen ? "2px solid #7ee8fa" : "none",
                      transition: "outline 0.2s",
                    }}
                    value={dropdownValue}
                    onChange={(e) => setDropdownValue(e.target.value)}
                    size={dropdownOpen ? LANGUAGES.length : 1}
                    // VS Code/React: Use 'disabled' instead of 'readOnly' for select
                    disabled={!dropdownOpen}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </motion.select>
                  {/* Hand cursor for dropdown */}
                  <AnimatePresence>
                    {(step === 3 || step === 4) && (
                      <motion.div
                        initial={{ opacity: 0, x: -16, y: -16 }}
                        animate={{ opacity: 1, x: 8, y: 8 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                          position: "absolute",
                          left: "140px",
                          top: "-8px",
                        }}
                      >
                        <HandCursor />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
            <div className="flex-1" />
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: step > 1 ? 0 : -30, opacity: step > 1 ? 1 : 0 }}
              transition={{ delay: 0.28, duration: 0.6, type: "spring" }}
              className="flex flex-col items-center"
            >
              <Image
                src={ICONS["JavaScript"]}
                width={60}
                height={60}
                alt="javascript"
                className="bg-white rounded-xl shadow p-2 border"
                style={{ marginBottom: 5 }}
              />
              <motion.div
                initial={false}
                animate={{ opacity: step > 2 ? 1 : 0, y: step > 2 ? 0 : -10 }}
                transition={{ duration: 0.4, delay: 0.21 }}
                className="relative"
              >
                <div className="flex items-center">
                  <select
                    className="px-3 py-1 text-base rounded-lg border border-gray-300 font-semibold shadow"
                    style={{
                      minWidth: 130,
                      background: "#fff",
                    }}
                    value="JavaScript"
                    disabled
                  >
                    <option>JavaScript</option>
                  </select>
                </div>
              </motion.div>
            </motion.div>
          </div>
          {/* Center label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: step > 2 ? 1 : 0, y: step > 2 ? 0 : 10 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="w-full flex justify-center mb-4"
          >
            <div className="border-dashed border-2 border-gray-400 px-7 py-2 rounded-lg text-gray-800 bg-white/80 font-semibold text-base shadow-sm">
              Drop your code here, or type in the file to get an explanation.
            </div>
          </motion.div>
          {/* Editors & Explanation Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: step > 4 ? 1 : 0, y: step > 4 ? 0 : 30 }}
            transition={{ delay: 0.85, duration: 0.7, type: "spring" }}
            className="flex flex-row gap-8 w-full"
            style={{ maxWidth: 900 }}
          >
            <div className="flex-1 flex flex-col">
              <div className="font-mono text-xs text-gray-500 mb-1">1</div>
              <textarea
                className={codeBoxStyle}
                placeholder="Your input code here"
                defaultValue={step > 5 ? 'def greet():\n    print("Hello, World!")' : ""}
                readOnly
                style={{ height: 120, background: "#fff" }}
              />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="font-mono text-xs text-gray-500 mb-1">AI Explanation</div>
              <textarea
                className={codeBoxStyle + " bg-gradient-to-br from-white to-blue-50"}
                placeholder="AI-generated explanation will appear here"
                defaultValue={step > 6 ?
                  `This Python function, greet, outputs "Hello, World!" to the console when called. 
It demonstrates a simple function definition and the use of the print statement.` : ""}
                readOnly
                style={{ height: 120, background: "#f9fafb" }}
              />
            </div>
          </motion.div>
          {/* Explain Button with hand animation */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: step > 5 ? 1 : 0, y: step > 5 ? 0 : 16 }}
            transition={{ delay: 1, duration: 0.55 }}
            className="w-full flex justify-center relative"
            style={{ marginTop: 28 }}
          >


            <Link
              href="/explainer"
              className="bg-black text-white px-8 py-2 rounded-lg text-lg font-bold shadow hover:bg-gray-900 transition-all"
              style={{
                boxShadow: "0 2px 8px 0 #d46dda66",
                position: "relative",
                zIndex: 2,
                transform: step === 6 ? "scale(0.95)" : "scale(1)",
                transition: "transform 0.18s",
              }}
            >
              Explain
            </Link>

            {/* Hand cursor for button */}
            <AnimatePresence>
              {step === 6 && (
                <motion.div
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{ opacity: 1, x: 105, y: -22 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "-20px",
                    zIndex: 30,
                  }}
                >
                  <HandCursor />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
        {/* Grid lines BG for this section */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none -z-20"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{
            opacity: 0.13,
            animation: "gridMove 16s linear infinite",
          }}
        >
          {Array.from({ length: 11 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={`${i * 10}`}
              y1="0"
              x2={`${i * 10}`}
              y2="100"
              stroke="#90cdf4"
              strokeWidth="0.3"
            />
          ))}
          {Array.from({ length: 11 }).map((_, i) => (
            <line
              key={`h${i}`}
              y1={`${i * 10}`}
              x1="0"
              y2={`${i * 10}`}
              x2="100"
              stroke="#90cdf4"
              strokeWidth="0.3"
            />
          ))}
          <style>
            {`
              @keyframes gridMove {
                0% { transform: translateY(0); }
                100% { transform: translateY(-10px); }
              }
            `}
          </style>
        </svg>
      </section>
    </main>
  );
}