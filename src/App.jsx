import React, { useState, useRef, useEffect } from 'react';
import Timer from './components/Timer';
import WaterLog from './components/WaterLog';
import ProgressBar from './components/ProgressBar';

export default function App() {
  const [total, setTotal] = useState(1250);
  const [darkMode, setDarkMode] = useState(false);
  const goal = 2500;
  const timerRef = useRef(null);

  // On component mount, load the dark mode preference from localStorage.
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      const mode = JSON.parse(savedMode);
      setDarkMode(mode);
      // Also update the HTML root class
      if (mode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Whenever dark mode changes, update the HTML class and persist the setting.
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Handler when a sip is logged.
  const handleLog = (ml) => {
    if (total < goal) {
      setTotal((prev) => prev + ml);
      // Reset the timer through the Timer's exposed resetTimer method.
      if (timerRef.current) {
        timerRef.current.resetTimer();
      }
    }
  };

  return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-[#EAF4FA] dark:bg-[#121212] flex items-center justify-center p-6 relative overflow-hidden">
          {/* Dark Mode Toggle */}
          <button
              onClick={() => setDarkMode(!darkMode)}
              className="absolute top-4 right-4 text-sm text-gray-500 dark:text-gray-300 hover:underline transition-colors duration-300"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>

          <div className="relative w-full max-w-md bg-[#F9FBFD] dark:bg-[#1A1B1E] p-6 rounded-3xl shadow-xl space-y-6 z-10">
            <header className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-xl font-bold text-[#1B2E4B] dark:text-white">Sip Signal</h1>
              <div className="mt-1 sm:mt-0 text-sm text-gray-500 dark:text-gray-300">
                Good afternoon!
              </div>
            </header>

            <Timer ref={timerRef} goalReached={total >= goal} />
            <WaterLog onLog={handleLog} disabled={total >= goal} />
            <ProgressBar total={total} goal={goal} />
          </div>
        </div>
      </div>
  );
}
