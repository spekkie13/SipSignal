import React, {useState, useRef, useEffect} from 'react';
import Timer from './components/Timer';
import WaterLog from './components/WaterLog';
import ProgressBar from './components/ProgressBar';

export default function App() {
    const [total, setTotal] = useState(1250);
    const [darkMode, setDarkMode] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [interval, setIntervalSetting] = useState(60);
    const [waterGoal, setWaterGoal] = useState(5000);
    const [settingsSaved, setSettingsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const timerRef = useRef(null);

    // On the component mount, load the dark mode preference from localStorage.
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

        chrome.storage.sync.get(['hydrationInterval', 'waterGoal'], (data) => {
            if (data.hydrationInterval) setIntervalSetting(data.hydrationInterval);
            if (data.waterGoal) setWaterGoal(data.waterGoal);
        });

        chrome.storage.local.get(['totalIntake', 'lastResetDate'], (data) => {
            const today = new Date().toDateString();
            const lastReset = data.lastResetDate;

            if(lastReset !== today){
                setTotal(0)
                chrome.storage.local.set({ totalIntake: 0, lastResetDate: today });
            } else {
                if(data.totalIntake !== undefined){
                    setTotal(data.totalIntake);
                }
            }
        });
    }, []);

    // Whenever the interval, start time or end time changes, make sure to update it
    useEffect(() => {
        chrome.storage.sync.set({hydrationInterval: interval});
    }, [interval]);

    useEffect(() => {
        chrome.storage.sync.set({waterGoal: waterGoal});
    }, [waterGoal]);

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
        if (total < waterGoal) {
            const newTotal = total + ml;
            setTotal(newTotal);

            chrome.storage.local.set({totalIntake: newTotal})
            // Reset the timer through the Timer's exposed resetTimer method.
            if (timerRef.current) {
                timerRef.current.resetTimer();
            }
        }
    };

    const handleSaveSettings = () => {
        setIsSaving(true); // 🌀 Start spinner
        setSettingsSaved(false); // Clear any old confirmation

        setTimeout(() => {
            chrome.storage.sync.set({
                hydrationInterval: interval,
                waterGoal: waterGoal,
            }, () => {
                chrome.runtime.sendMessage({ action: 'resetTimer' }, (response) => {
                    if (timerRef.current) {
                        timerRef.current.resetTimer();
                    }

                    setShowSettings(false);
                    setIsSaving(false); // 🛑 Stop spinner
                    setSettingsSaved(true);

                    setTimeout(() => setSettingsSaved(false), 1500);
                });
            });
        }, 2000);
    };

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen min-w-full bg-[#EAF4FA] dark:bg-[#121212] flex items-center justify-center p-6 relative overflow-hidden">
                {/* Dark Mode Toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="absolute top-4 right-4 text-sm text-gray-500 dark:text-gray-300 hover:underline transition-colors duration-300"
                >
                    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>

                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="absolute top-4 left-4 text-sm text-gray-500 dark:text-gray-300 hover:underline transition-colors duration-300"
                >
                    ⚙️ Settings
                </button>

                <div className="relative w-full max-w-md min-h-[360px] bg-[#F9FBFD] dark:bg-[#1A1B1E] p-6 rounded-3xl shadow-xl space-y-6 z-10">
                    <header className="flex flex-col sm:flex-row justify-between items-center">
                        {showSettings && (
                            <div className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 mt-4 space-y-4 shadow-sm bg-white/60 dark:bg-white/5 backdrop-blur-sm transition">
                                {/* Settings Title (optional) */}
                                <h2 className="text-lg font-semibold text-[#1B2E4B] dark:text-white text-center">
                                    ⚙️ Settings
                                </h2>

                                {/* Interval Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Reminder Interval (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        min="5"
                                        max="180"
                                        step="5"
                                        value={interval}
                                        onChange={(e) => setIntervalSetting(parseInt(e.target.value))}
                                        className="mt-1 block w-full rounded-md bg-white dark:bg-[#2A2A2A] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-3 py-2"
                                    />
                                </div>

                                {/* Interval Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Water Goal (ml)
                                    </label>
                                    <input
                                        type="number"
                                        min="100"
                                        step="50"
                                        value={waterGoal}
                                        onChange={(e) => setWaterGoal(parseInt(e.target.value))}
                                        className="mt-1 block w-full rounded-md bg-white dark:bg-[#2A2A2A] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-3 py-2"
                                    />
                                </div>

                                {/* Button & Feedback */}
                                <div className="flex flex-col items-center justify-center mt-4 space-y-2">
                                    <button
                                        onClick={handleSaveSettings}
                                        disabled={isSaving}
                                        className="px-5 py-2 bg-[#4A7C94] text-white font-semibold rounded-full shadow-sm hover:bg-[#3B657C] transition transform hover:scale-105 flex items-center gap-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                        fill="none"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                    />
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            'Update Settings'
                                        )}
                                    </button>

                                    {settingsSaved && (
                                        <span className="text-sm text-green-600 dark:text-green-400 transition-opacity duration-300">
          ✅ Settings updated
        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <h1 className="text-xl font-bold text-[#1B2E4B] dark:text-white">Sip Signal</h1>
                        <div className="mt-1 sm:mt-0 text-sm text-gray-500 dark:text-gray-300">
                            Good afternoon!
                        </div>
                    </header>

                    <Timer ref={timerRef} goalReached={total >= waterGoal} />
                    <WaterLog onLog={handleLog} disabled={total >= waterGoal}/>
                    <ProgressBar total={total} waterGoal={waterGoal} />
                </div>
            </div>
        </div>
    );
}
