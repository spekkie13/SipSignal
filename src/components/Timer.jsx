import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const Timer = forwardRef(({ goalReached }, ref) => {
    const [remaining, setRemaining] = useState(45 * 60);
    const [showSipModal, setShowSipModal] = useState(false);
    const [intervalMinutes, setIntervalMinutes] = useState(60);

    const updateRemaining = () => {
        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
            chrome.storage.local.get(['targetTime'], (data) => {
                if (data.targetTime) {
                    const diff = Math.max(Math.floor((data.targetTime - Date.now()) / 1000), 0);
                    setRemaining(diff);
                }
            });
        }
    };

    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
            chrome.storage.sync.get(['hydrationInterval'], (data) => {
                if (data.hydrationInterval) {
                    setIntervalMinutes(data.hydrationInterval);
                }
            });
        }

        updateRemaining();
        const intervalId = setInterval(updateRemaining, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (remaining === 0 && !goalReached) {
            setShowSipModal(true);
        }
    }, [remaining, goalReached]);

    useImperativeHandle(ref, () => ({
        resetTimer() {
            if (typeof chrome !== 'undefined') {
                chrome.runtime.sendMessage({ action: 'resetTimer' }, () => {
                    updateRemaining();
                });
            }
        },
    }));

    const handleCloseModal = () => {
        setShowSipModal(false);
        if (typeof chrome !== 'undefined') {
            chrome.runtime.sendMessage({ action: 'resetTimer' }, () => {
                updateRemaining();
            });
        }
    };

    const formatTime = (s) => {
        const hours = Math.floor(s / 3600);
        const minutes = Math.floor((s % 3600) / 60);
        const seconds = s % 60;

        if (hours > 0) {
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
            return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    };

    return (
        <>
            <div className="text-center space-y-4 relative w-full flex flex-col items-center">
                {goalReached ? (
                    <>
                        <div
                            className="text-xl font-semibold text-green-600 dark:text-green-400 transition-colors text-center"
                            style={{ minWidth: '10ch' }}
                        >
                            You're all set for today! ✅
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300 transition-colors">
                            No more reminders needed 💧
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-sm text-gray-500 dark:text-gray-300 transition-colors">
                            Next reminder in...
                        </div>
                        <div
                            className="text-5xl font-bold font-mono tracking-wide text-[#1B2E4B] dark:text-white transition-colors text-center"
                            style={{ minWidth: '10ch' }}
                        >
                            {formatTime(remaining)}
                        </div>
                    </>
                )}

                {/* Invisible width placeholder to keep layout consistent */}
                <div className="invisible absolute text-5xl font-bold font-mono">
                    00:00:00
                </div>
            </div>

            {showSipModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-xl text-center space-y-4">
                        <h2 className="text-2xl font-bold text-[#1B2E4B] dark:text-white">
                            Time for a Sip! 💧
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Please take a sip of water to stay hydrated.
                        </p>
                        <button
                            onClick={handleCloseModal}
                            className="mt-2 px-4 py-2 bg-[#4A7C94] text-white font-semibold rounded-full shadow-sm hover:bg-[#3B657C] transition transform hover:scale-105"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
});

export default Timer;
