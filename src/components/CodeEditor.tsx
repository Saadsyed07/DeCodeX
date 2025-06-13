import { Editor } from "@monaco-editor/react";
import { ProgrammingLanguage } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  language: ProgrammingLanguage;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  language,
  onChange,
  readOnly = false,
}: CodeEditorProps) {
  return (
    <div className="min-h-[400px] w-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800 shadow-inner">
      <Editor
        height="400px"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={(value) => onChange(value || "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          readOnly,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          lineHeight: 1.6,
          fontFamily: "'Geist Mono', monospace",
          renderLineHighlight: "all",
          suggestOnTriggerCharacters: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
}