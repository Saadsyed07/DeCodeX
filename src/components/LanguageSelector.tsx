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

const languageIcons: Record<string, React.ReactNode> = {
  python: (
    <svg width={80} height={80} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#fff"/>
      <g>
        <path d="M12.01 2.002c-1.1 0-2 .896-2 2v2.111c0 1.111-.908 2.002-2.019 2.002h-2c-1.103 0-2 .896-2 2v3.995c0 1.104.897 2.001 2 2.001h2.001c1.112 0 2.019.892 2.019 2.001v2.111c0 1.11.899 2.001 2 2.001h3.995c1.111 0 2.002-.891 2.002-2.001v-2.001h-5.995V15h8.001V5.996c0-1.104-.891-1.994-2.002-1.994h-3.995zm-2.005 4.108A1.001 1.001 0 1 1 10.004 5.1a1.001 1.001 0 0 1-.002 1.01z" fill="#3776AB"/>
        <path d="M19.013 9.107h-2.001c-1.11 0-2.019-.892-2.019-2.001V4.995c0-1.104-.899-1.993-2-1.993h-3.995C7.887 3.002 6.997 3.891 6.997 5V7h5.995V8H4.991v8.003c0 1.104.891 1.994 2.002 1.994h3.995c1.1 0 2-.896 2-2v-2.112c0-1.11.908-2.001 2.019-2.001h2c1.104 0 2-.897 2-2.001V9.107zm-4.007 8.894a1.001 1.001 0 1 1 .002-2.001 1.001 1.001 0 0 1-.002 2.001z" fill="#FFD43B"/>
      </g>
    </svg>
  ),
  javascript: (
    <svg width={80} height={80} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#fff"/>
      <path fill="#F7DF1E" d="M3.002 3.002h17.996v17.996H3.002z"/>
      <text x="12" y="18" fontFamily="monospace" fontWeight="bold" fontSize="8" textAnchor="middle" fill="#000">JS</text>
    </svg>
  ),
  typescript: (
    <svg width={80} height={80} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#3178C6"/>
      <text x="12" y="18" fontFamily="monospace" fontWeight="bold" fontSize="8" textAnchor="middle" fill="#fff">TS</text>
    </svg>
  ),
  java: (
    <svg width={80} height={80} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#fff"/>
      <text x="12" y="18" fontFamily="monospace" fontWeight="bold" fontSize="8" textAnchor="middle" fill="#e76f00">JAVA</text>
    </svg>
  ),
  cpp: (
    <svg width={80} height={80} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#00599C"/>
      <text x="12" y="18" fontFamily="monospace" fontWeight="bold" fontSize="8" textAnchor="middle" fill="#fff">C++</text>
    </svg>
  ),
  c: (
    <svg width={80} height={80} viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#00599C"/>
      <text x="12" y="18" fontFamily="monospace" fontWeight="bold" fontSize="8" textAnchor="middle" fill="#fff">C</text>
    </svg>
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
