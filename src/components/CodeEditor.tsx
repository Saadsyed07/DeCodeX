
import React, { useEffect, useState } from "react";
import { Editor, useMonaco } from "@monaco-editor/react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { ProgrammingLanguage } from "@/lib/utils";


interface CodeEditorProps {
  value: string;
  language: ProgrammingLanguage;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

interface ValidationError {
  message: string;
  line: number;
  column: number;
  severity: "error" | "warning" | "info";
}

export function CodeEditor({
  value,
  language,
  onChange,
  readOnly = false,
}: CodeEditorProps) {
  const monaco = useMonaco();
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (!monaco) return;
    const model = monaco.editor.getModels()[0];
    if (!model) return;

    monaco.editor.setModelMarkers(model, "owner", []);

    try {
      const newErrors: ValidationError[] = [];
      if (language === "javascript" || language === "typescript") {
        if (
          value.includes("console.log") &&
          !value.includes("console.log(")
        ) {
          newErrors.push({
            message: "Incomplete console.log statement",
            line: value.split("\n").findIndex((line) => line.includes("console.log")) + 1,
            column: 1,
            severity: "error",
          });
        }
        const lines = value.split("\n");
        lines.forEach((line, index) => {
          if (
            line.trim() &&
            !line.trim().endsWith(";") &&
            !line.trim().endsWith("{") &&
            !line.trim().endsWith("}") &&
            !line.trim().endsWith("(") &&
            !line.trim().startsWith("//") &&
            !line.trim().startsWith("import") &&
            !line.trim().startsWith("export") &&
            !line.trim().endsWith("=>") &&
            !line.includes("function")
          ) {
            newErrors.push({
              message: "Missing semicolon",
              line: index + 1,
              column: line.length,
              severity: "warning",
            });
          }
        });
      } else if (language === "python") {
        const lines = value.split("\n");
        let expectedIndent = 0;
        lines.forEach((line, index) => {
          if (line.trim().endsWith(":")) {
            expectedIndent += 4;
          } else if (line.trim() === "" && expectedIndent > 0) {
            // do nothing
          } else if (
            line.trim() &&
            line.search(/\S/) !== expectedIndent &&
            expectedIndent > 0
          ) {
            newErrors.push({
              message: `Incorrect indentation. Expected ${expectedIndent} spaces.`,
              line: index + 1,
              column: 1,
              severity: "error",
            });
          }
          if (
            line.trim() &&
            line.trim() !== "" &&
            index > 0 &&
            line.search(/\S/) < lines[index - 1].search(/\S/) &&
            !line.trim().startsWith("else") &&
            !line.trim().startsWith("elif") &&
            !line.trim().startsWith("except") &&
            !line.trim().startsWith("finally")
          ) {
            expectedIndent = line.search(/\S/);
          }
        });
      }
      setErrors(newErrors);
      setIsValid(newErrors.filter((e) => e.severity === "error").length === 0);

      if (newErrors.length > 0) {
        monaco.editor.setModelMarkers(
          model,
          "owner",
          newErrors.map((error) => ({
            startLineNumber: error.line,
            startColumn: error.column,
            endLineNumber: error.line,
            endColumn: error.column + 1,
            message: error.message,
            severity:
              error.severity === "error"
                ? monaco.MarkerSeverity.Error
                : error.severity === "warning"
                ? monaco.MarkerSeverity.Warning
                : monaco.MarkerSeverity.Info,
          }))
        );
      }
    } catch (error) {
      console.error("Error validating code:", error);
    }
  }, [monaco, value, language]);

  return (
    <div className="relative flex flex-col w-full max-w-3xl mx-auto my-6 rounded-2xl shadow-xl bg-gradient-to-br from-blue-50/80 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border border-gray-100 dark:border-gray-700 transition-colors">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"/>
      <div className="w-full rounded-t-2xl overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <Editor
          height="40vh"
          defaultLanguage={language}
          language={language}
          value={value}
          onChange={(val) => onChange(val || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            lineNumbers: "on",
            readOnly,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            padding: { top: 18, bottom: 18 },
            lineHeight: 1.7,
            fontFamily: "'Geist Mono', 'Fira Mono', monospace",
            renderLineHighlight: "all",
            suggestOnTriggerCharacters: true,
            formatOnPaste: true,
            formatOnType: true,
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              useShadows: false,
            },
            smoothScrolling: true,
          }}
        />
      </div>
      {errors.length > 0 && (
        <div className="mt-3 mx-4 p-4 rounded-lg bg-gradient-to-br from-red-100/80 via-red-50 to-rose-50 dark:from-red-950/50 dark:via-red-900/40 dark:to-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm shadow flex flex-col gap-2 animate-in fade-in">
          <div className="flex items-center gap-2 font-semibold">
            <AlertCircle className="w-4 h-4" />
            Issues detected in your code
          </div>
          <ul className="list-disc pl-6 space-y-1 text-xs">
            {errors.map((error, idx) => (
              <li key={idx}>
                <span className="font-medium">Line {error.line}:</span> {error.message}
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  ({error.severity})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {value.trim().length > 0 && errors.length === 0 && (
        <div className="mt-3 mx-4 p-4 rounded-lg bg-gradient-to-br from-green-50/90 via-green-100 to-emerald-50 dark:from-green-950/60 dark:to-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm flex items-center gap-2 shadow animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span className="font-medium">Your code looks great!</span>
        </div>
      )}
    </div>
    
  );
}