// background.js

const DEFAULT_TIMER_DURATION_MINUTES = 60;

function startTimer() {
    chrome.storage.sync.get(['hydrationInterval'], (data) => {
        const intervalInMinutes = data.hydrationInterval || DEFAULT_TIMER_DURATION_MINUTES;
        const TIMER_DURATION = intervalInMinutes * 60 * 1000;

        const targetTime = Date.now() + TIMER_DURATION;
        chrome.storage.local.set({ targetTime }, () => {
            chrome.alarms.create('sipAlarm', { when: targetTime });
        });
    });
}

// When extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    startTimer();
});

// Listen for our alarm
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'sipAlarm') {
        chrome.notifications.create(
            '',
            {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('icons/icon48.png'),
                title: 'Sip Signal',
                message: 'Time for a sip! 💧',
                priority: 2
            },
        );

        // Restart for the next cycle
        startTimer();
    }
});

// Allow manual resets (from popup or any other part)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'resetTimer') {
        startTimer();
        sendResponse({ status: 'timer-reset' });
    }
});
