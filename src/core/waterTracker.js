function addWater(currentAmount, amountToAdd) {
    return currentAmount + amountToAdd;
}

function isGoalReached(currentAmount, dailyGoal) {
    return currentAmount >= dailyGoal;
}

function resetWaterIntake() {
    return 0;
}

function getRemainingWater(currentAmount, dailyGoal) {
    return Math.max(dailyGoal - currentAmount, 0);
}

function getHydrationPercentage(currentAmount, dailyGoal) {
    if (dailyGoal === 0) return 0;
    return Math.min((currentAmount / dailyGoal) * 100, 100);
}

function shouldTriggerReminder(lastDrinkTimestamp, intervalMinutes, currentTime) {
    const elapsed = (currentTime - lastDrinkTimestamp) / 60000;
    return elapsed >= intervalMinutes;
}

module.exports = {
    addWater,
    isGoalReached,
    resetWaterIntake,
    getRemainingWater,
    getHydrationPercentage,
    shouldTriggerReminder
};
