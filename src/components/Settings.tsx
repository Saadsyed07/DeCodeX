'use client';

import { useState } from 'react';
import { useTheme } from '@/lib/ThemeProvider';
import { Download, Sun, Moon, Globe, MessageSquare } from 'lucide-react';
import { exportToPDF } from '@/lib/pdfExport';

interface SettingsProps {
  explanation: string;
  onToneChange: (tone: string) => void;
  onLanguageChange: (language: string) => void;
}

export default function Settings({ explanation, onToneChange, onLanguageChange }: SettingsProps) {
  const { theme, toggleTheme } = useTheme();
  const [tone, setTone] = useState('professional');
  const [language, setLanguage] = useState('english');

  const handleToneChange = (newTone: string) => {
    setTone(newTone);
    onToneChange(newTone);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  const handleDownloadPDF = () => {
    if (explanation) {
      exportToPDF(explanation, 'code-explanation.pdf');
    }
  };

  return (
    <div className="sticky top-6 space-y-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-1">
          <MessageSquare className="w-4 h-4" />
          Output Tone
        </label>
        <select
          value={tone}
          onChange={(e) => handleToneChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
          <option value="technical">Technical</option>
          <option value="simplified">Simplified</option>
          <option value="detailed">Detailed</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-1">
          <Globe className="w-4 h-4" />
          Output Language
        </label>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="english">English</option>
          <option value="spanish">Spanish</option>
          <option value="french">French</option>
          <option value="german">German</option>
          <option value="chinese">Chinese</option>
          <option value="japanese">Japanese</option>
          <option value="korean">Korean</option>
          <option value="hindi">Hindi</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={toggleTheme}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-4 h-4" />
              Dark Mode
            </>
          ) : (
            <>
              <Sun className="w-4 h-4" />
              Light Mode
            </>
          )}
        </button>
        
        <button
          onClick={handleDownloadPDF}
          disabled={!explanation}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
}