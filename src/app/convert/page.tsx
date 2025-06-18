"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { programmingLanguages, type ProgrammingLanguage } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

// --- Animated gradient background with unique floating blobs and grid ---
function AnimatedGradientBackground() {
  return (
    <>
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none -z-20"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ opacity: 0.14 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.14 }}
        transition={{ duration: 1.2 }}
      >
        {/* Grid lines */}
        {Array.from({ length: 11 }).map((_, i) => (
          <motion.line
            key={`v${i}`}
            x1={`${i * 10}`}
            y1="0"
            x2={`${i * 10}`}
            y2="100"
            stroke="#90cdf4"
            strokeWidth="0.3"
            initial={{ opacity: 0.6, x: 0 }}
            animate={{ opacity: [0.6, 1, 0.6], x: [0, 2 * (i % 2 === 0 ? 1 : -1), 0] }}
            transition={{ repeat: Infinity, duration: 6 + i * 0.2, repeatType: "mirror" }}
          />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <motion.line
            key={`h${i}`}
            y1={`${i * 10}`}
            x1="0"
            y2={`${i * 10}`}
            x2="100"
            stroke="#90cdf4"
            strokeWidth="0.3"
            initial={{ opacity: 0.6, y: 0 }}
            animate={{ opacity: [0.6, 1, 0.6], y: [0, 2 * (i % 2 === 0 ? 1 : -1), 0] }}
            transition={{ repeat: Infinity, duration: 7.2 + i * 0.2, repeatType: "mirror" }}
          />
        ))}
      </motion.svg>
      {/* Unique animated colored blobs */}
      <motion.div
        className="pointer-events-none absolute -z-10 left-[16%] top-[22%] w-[340px] h-[180px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle at 30% 70%,#c7f0ff 0%,#93cffc 80%)",
          opacity: 0.10,
        }}
        animate={{ y: [0, 18, -18, 0], x: [0, 10, -10, 0], scale: [1, 1.05, 0.98, 1] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="pointer-events-none absolute -z-10 left-[55%] top-[65%] w-[400px] h-[190px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle at 50% 30%,#ffd6e3 0%,#c1b3f5 90%)",
          opacity: 0.12,
        }}
        animate={{ y: [0, -22, 20, 0], x: [0, -12, 12, 0], scale: [1, 1.07, 0.96, 1] }}
        transition={{
          duration: 11,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="pointer-events-none absolute -z-10 left-1/2 top-[45%] w-[650px] h-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          background: "radial-gradient(circle,#9eafff 10%,#e0d1fa 90%)",
          opacity: 0.13,
        }}
        animate={{ scale: [0.98, 1.03, 0.96, 1], rotate: [0, 5, -5, 0] }}
        transition={{
          duration: 13,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />
    </>
  );
}

// --- Language icon map with unique jump and color pulse animations ---
const languageIcons: Record<string, React.ReactNode> = {
  python: (
    <motion.img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
      alt="Python"
      width={50}
      height={50}
      style={{ objectFit: "contain" }}
      initial={{ y: 0, filter: "drop-shadow(0 0 0 #3776ab)" }}
      animate={{
        y: [0, -18, 0],
        filter: [
          "drop-shadow(0 0 0 #3776ab)",
          "drop-shadow(0 0 12px #3776ab)",
          "drop-shadow(0 0 0 #3776ab)",
        ],
      }}
      transition={{
        repeat: Infinity,
        duration: 2.3,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  ),
  javascript: (
    <motion.img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
      alt="JavaScript"
      width={50}
      height={50}
      style={{
        objectFit: "contain",
        background: "#f7df1e",
        borderRadius: 12,
        padding: 4,
      }}
      initial={{ y: 0, filter: "drop-shadow(0 0 0 #f7df1e)" }}
      animate={{
        y: [0, -18, 0],
        filter: [
          "drop-shadow(0 0 0 #f7df1e)",
          "drop-shadow(0 0 12px #f7df1e)",
          "drop-shadow(0 0 0 #f7df1e)",
        ],
      }}
      transition={{
        repeat: Infinity,
        duration: 2.5,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  ),
  typescript: (
    <motion.img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
      alt="TypeScript"
      width={50}
      height={50}
      style={{ objectFit: "contain" }}
      initial={{ y: 0, filter: "drop-shadow(0 0 0 #3178c6)" }}
      animate={{
        y: [0, -18, 0],
        filter: [
          "drop-shadow(0 0 0 #3178c6)",
          "drop-shadow(0 0 12px #3178c6)",
          "drop-shadow(0 0 0 #3178c6)",
        ],
      }}
      transition={{
        repeat: Infinity,
        duration: 2.7,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  ),
  java: (
    <motion.img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original-wordmark.svg"
      alt="Java"
      width={50}
      height={50}
      style={{ objectFit: "contain" }}
      initial={{ y: 0, filter: "drop-shadow(0 0 0 #e76f00)" }}
      animate={{
        y: [0, -18, 0],
        filter: [
          "drop-shadow(0 0 0 #e76f00)",
          "drop-shadow(0 0 12px #e76f00)",
          "drop-shadow(0 0 0 #e76f00)",
        ],
      }}
      transition={{
        repeat: Infinity,
        duration: 2.2,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  ),
  cpp: (
    <motion.img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
      alt="C++"
      width={50}
      height={50}
      style={{ objectFit: "contain" }}
      initial={{ y: 0, filter: "drop-shadow(0 0 0 #00599c)" }}
      animate={{
        y: [0, -18, 0],
        filter: [
          "drop-shadow(0 0 0 #00599c)",
          "drop-shadow(0 0 12px #00599c)",
          "drop-shadow(0 0 0 #00599c)",
        ],
      }}
      transition={{
        repeat: Infinity,
        duration: 2.6,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  ),
  c: (
    <motion.img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg"
      alt="C"
      width={50}
      height={50}
      style={{ objectFit: "contain" }}
      initial={{ y: 0, filter: "drop-shadow(0 0 0 #3a76d4)" }}
      animate={{
        y: [0, -18, 0],
        filter: [
          "drop-shadow(0 0 0 #3a76d4)",
          "drop-shadow(0 0 12px #3a76d4)",
          "drop-shadow(0 0 0 #3a76d4)",
        ],
      }}
      transition={{
        repeat: Infinity,
        duration: 2.4,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  ),
};

function detectLanguageFromFilename(filename: string): ProgrammingLanguage | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, ProgrammingLanguage> = {
    py: "python",
    js: "javascript",
    ts: "typescript",
    java: "java",
    cpp: "cpp",
    c: "c",
  };
  if (ext && map[ext]) return map[ext];
  return null;
}

const conversionLanguages: ProgrammingLanguage[] = [
  "python",
  "javascript",
  "typescript",
  "java",
  "cpp",
  "c",
];

export default function CodeConvertTool() {
  const [code, setCode] = useState("");
  const [fromLang, setFromLang] = useState<ProgrammingLanguage>("python");
  const [toLang, setToLang] = useState<ProgrammingLanguage>("javascript");
  const [converted, setConverted] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [instructions, setInstructions] = useState("");

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCode(content);
      const detected = detectLanguageFromFilename(file.name);
      if (detected) setFromLang(detected);
    };
    reader.readAsText(file);
  };

  const handleConvert = async () => {
    if (!code.trim()) {
      setError("Please enter some code to convert.");
      return;
    }
    if (fromLang === toLang) {
      setError("Please select different source and target languages.");
      return;
    }
    setLoading(true);
    setError("");
    setConverted("");
    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, from: fromLang, to: toLang, instructions }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to convert code");
      setConverted(data.converted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert code");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (converted) {
      await navigator.clipboard.writeText(converted);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center relative"
      style={{ background: "#eee1d3" }}
    >
      <AnimatedGradientBackground />
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="w-full max-w-[1500px] py-10"
      >
        {/* 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* LEFT COLUMN - INPUT */}
          <motion.div
            initial={{ x: -60, opacity: 0, rotateY: 35 }}
            animate={{ x: 0, opacity: 1, rotateY: 0 }}
            transition={{ delay: 0.08, duration: 0.8, type: "spring" }}
          >
            <div className="flex flex-col items-center mb-4">
              <div className="flex flex-col items-center">
                {languageIcons[fromLang]}
                <motion.select
                  initial={false}
                  animate={{ backgroundColor: "#fff" }}
                  value={fromLang}
                  onChange={(e) =>
                    setFromLang(e.target.value as ProgrammingLanguage)
                  }
                  className="mt-2 px-4 py-2 rounded-md shadow bg-white text-gray-900 font-semibold"
                  style={{ minWidth: 120 }}
                  whileFocus={{ scale: 1.02, borderColor: "#8b5cf6" }}
                >
                  {conversionLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {programmingLanguages.find((l) => l.id === lang)?.name}
                    </option>
                  ))}
                </motion.select>
              </div>
            </div>
            {/* File upload */}
            <motion.label
              initial={{ scale: 0.88, opacity: 0.7 }}
              animate={{
                scale: [0.88, 1.03, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                repeat: Infinity,
                duration: 6,
                repeatType: "loop",
                ease: "easeInOut",
              }}
              htmlFor="file-upload"
              className="block text-center cursor-pointer border-2 border-dashed border-gray-400 px-7 py-4 mb-4 rounded-xl bg-white shadow-sm hover:bg-gray-50 font-medium transition"
            >
              <span className="font-bold">Click to select</span> or drop your input code file here.<br />
              <span className="text-sm text-gray-600">
                You can also type the input code below.
              </span>
              <input
                id="file-upload"
                type="file"
                accept=".py,.js,.ts,.java,.cpp,.c,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </motion.label>
            {/* Input Code Editor */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.18, duration: 0.5, type: "spring" }}
            >
              <CodeEditor
                value={code}
                onChange={setCode}
                language={fromLang}
                placeholder="Paste or type your code here..."
                className="min-h-[300px] max-h-[420px] text-base rounded-xl shadow bg-white"
              />
            </motion.div>
          </motion.div>
          {/* RIGHT COLUMN - OUTPUT */}
          <motion.div
            initial={{ x: 60, opacity: 0, rotateY: -35 }}
            animate={{ x: 0, opacity: 1, rotateY: 0 }}
            transition={{ delay: 0.13, duration: 0.8, type: "spring" }}
          >
            <div className="flex flex-col items-center mb-4">
              <div className="flex flex-col items-center">
                {languageIcons[toLang]}
                <motion.select
                  initial={false}
                  animate={{ backgroundColor: "#fff" }}
                  value={toLang}
                  onChange={(e) =>
                    setToLang(e.target.value as ProgrammingLanguage)
                  }
                  className="mt-2 px-4 py-2 rounded-md shadow bg-white text-gray-900 font-semibold"
                  style={{ minWidth: 120 }}
                  whileFocus={{ scale: 1.02, borderColor: "#8b5cf6" }}
                >
                  {conversionLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {programmingLanguages.find((l) => l.id === lang)?.name}
                    </option>
                  ))}
                </motion.select>
              </div>
            </div>
            <motion.textarea
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.22, duration: 0.4, type: "spring" }}
              placeholder='Additional instructions (optional).\nExample - "Use async await instead of promises"'
              className="w-full mb-4 p-3 rounded-xl border border-gray-300 bg-white shadow text-gray-700"
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
            {/* Output Code Editor */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.28, duration: 0.48, type: "spring" }}
              className="relative"
            >
              <CodeEditor
                value={converted}
                language={toLang}
                readOnly
                placeholder="Converted code will appear here..."
                className="min-h-[300px] max-h-[420px] text-base rounded-xl shadow bg-white"
              />
              <motion.button
                onClick={copyToClipboard}
                whileHover={{
                  scale: 1.13,
                  backgroundColor: "#d1fae5",
                  rotate: [0, 17, -17, 0],
                }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-2 right-2 bg-gray-100 p-2 rounded-full shadow hover:bg-gray-200 transition"
                disabled={!converted}
                title="Copy"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-gray-600" />
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        {/* Convert Button */}
        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{
              scale: 1.11,
              backgroundColor: "#22223b",
              color: "#fff",
              rotate: [0, 6, -6, 0],
            }}
            whileTap={{ scale: 0.98 }}
            onClick={handleConvert}
            disabled={loading || !code.trim()}
            className="px-8 py-2 rounded-md bg-black text-white font-bold shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <motion.span
                initial={{ opacity: 0.8 }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 0.9 }}
              >
                Converting...
              </motion.span>
            ) : (
              "Convert"
            )}
          </motion.button>
        </div>
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.22, type: "spring" }}
              className="mt-4 mx-auto w-full max-w-xl p-3 rounded-lg bg-red-50 text-red-700 shadow"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  );
}