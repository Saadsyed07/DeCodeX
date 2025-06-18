'use client';

import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  // On mount, set theme from localStorage or system preference
  useEffect(() => {
    let saved = localStorage.getItem("theme");
    let initial =
      saved ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Prevent body content from being hidden under the sticky navbar
  // by adding a top padding equal to navbar height on the body/html (optional, or use with layout)
  useEffect(() => {
    const navbarHeight = 64; // 16 * 4 (h-16 => 64px)
    document.body.style.paddingTop = `${navbarHeight}px`;
    return () => {
      document.body.style.paddingTop = "";
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#eee7df] dark:bg-[#1a2332] shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="inline-flex">
              <svg
                width={52}
                height={40}
                viewBox="0 0 52 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-10"
              >
                <rect
                  x={2}
                  y={8}
                  width={48}
                  height={28}
                  rx={4}
                  fill="#fff"
                  stroke="black"
                  strokeWidth={2}
                />
                <text
                  x="50%"
                  y="65%"
                  textAnchor="middle"
                  fontSize="20"
                  fontFamily="monospace"
                  fill="black"
                  fontWeight="bold"
                  alignmentBaseline="middle"
                >
                  {"</>"}
                </text>
                <circle cx={43} cy={12} r={2} fill="#000" />
                <circle cx={47} cy={12} r={2} fill="#000" />
                <circle cx={39} cy={12} r={2} fill="#000" />
              </svg>
            </span>
            <a href="/" className="no-underline">
              <span className="text-2xl font-bold text-black dark:text-white tracking-tight">
                DecodeX
              </span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a href="/convert" className="text-lg font-semibold text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              CodeConverter
            </a>
            <a href="/explainer" className="text-lg font-semibold text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              CodeExplainer
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-black dark:text-white">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 flex flex-col space-y-3 pb-4 px-4 bg-[#eee7df] dark:bg-[#1a2332] rounded-lg shadow transition-colors">
            <a href="/convert" className="text-base font-medium text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              CodeConverter
            </a>
            <a href="/explainer" className="text-base font-medium text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              CodeExplainer
            </a>
            <a href="#" className="text-base font-medium text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Login
            </a>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#f4f5fa] text-gray-900 hover:bg-gray-200 dark:bg-[#19253a] dark:text-gray-100 dark:hover:bg-[#22345a] transition-colors"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-4 h-4" /> Dark Mode
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4" /> Light Mode
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}