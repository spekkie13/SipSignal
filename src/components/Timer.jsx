import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';

const Timer = forwardRef(({ goalReached }, ref) => {
    // Local state for remaining seconds.
    const [remaining, setRemaining] = useState(45 * 60);
    const [showSipModal, setShowSipModal] = useState(false);

    // Helper function: update the 'remaining' state based on stored targetTime.
    const updateRemaining = () => {
        chrome.storage.local.get(['targetTime'], (data) => {
            if (data.targetTime) {
                const diff = Math.max(Math.floor((data.targetTime - Date.now()) / 1000), 0);
                setRemaining(diff);
            }
        });
    };

    // On component mount, set an interval to update remaining time every second.
    useEffect(() => {
        updateRemaining(); // initial update
        const intervalId = setInterval(updateRemaining, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // When remaining reaches 0 (and goal is not reached), show the modal.
    useEffect(() => {
        if (remaining === 0 && !goalReached) {
            setShowSipModal(true);
        }
    }, [remaining, goalReached]);

    // Expose the resetTimer method so parent components can trigger it.
    useImperativeHandle(ref, () => ({
        resetTimer() {
            chrome.runtime.sendMessage({ action: 'resetTimer' }, (response) => {
                console.log(response);
                // After resetting, immediately update the remaining time.
                updateRemaining();
            });
        },
    }));

    // Helper to format seconds into MM:SS.
    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    // When the modal is closed, reset the timer (via background.js).
    const handleCloseModal = () => {
        setShowSipModal(false);
        chrome.runtime.sendMessage({ action: 'resetTimer' }, (response) => {
            console.log(response);
            updateRemaining();
        });
    };

    if (goalReached) {
        return (
            <div className="text-center space-y-2">
                <div className="text-xl font-semibold text-green-600 dark:text-green-400 transition-colors">
                    You're all set for today! ✅
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300 transition-colors">
                    No more reminders needed 💧
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="text-center space-y-4">
                <div className="text-sm text-gray-500 dark:text-gray-300 transition-colors">
                    Next reminder in...
                </div>
                <div className="text-5xl font-bold tracking-wide text-[#1B2E4B] dark:text-white transition-colors">
                    {formatTime(remaining)}
                </div>
            </div>

            {/* Modal Pop-up for Sip Notification */}
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
