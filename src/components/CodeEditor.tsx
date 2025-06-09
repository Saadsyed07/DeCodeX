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
    <div className="h-[400px] w-full rounded-lg border border-gray-200 overflow-hidden">
      <Editor
        height="100%"
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
        }}
      />
    </div>
  );
} 