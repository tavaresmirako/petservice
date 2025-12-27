import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-[100] p-1.5 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition-all duration-300 flex items-center justify-center backdrop-blur-sm border border-black/5 dark:border-white/5 shadow-sm"
      aria-label="Alternar tema"
    >
      <Moon className="icon-moon w-4 h-4 text-slate-700 dark:text-slate-200" />
      <Sun className="icon-sun w-4 h-4 text-yellow-400" />
    </button>
  );
};

export default ThemeToggle;
