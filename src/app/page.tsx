"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { programmingLanguages, type ProgrammingLanguage } from "@/lib/utils";
import { Loader2, Sparkles, Copy, Check, Globe, MessageSquare } from "lucide-react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import Navbar from "@/components/Navbar";
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



export default function Home() {
  const [code, setCode] = useState("");
  const [progLang, setProgLang] = useState<ProgrammingLanguage>("python");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState("professional");
  const [outputLang, setOutputLang] = useState("english");

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
    <main className="min-h-screen bg-[#eee6df] dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
    <Navbar />
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            DeCodeX
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get detailed, AI-powered explanations of your code in seconds. Understand complex codebases with ease.
          </p>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sidebar (optional) */}
          <div className="hidden lg:block lg:col-span-3 order-2 lg:order-1"></div>

          {/* Main Content */}
          <div className="col-span-1 lg:col-span-9 order-1 lg:order-2 space-y-6 w-full">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              {/* Language Selectors & Button */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 items-center">
                {/* Programming Language Icon & Selector */}
                <div className="flex flex-col items-center justify-center">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <span className="block w-20 h-20">
                      {languageIcons[progLang] || null}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Programming Language
                  </label>
                  <select
                    value={progLang}
                    onChange={(e) => setProgLang(e.target.value as ProgrammingLanguage)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 min-w-[150px] font-semibold"
                  >
                    {programmingLanguages.map((lang) => (
                      <option key={lang.id} value={lang.id}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Output Language Selector */}
                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Globe className="w-4 h-4" />
                    Output Language
                  </label>
                  <select
                    value={outputLang}
                    onChange={(e) => setOutputLang(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 min-w-[120px] font-semibold"
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
                </div>

                {/* Output Tone Selector */}
                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <MessageSquare className="w-4 h-4" />
                    Output Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 min-w-[120px] font-semibold"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="technical">Technical</option>
                    <option value="simplified">Simplified</option>
                    <option value="detailed">Detailed</option>
                  </select>
                </div>

                {/* Explain Button */}
                <div className="flex items-end sm:mt-auto">
                  <button
                    onClick={handleExplain}
                    disabled={loading || !code.trim()}
                    className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                  </button>
                </div>
              </div>

              {/* Code Editor */}
              <div className="min-h-[300px] sm:min-h-[400px] w-full">
                <CodeEditor value={code} onChange={setCode} language={progLang} />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Explanation Output */}
            {explanation && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                <div className="flex justify-end mb-4">
                  <button
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
                  </button>
                </div>
                <MarkdownRenderer content={explanation} />
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}