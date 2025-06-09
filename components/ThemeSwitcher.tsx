'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon, FaDesktop } from 'react-icons/fa';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setTheme('light')}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Light Mode"
      >
        <FaSun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Dark Mode"
      >
        <FaMoon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </button>

      <button
        onClick={() => setTheme('system')}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="System Mode"
      >
        <FaDesktop className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </button>
    </div>
  );
}
