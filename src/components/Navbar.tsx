'use client';

import React, { useState } from "react";
import { Download, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/lib/ThemeProvider';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme(); // assuming this hook provides `theme` and `toggleTheme`

  return (
    <nav className="w-full bg-[#eee7df] shadow-sm">
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
            <a href="#" className="no-underline">
              <span className="text-2xl font-bold text-black tracking-tight">DecodeX</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-lg font-semibold text-black hover:text-gray-700">CodeConverter</a>
            <a href="#" className="text-lg font-semibold text-black hover:text-gray-700">CodeExplainer</a>
            <a href="#" className="px-5 py-2 rounded-xl border border-black text-lg text-gray-700 hover:bg-black/10">
              Login
            </a>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? <><Moon className="w-4 h-4" /> Dark Mode</> : <><Sun className="w-4 h-4" /> Light Mode</>}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-black">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-2 flex flex-col space-y-3 pb-4">
            <a href="#" className="text-base font-medium text-black hover:text-gray-700">CodeConverter</a>
            <a href="#" className="text-base font-medium text-black hover:text-gray-700">CodeExplainer</a>
            <a href="#" className="text-base font-medium text-black hover:text-gray-700">Login</a>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'light' ? <><Moon className="w-4 h-4" /> Dark Mode</> : <><Sun className="w-4 h-4" /> Light Mode</>}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
