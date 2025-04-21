// background.js

const DEFAULT_TIMER_DURATION_MINUTES = 60;

/**
 * Start or restart the hydration timer:
 *  - Fetch user-defined interval from chrome.storage.sync
 *  - Compute and store the next targetTime
 *  - Schedule a chrome.alarms alarm for that moment
 */
function startTimer() {
    chrome.storage.sync.get(['hydrationInterval'], (data) => {
        const intervalInMinutes = data.hydrationInterval || DEFAULT_TIMER_DURATION_MINUTES;
        const TIMER_DURATION = intervalInMinutes * 60 * 1000;

        const targetTime = Date.now() + TIMER_DURATION;
        chrome.storage.local.set({ targetTime }, () => {
            console.log('[Sip Signal] Timer set to fire at', new Date(targetTime).toLocaleTimeString());
            chrome.alarms.create('sipAlarm', { when: targetTime });
        });
    });
}

// When extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log('[Sip Signal] Installed/updated, starting timer');
    startTimer();
});

// Listen for our alarm
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'sipAlarm') {
        console.log('[Sip Signal] Alarm fired:', alarm);

        chrome.notifications.create(
            '',
            {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('icons/icon48.png'),
                title: 'Sip Signal',
                message: 'Time for a sip! 💧',
                priority: 2
            },
            (notifId) => {
                console.log('[Sip Signal] Notification shown, id:', notifId);
            }
        );

        // Restart for the next cycle
        startTimer();
    }
});

// Allow manual resets (from popup or any other part)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'resetTimer') {
        console.log('[Sip Signal] resetTimer message received');
        startTimer();
        sendResponse({ status: 'timer-reset' });
    }
});
