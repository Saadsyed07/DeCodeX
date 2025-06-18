"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { programmingLanguages, type ProgrammingLanguage } from "@/lib/utils";
import { Loader2, Sparkles, Copy, Check, Globe, MessageSquare, ChevronDown, ChevronUp, FileUp } from "lucide-react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

// --- Animated unique gradient background with floating blobs and grid ---
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
        {/* Grid lines with soft wiggle */}
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
      {/* Subtle animated colored blobs */}
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

// --- Language icon map ---
const languageIcons: Record<string, React.ReactNode> = {
  python: (
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
      alt="Python"
      width={80}
      height={80}
      style={{ objectFit: "contain" }}
    />
  ),
  javascript: (
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
      alt="JavaScript"
      width={80}
      height={80}
      style={{ objectFit: "contain" }}
    />
  ),
  typescript: (
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg"
      alt="TypeScript"
      width={80}
      height={80}
      style={{ objectFit: "contain" }}
    />
  ),
  java: (
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original-wordmark.svg"
      alt="Java"
      width={80}
      height={80}
      style={{ objectFit: "contain" }}
    />
  ),
  cpp: (
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
      alt="C++"
      width={80}
      height={80}
      style={{ objectFit: "contain" }}
    />
  ),
  c: (
    <img
      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg"
      alt="C"
      width={80}
      height={80}
      style={{ objectFit: "contain" }}
    />
  ),
};

// Helper to try to detect language from filename extension
function detectLanguageFromFilename(filename: string): ProgrammingLanguage | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, ProgrammingLanguage> = {
    "py": "python",
    "js": "javascript",
    "ts": "typescript",
    "java": "java",
    "cpp": "cpp",
    "c": "c"
  };
  if (ext && map[ext]) return map[ext];
  return null;
}

export default function Home() {
  const [code, setCode] = useState("");
  const [progLang, setProgLang] = useState<ProgrammingLanguage>("python");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState("professional");
  const [outputLang, setOutputLang] = useState("english");
  const [explanationOpen, setExplanationOpen] = useState(true);

  // Dropdown for options and for file upload
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCode(content);

      // Optionally auto-detect language
      const detected = detectLanguageFromFilename(file.name);
      if (detected) setProgLang(detected);
    };
    reader.readAsText(file);
    setShowUploadDropdown(false);
  };

  const handleExplain = async () => {
    if (!code.trim()) {
      setError("Please enter some code to explain");
      return;
    }
    const syntaxErrors = document.querySelectorAll(".monaco-editor .marker-error");
    if (syntaxErrors.length > 0) {
      setError("Please fix the syntax errors in your code before explaining");
      return;
    }

    setLoading(true);
    setError("");
    setExplanation("");

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: progLang, outputLanguage: outputLang, tone }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to explain code");

      setExplanation(data.explanation);
      setExplanationOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to explain code");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (explanation) {
      await navigator.clipboard.writeText(explanation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <main className="min-h-screen w-full max-w-screen-2xl mx-auto bg-gradient-to-br from-[#f9f5f0] to-[#e6dfd7] dark:from-gray-900 dark:to-gray-800 relative overflow-x-hidden">
      <AnimatedGradientBackground />
      <Navbar />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        <div className="hidden lg:block lg:col-span-3"></div>
        <div className="col-span-1 lg:col-span-12 space-y-6">
          {/* Dropdown Toggle Button for Configuration */}
          <div className="flex justify-end mb-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.04, backgroundColor: "#e0e7ef" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowDropdown((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold shadow transition-all"
              aria-expanded={showDropdown}
              aria-controls="config-dropdown"
            >
              {showDropdown ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              {showDropdown ? "Hide Options" : "Show Options"}
            </motion.button>
            {/* File Upload Dropdown Button */}
            <motion.button
              whileHover={{ scale: 1.04, backgroundColor: "#e0e7ef" }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowUploadDropdown((v) => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-semibold shadow transition-all"
              aria-expanded={showUploadDropdown}
              aria-controls="upload-dropdown"
            >
              <FileUp className="w-5 h-5" />
              {showUploadDropdown ? "Hide File Upload" : "Upload Code File"}
            </motion.button>
          </div>
          {/* File Upload Dropdown */}
          <AnimatePresence>
            {showUploadDropdown && (
              <motion.div
                id="upload-dropdown"
                initial={{ height: 0, opacity: 0, y: -20 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -20 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden flex flex-col items-center justify-center mb-4"
              >
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center cursor-pointer w-full max-w-xs border-2 border-dashed border-blue-400 rounded-lg p-6 bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <FileUp className="w-8 h-8 mb-2 text-blue-700 dark:text-blue-200" />
                  <span className="font-semibold text-blue-700 dark:text-blue-200">
                    Click to upload or drag a code file here
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".py,.js,.ts,.java,.cpp,.c,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="text-xs text-blue-600 dark:text-blue-300 mt-2">Supported: Python, JavaScript, TypeScript, Java, C++, C, TXT</span>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Code Input Card */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, type: "spring" }}
          >
            {/* Language & Option Selectors (Dropdown) */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  id="config-dropdown"
                  initial={{ height: 0, opacity: 0, y: -20 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -20 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 items-center">
                    {/* Language Icon */}
                    <motion.div
                      className="flex flex-col items-center justify-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 220 }}
                    >
                      <div className="w-20 h-20 flex items-center justify-center">
                        <span className="block w-20 h-20">{languageIcons[progLang] || null}</span>
                      </div>
                    </motion.div>

                    {/* Programming Language Selector */}
                    <motion.div
                      initial={{ x: 15, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="flex flex-col justify-center"
                    >
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Programming Language
                      </label>
                      <select
                        value={progLang}
                        onChange={(e) => setProgLang(e.target.value as ProgrammingLanguage)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 min-w-[150px] font-semibold"
                      >
                        {programmingLanguages.map((lang) => (
                          <option key={lang.id} value={lang.id}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </motion.div>

                    {/* Output Language Selector */}
                    <motion.div
                      initial={{ x: 15, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.25, type: "spring" }}
                      className="flex flex-col justify-center"
                    >
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <Globe className="w-4 h-4" />
                        Output Language
                      </label>
                      <select
                        value={outputLang}
                        onChange={(e) => setOutputLang(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 min-w-[120px] font-semibold"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                        <option value="japanese">Japanese</option>
                        <option value="korean">Korean</option>
                        <option value="hindi">Hindi</option>
                      </select>
                    </motion.div>

                    {/* Output Tone Selector */}
                    <motion.div
                      initial={{ x: 15, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="flex flex-col justify-center"
                    >
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        <MessageSquare className="w-4 h-4" />
                        Output Tone
                      </label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 min-w-[120px] font-semibold"
                      >
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="technical">Technical</option>
                        <option value="simplified">Simplified</option>
                        <option value="detailed">Detailed</option>
                      </select>
                    </motion.div>
                  </div>
                  <div className="flex justify-end mt-6">
                    <motion.button
                      whileHover={{ scale: 1.08, boxShadow: "0 2px 16px #a9a9f7cc" }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleExplain}
                      disabled={loading || !code.trim()}
                      className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Explain Code
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Code Editor */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, type: "spring" }}
              className="min-h-[300px] sm:min-h-[400px] w-full"
            >
              <CodeEditor value={code} onChange={setCode} language={progLang} />
            </motion.div>
          </motion.div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.28 }}
                className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Explanation Output with Dropdown and Animation */}
          <AnimatePresence>
            {explanation && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.45 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
              >
                {/* Dropdown button */}
                <motion.button
                  type="button"
                  onClick={() => setExplanationOpen((open) => !open)}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 mb-4 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-semibold"
                >
                  {explanationOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {explanationOpen ? "Hide Explanation" : "Show Explanation"}
                </motion.button>
                <AnimatePresence>
                  {explanationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    >
                      <div className="flex justify-end mb-4">
                        <motion.button
                          whileHover={{ scale: 1.06, backgroundColor: "#e0e7ef" }}
                          whileTap={{ scale: 0.97 }}
                          onClick={copyToClipboard}
                          className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </motion.button>
                      </div>
                      <MarkdownRenderer content={explanation} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}