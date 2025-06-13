"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { programmingLanguages, type ProgrammingLanguage } from "@/lib/utils";
import { Loader2, Code2, Sparkles, Copy, Check } from "lucide-react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import Settings from "@/components/Settings";

export default function Home() {
  const [code, setCode] = useState("");
  const [progLang, setProgLang] = useState<ProgrammingLanguage>("python");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [tone, setTone] = useState('professional');
  const [outputLang, setOutputLang] = useState('english');

  const handleExplain = async () => {
    if (!code.trim()) {
      setError("Please enter some code to explain");
      return;
    }

    // Check for basic syntax errors before sending to API
    const syntaxErrors = document.querySelectorAll('.monaco-editor .marker-error');
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          code, 
          language: progLang,
          outputLanguage: outputLang,
          tone 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to explain code");
      }

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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            DeCodeX
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Get detailed, AI-powered explanations of your code in seconds.
            Understand complex codebases with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-[90rem] mx-auto">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <Settings
              explanation={explanation}
              onToneChange={setTone}
              onLanguageChange={setOutputLang}
            />
          </div>

          <div className="lg:col-span-9 order-1 lg:order-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
                <select
                  value={progLang}
                  onChange={(e) => setProgLang(e.target.value as ProgrammingLanguage)}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
                >
                  {programmingLanguages.map((lang) => (
                    <option key={lang.id} value={lang.id}>
                      {lang.name}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={handleExplain}
                  disabled={loading || !code.trim()}
                  className="flex-1 sm:flex-none px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
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

              <div className="min-h-[300px] sm:min-h-[400px]">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={progLang}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

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