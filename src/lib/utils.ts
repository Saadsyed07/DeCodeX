import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const programmingLanguages = [
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "c", name: "C" },
] as const;

export type ProgrammingLanguage = typeof programmingLanguages[number]["id"];

export const getLanguageLabel = (language: ProgrammingLanguage) => {
  return programmingLanguages.find((lang) => lang.id === language)?.name || language;
}; 