"use client";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { motion } from "framer-motion";

// This component renders animated grid lines in the background.
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
          x1={(i * 10).toString()}
          y1="0"
          x2={(i * 10).toString()}
          y2="100"
          stroke="#90cdf4"
          strokeWidth="0.3"
        />
      ))}
      {/* Horizontal lines */}
      {Array.from({ length: 11 }).map((_, i) => (
        <line
          key={`h${i}`}
          y1={(i * 10).toString()}
          x1="0"
          y2={(i * 10).toString()}
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

export default function Home() {
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
          Try for free!
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
    </main>
  );
}