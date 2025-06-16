import React from "react";

interface Language {
  id: string;
  name: string;
}

interface LanguageSelectorProps {
  value: string;
  options: Language[];
  onChange: (val: string) => void;
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

export const programmingLanguages: Language[] = [
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "c", name: "C" },
];

export default function LanguageSelector({
  value,
  options,
  onChange,
}: LanguageSelectorProps) {
  const icon = languageIcons[value] ?? null;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#eee7df] p-6 rounded-xl shadow-md max-w-md">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />

      <div>{icon}</div>
      <div>
        <select
          aria-label="Select programming language"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-6 py-3 rounded-xl shadow font-bold text-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-400"
          style={{ minWidth: 180 }}
        >
          {options.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
