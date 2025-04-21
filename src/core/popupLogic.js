function updateHydrationUI(current, goal) {
    const percent = Math.min((current / goal) * 100, 100);
    return {
        message: percent >= 100 ? "Goal reached!" : `You've had ${current}ml today`,
        percent: percent
    };
}

module.exports = { updateHydrationUI };
