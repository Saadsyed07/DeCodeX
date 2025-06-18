"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Copy, Download } from "lucide-react";
import Footer from "@/components/Footer";
// Dummy icons (replace with your own)
const PYTHON_ICON = (
  <img
    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
    alt="Python"
    className="w-14 h-14"
  />
);
const JS_ICON = (
  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-yellow-300 font-bold text-4xl text-black shadow">
    JS
  </div>
);

const LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  // Add more as needed
];

const ICONS: Record<string, string> = {
  Python: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
};

const codeBoxStyle =
  "rounded-xl bg-white border border-gray-300 shadow-inner min-h-[150px] w-full p-2 font-mono text-sm resize-none outline-none";

const rainbowBoxShadow =
  "0 0 0 4px #e0e0e0, 0 0 16px 6px #d46dda, 0 0 32px 10px #706cf8, 0 0 48px 18px #7ee8fa";

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
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={i * 10}
          y1="0"
          x2={i * 10}
          y2="100"
          stroke="#90cdf4"
          strokeWidth="0.3"
        />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`h${i}`}
          y1={i * 10}
          x1="0"
          y2={i * 10}
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

const aiProcessSteps = [
  "Analyzing code...",
  "Understanding structure...",
  "Generating explanation...",
  "Finalizing..."
];

function AnimatedGridBG() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        opacity: 0.1,
        animation: "moveGrid 20s linear infinite",
      }}
    >
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={i * 10}
          y1="0"
          x2={i * 10}
          y2="100"
          stroke="#a7a7a7"
          strokeWidth="0.18"
        />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`h${i}`}
          y1={i * 10}
          x1="0"
          y2={i * 10}
          x2="100"
          stroke="#a7a7a7"
          strokeWidth="0.18"
        />
      ))}
      <style>
        {`
          @keyframes moveGrid {
            0% { transform: translateY(0);}
            100% { transform: translateY(-10px);}
          }
        `}
      </style>
    </svg>
  );
}

function SparkleSVG() {
  return (
    <svg
      className="absolute -top-8 left-1/2 -translate-x-1/2 z-0 pointer-events-none"
      width="160"
      height="60"
      viewBox="0 0 120 50"
      fill="none"
      style={{ opacity: 0.8 }}
    >
      <g>
        <motion.circle
          cx="20"
          cy="30"
          r="8"
          fill="#d46dda"
          initial={{ scale: 0.6, opacity: 0.5 }}
          animate={{ scale: [0.6, 1, 0.7], opacity: [0.5, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />
        <motion.circle
          cx="50"
          cy="16"
          r="4"
          fill="#706cf8"
          initial={{ scale: 0.7, opacity: 0.6 }}
          animate={{ scale: [0.7, 1.2, 0.6], opacity: [0.6, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.4 }}
        />
        <motion.circle
          cx="100"
          cy="33"
          r="6"
          fill="#7ee8fa"
          initial={{ scale: 0.5, opacity: 0.7 }}
          animate={{ scale: [0.5, 1, 0.7], opacity: [0.7, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.7, ease: "easeInOut", delay: 0.8 }}
        />
      </g>
    </svg>
  );
}

const features = [
  {
    icon: (
      <motion.span
        className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg"
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ scale: [0.8, 1.12, 1], rotate: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 2, repeatType: "loop", ease: "easeInOut" }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" stroke="currentColor" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      </motion.span>
    ),
    title: "High Quality Conversion",
    desc: "We use advanced AI models to ensure that your code is converted with the highest accuracy and quality."
  },
  {
    icon: (
      <motion.span
        className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg"
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ scale: [0.8, 1.12, 1], rotate: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, repeatType: "loop", ease: "easeInOut", delay: 0.15 }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="13 3 7 14 13 14 11 21 17 10 11 10 13 3" fill="none" />
          <polyline points="13 3 7 14 13 14 11 21" fill="none" />
          <polyline points="17 10 11 10 13 3" fill="none" />
        </svg>
      </motion.span>
    ),
    title: "No Setup Required",
    desc: "No need to download or install any software. Simply paste your code and click a button to convert it to your desired language."
  },
  {
    icon: (
      <motion.span
        className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg"
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ scale: [0.8, 1.12, 1], rotate: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.3, repeatType: "loop", ease: "easeInOut", delay: 0.1 }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9.5 12c1.5-2 4.5-2 6 0s-1.5 4-3 4-4.5-2-6-4 1.5-4 3-4 4.5 2 6 4" />
        </svg>
      </motion.span>
    ),
    title: "Unlimited Usage",
    desc: "All our paid plans come with unlimited usage. Convert as much code as you want using our web tool."
  },
  {
    icon: (
      <motion.span
        className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg"
        initial={{ scale: 0.8, rotate: 0 }}
        animate={{ scale: [0.8, 1.16, 1], rotate: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, repeatType: "loop", ease: "easeInOut", delay: 0.2 }}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 3l7 4v5c0 5-4.5 9-7 9s-7-4-7-9V7l7-4z" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      </motion.span>
    ),
    title: "Privacy and Security",
    desc: "We take privacy and security seriously. We do not retain the user’s input code and/or the generated output code."
  }
];

export function AnimatedGradientText({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{ backgroundPosition: "100% 50%" }}
      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
      className="relative font-extrabold"
      style={{
        background: "linear-gradient(90deg,#706cf8 0%,#d46dda 100%)",
        backgroundSize: "200% 200%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        color: "transparent",
        display: "inline-block",
        backgroundPosition: "0% 50%",
      }}
    >
      {children}
    </motion.span>
  );
}


function WhyUseCodeConvert() {
  return (
    <section className="w-full bg-gradient-to-tr from-[#e6f0f5] via-[#f6f6fa] to-[#f9f3ee] py-24 px-2 md:px-0 relative">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl font-black mb-4"
        >
          Why use{" "}
          <AnimatedGradientText>  Code Convert</AnimatedGradientText>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-gray-700 text-lg sm:text-xl mb-14 max-w-2xl mx-auto"
        >
          With automated code conversion, you don't have to spend hours manually rewriting code in a different language.
        </motion.p>
      </div>
      <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-x-12 gap-y-10 px-2">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            className="flex items-start gap-4"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.6, type: "spring" }}
            viewport={{ once: true }}
          >
            {feature.icon}
            <div>
              <div className="font-semibold text-lg mb-1">{feature.title}</div>
              <div className="text-gray-600 text-base">{feature.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// MAIN PAGE COMPONENT
export default function Home() {
  // Animation states for demo
  const [step, setStep] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("Python");
  const [aiStep, setAiStep] = useState(0);

  // For code convert section
  const [fromLang, setFromLang] = useState("python");
  const [toLang, setToLang] = useState("javascript");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  // Copy and download handlers
  const handleCopy = () => navigator.clipboard.writeText(output);
  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `converted.${toLang === "python" ? "py" : toLang === "javascript" ? "js" : "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Animation: Show converting for 1.5s before displaying output
  const handleConvert = () => {
    setIsConverting(true);
    setTimeout(() => {
      setOutput(
        input
          ? `// Converted from ${fromLang} to ${toLang}\n${input}`
          : ""
      );
      setIsConverting(false);
    }, 1500);
  };

  // Step timing for demo section
  useEffect(() => {
    if (step < 7) {
      const timeout = setTimeout(() => setStep(step + 1), [900, 800, 1000, 1200, 900, 1100, 1200][step]);
      return () => clearTimeout(timeout);
    } else if (step === 7) {
      setAiStep(0);
      const interval = setInterval(() => {
        setAiStep((prev) => {
          if (prev < aiProcessSteps.length - 1) return prev + 1;
          clearInterval(interval);
          setTimeout(() => setStep(8), 800);
          return prev;
        });
      }, 850);
      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    if (step === 3) setDropdownOpen(true);
    if (step === 5) setDropdownOpen(false);
  }, [step]);

  return (
    <div>
      {/* ==== Hero & Demo Sections ==== */}
      <main className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-blue-100 grid grid-rows-[auto_1fr_auto] overflow-x-hidden relative">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <GridLinesBackground />
        <Navbar />
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center flex-1 text-center relative z-10">
          <motion.h1 initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-6xl font-black mb-6">
            AI that
          </motion.h1>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
            className="flex items-center justify-center bg-white rounded-2xl shadow-lg px-8 py-4 mb-6">
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
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="mt-4 text-gray-700 text-xl max-w-2xl mx-auto"
          >
            AI code explanation made super simple to save you hours of time<br />
            from reading and understanding code in new languages or frameworks.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 4px 32px 0 #a9a9f7cc",
              backgroundColor: "#22223b",
              color: "#fff"
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ delay: 1.4, duration: 0.6, type: "spring" }}
            href="/explainer"
            className="mt-8 inline-block bg-black text-white px-8 py-4 rounded-xl text-lg font-bold shadow hover:bg-gray-900 transition-all"
          >
            Try Code Explainer!
          </motion.a>
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
                      disabled={!dropdownOpen}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.label}>
                          {lang.label}
                        </option>
                      ))}
                    </motion.select>
                    {/* Hand cursor for dropdown */}
                    <AnimatePresence>
                      {(step === 3 || step === 4) && (
                        <motion.div
                          initial={{ opacity: 0, x: 0, y: 0 }}
                          animate={{ opacity: 1, x: 40, y: 10 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          style={{
                            position: "absolute",
                            left: "160px",
                            top: "16px",
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
                <div className="relative">
                  <AnimatePresence>
                    {step === 7 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-gradient-to-br from-white/80 to-blue-100/70 rounded-xl"
                        style={{ height: 120 }}
                      >
                        <div className="text-lg font-semibold text-blue-700 mb-2 animate-pulse">
                          {aiProcessSteps[aiStep]}
                        </div>
                        <motion.div
                          className="w-8 h-8 rounded-full border-4 border-blue-400 border-t-transparent animate-spin"
                          style={{ borderTopColor: "#d46dda", borderRightColor: "#706cf8" }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <textarea
                    className={codeBoxStyle + " bg-gradient-to-br from-white to-blue-50"}
                    placeholder="AI-generated explanation will appear here"
                    value={
                      step < 8
                        ? ""
                        : `This Python function, greet, outputs "Hello, World!" to the console when called. 
It demonstrates a simple function definition and the use of the print statement.`
                    }
                    readOnly
                    style={{ height: 120, background: "#f9fafb" }}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: step > 5 ? 1 : 0, y: step > 5 ? 0 : 16 }}
              transition={{ delay: 1, duration: 0.55 }}
              className="w-full flex justify-center relative"
              style={{ marginTop: 28 }}
            >
              <Link
                href="/explainer"
                className="bg-black text-white px-8 py-2 rounded-lg text-lg font-bold shadow hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
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
                {step === 7 && (
                  <motion.div
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{ opacity: 1, x: 320, y: -120 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
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
                x1={i * 10}
                y1="0"
                x2={i * 10}
                y2="100"
                stroke="#90cdf4"
                strokeWidth="0.3"
              />
            ))}
            {Array.from({ length: 11 }).map((_, i) => (
              <line
                key={`h${i}`}
                y1={i * 10}
                x1="0"
                y2={i * 10}
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
      <WhyUseCodeConvert />
      {/* Code Converter Section */}
      <section
        className="flex items-center justify-center min-h-[80vh] w-full relative bg-gradient-to-br from-white via-blue-50 to-blue-100"
        style={{ overflow: "hidden" }}
      >
        {/* Rainbow border background */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 1.1 }}
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            width: 950,
            height: 520,
            transform: "translate(-50%, -50%)",
            borderRadius: 32,
            boxShadow: rainbowBoxShadow,
            zIndex: 0,
          }}
        />
        {/* Main card */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", delay: 0.2, duration: 1 }}
          className="relative bg-[#f5ede6] rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center"
          style={{
            width: 900,
            minHeight: 480,
            zIndex: 10,
          }}
        >
          <div className="flex justify-center gap-8 mb-6 w-full">
            {/* From language */}
            <div className="flex flex-col items-center">
              <span className="mb-1 font-bold text-lg">From</span>
              <select
                className="px-4 py-2 text-base rounded-lg border border-gray-300 font-semibold shadow"
                value={fromLang}
                onChange={e => setFromLang(e.target.value)}
                disabled={isConverting}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
            {/* To language */}
            <div className="flex flex-col items-center">
              <span className="mb-1 font-bold text-lg">To</span>
              <select
                className="px-4 py-2 text-base rounded-lg border border-gray-300 font-semibold shadow"
                value={toLang}
                onChange={e => setToLang(e.target.value)}
                disabled={isConverting}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-10 w-full">
            {/* Input */}
            <div className="flex-1 flex flex-col">
              <div className="text-xs text-gray-500 mb-1">Input</div>
              <textarea
                className="rounded-xl bg-white border border-gray-300 shadow-inner min-h-[150px] w-full p-2 font-mono text-sm resize-none outline-none"
                placeholder="Paste or type your code here"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isConverting}
                style={{ height: 140 }}
              />
            </div>
            {/* Output */}
            <div className="flex-1 flex flex-col">
              <div className="text-xs text-gray-500 mb-1">Output</div>
              <div className="relative">
                {isConverting && (
                  <div className="absolute inset-0 z-20 bg-gradient-to-br from-cyan-200/50 to-pink-200/60 flex flex-col items-center justify-center rounded-lg backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <motion.span
                        className="w-5 h-5 border-4 border-pink-400 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                      />
                      <span className="font-bold text-pink-700 text-lg animate-pulse">Converting...</span>
                    </div>
                    <span className="text-xs text-gray-500">AI is converting your code</span>
                  </div>
                )}
                <textarea
                  className="rounded-xl bg-white border border-gray-300 shadow-inner min-h-[150px] w-full p-2 font-mono text-sm resize-none outline-none"
                  value={output}
                  readOnly
                  placeholder="Converted code will appear here"
                  style={{ height: 140 }}
                />
                <div className="absolute bottom-2 right-2 flex gap-2 z-10">
                  <button
                    aria-label="Copy"
                    onClick={handleCopy}
                    className="p-1 rounded hover:bg-cyan-100/70 transition"
                    disabled={!output || isConverting}
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    aria-label="Download"
                    onClick={handleDownload}
                    className="p-1 rounded hover:bg-pink-100/70 transition"
                    disabled={!output || isConverting}
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Convert Button */}
          <motion.button
            className="mt-8 px-10 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-cyan-400 to-yellow-300 text-white font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition focus:outline-none"
            onClick={handleConvert}
            disabled={isConverting}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 8px 32px 0 #d46dda",
              background: "linear-gradient(90deg,#d46dda 30%,#706cf8 80%)",
              color: "#fff",
            }}
            animate={isConverting ? { scale: [1, 1.05, 1], opacity: [1, 0.7, 1] } : {}}
            transition={{ duration: 0.9, repeat: isConverting ? Infinity : 0, ease: "easeInOut" }}
          >
            {isConverting ? "Converting..." : "Convert"}
          </motion.button>
        </motion.div>
      </section>
      <section className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#f9f5f0] to-[#efe6de] overflow-x-hidden">
        <AnimatedGridBG />
        <div className="flex flex-col md:flex-row items-center justify-center w-full min-h-[70vh] px-4 md:px-12 z-10 relative">
          <SparkleSVG />
          {/* Center: Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="w-full md:w-1/2 flex justify-center mb-12 md:mb-0"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center justify-center"
              style={{ width: 340, height: 340, maxWidth: "100%" }}
            >
              <DotLottieReact
                src="https://lottie.host/405c7e5e-4146-40d9-8cc6-aae02a60f7c7/75Cocyut3k.lottie"
                loop
                autoplay
                style={{
                  width: 320,
                  height: 320,
                  maxWidth: "100%",
                  maxHeight: "100%",
                  display: "block"
                }}
              />
            </motion.div>
          </motion.div>
          {/* Right: CTA Section */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring" }}
            className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-3xl md:text-5xl font-black mb-3"
            >
              Get Started Today for
              <br />
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="block text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-400 to-blue-400 bg-[length:200%_200%] bg-clip-text text-transparent"
              >
                FREE!
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="text-lg md:text-2xl text-gray-500 mb-6"
            >
              No credit card or login required.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.7, type: "spring" }}
            >
              <Link href="/convert" passHref>
                <motion.button
                  whileHover={{
                    scale: 1.08,
                    background: "linear-gradient(90deg,#d46dda 30%,#706cf8 80%)",
                    color: "#fff",
                    boxShadow: "0 4px 32px 0 #a9a9f7cc",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black text-white px-8 py-4 rounded-xl text-lg font-bold shadow hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-400 transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
                  style={{
                    transition: "all 0.2s cubic-bezier(.4,0,.2,1)"
                  }}
                >
                  Try for free!
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
  <Footer/>
    </div>
  );
}