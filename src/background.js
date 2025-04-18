// background.js

const TIMER_DURATION = 45 * 60 * 1000; // 5 minutes for testing

/**
 * Start or restart the hydration timer:
 *  - Compute and store the next targetTime
 *  - Schedule a chrome.alarms alarm for that moment
 */
function startTimer() {
    const targetTime = Date.now() + TIMER_DURATION;
    chrome.storage.local.set({ targetTime }, () => {
        console.log('[HydrateMe] Timer set to fire at', new Date(targetTime).toLocaleTimeString());
        chrome.alarms.create('sipAlarm', { when: targetTime });
    });
}

// When extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log('[HydrateMe] Installed/updated, starting timer');
    startTimer();
});

// Listen for our alarm
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'sipAlarm') {
        console.log('[HydrateMe] Alarm fired:', alarm);

        // Fire a Chrome notification
        chrome.notifications.create(
            /* notificationId */ '',
            /* options */ {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('icons/icon48.png'),
                title: 'Sip Signal',
                message: 'Time for a sip! 💧',
                priority: 2
            },
            /* callback */ (notifId) => {
                console.log('[HydrateMe] Notification shown, id:', notifId);
            }
        );

        // Restart for the next cycle
        startTimer();
    }
});

// Allow manual resets (from popup or any other part)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'resetTimer') {
        console.log('[HydrateMe] resetTimer message received');
        startTimer();
        sendResponse({ status: 'timer-reset' });
    }
});
