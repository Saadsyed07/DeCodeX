import { Editor, useMonaco } from "@monaco-editor/react";
import { ProgrammingLanguage } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

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
  severity: 'error' | 'warning' | 'info';
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

  // Validate code when language or value changes
  useEffect(() => {
    if (!monaco) return;
    
    // Clear previous markers
    const model = monaco.editor.getModels()[0];
    if (!model) return;
    
    monaco.editor.setModelMarkers(model, 'owner', []);
    
    // Basic syntax validation
    try {
      const newErrors: ValidationError[] = [];
      
      // Language-specific validation
      if (language === 'javascript' || language === 'typescript') {
        // Check for common JS/TS errors
        if (value.includes('console.log') && !value.includes('console.log(')) {
          newErrors.push({
            message: 'Incomplete console.log statement',
            line: value.split('\n').findIndex(line => line.includes('console.log')) + 1,
            column: 1,
            severity: 'error'
          });
        }
        
        // Check for missing semicolons in statements
        const lines = value.split('\n');
        lines.forEach((line, index) => {
          if (line.trim() && 
              !line.trim().endsWith(';') && 
              !line.trim().endsWith('{') && 
              !line.trim().endsWith('}') && 
              !line.trim().endsWith('(') &&
              !line.trim().startsWith('//') &&
              !line.trim().startsWith('import') &&
              !line.trim().startsWith('export') &&
              !line.trim().endsWith('=>') &&
              !line.includes('function')) {
            newErrors.push({
              message: 'Missing semicolon',
              line: index + 1,
              column: line.length,
              severity: 'warning'
            });
          }
        });
      } else if (language === 'python') {
        // Check for Python indentation
        const lines = value.split('\n');
        let expectedIndent = 0;
        
        lines.forEach((line, index) => {
          if (line.trim().endsWith(':')) {
            expectedIndent += 4;
          } else if (line.trim() === '' && expectedIndent > 0) {
            // Empty line, do nothing
          } else if (line.trim() && line.search(/\S/) !== expectedIndent && expectedIndent > 0) {
            newErrors.push({
              message: `Incorrect indentation. Expected ${expectedIndent} spaces.`,
              line: index + 1,
              column: 1,
              severity: 'error'
            });
          }
          
          // Check for dedent
          if (line.trim() && line.trim() !== '' && 
              index > 0 && 
              line.search(/\S/) < lines[index-1].search(/\S/) && 
              !line.trim().startsWith('else') && 
              !line.trim().startsWith('elif') && 
              !line.trim().startsWith('except') && 
              !line.trim().startsWith('finally')) {
            expectedIndent = line.search(/\S/);
          }
        });
      }
      
      // Set errors and update markers
      setErrors(newErrors);
      setIsValid(newErrors.filter(e => e.severity === 'error').length === 0);
      
      // Add markers to the editor
      if (newErrors.length > 0) {
        monaco.editor.setModelMarkers(model, 'owner', newErrors.map(error => ({
          startLineNumber: error.line,
          startColumn: error.column,
          endLineNumber: error.line,
          endColumn: error.column + 1,
          message: error.message,
          severity: error.severity === 'error' ? monaco.MarkerSeverity.Error : 
                   error.severity === 'warning' ? monaco.MarkerSeverity.Warning : 
                   monaco.MarkerSeverity.Info
        })));
      }
    } catch (error) {
      console.error('Error validating code:', error);
    }
  }, [monaco, value, language]);

  return (
    <div className="relative">
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
      
      {/* Error display */}
      {errors.length > 0 && (
        <div className="mt-2 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          <div className="flex items-center gap-2 font-medium mb-1">
            <AlertCircle className="w-4 h-4" />
            Code issues detected
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>
                Line {error.line}: {error.message} 
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                  ({error.severity})
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Valid code indicator */}
      {value.trim().length > 0 && errors.length === 0 && (
        <div className="mt-2 p-3 rounded-md bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Code looks good!
        </div>
      )}
    </div>
  );
}