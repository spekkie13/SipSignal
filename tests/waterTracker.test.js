const {
    addWater,
    isGoalReached,
    resetWaterIntake,
    getRemainingWater,
    getHydrationPercentage,
    shouldTriggerReminder
} = require('../src/core/waterTracker');

describe('Water Tracker Core Logic', () => {
    test('addWater adds correctly', () => {
        expect(addWater(500, 300)).toBe(800);
    });

    test('isGoalReached detects true', () => {
        expect(isGoalReached(2000, 2000)).toBe(true);
        expect(isGoalReached(2500, 2000)).toBe(true);
    });

    test('isGoalReached detects false', () => {
        expect(isGoalReached(1500, 2000)).toBe(false);
    });

    test('resetWaterIntake returns 0', () => {
        expect(resetWaterIntake()).toBe(0);
    });

    test('getRemainingWater calculates remaining correctly', () => {
        expect(getRemainingWater(1200, 2000)).toBe(800);
        expect(getRemainingWater(2200, 2000)).toBe(0);
    });

    test('getHydrationPercentage returns correct percentage', () => {
        expect(getHydrationPercentage(1000, 2000)).toBe(50);
        expect(getHydrationPercentage(2000, 2000)).toBe(100);
        expect(getHydrationPercentage(2500, 2000)).toBe(100);
        expect(getHydrationPercentage(1000, 0)).toBe(0);
    });

    test('shouldTriggerReminder works correctly', () => {
        const now = Date.now();
        const tenMinutesAgo = now - 10 * 60 * 1000;
        const fiveMinutesAgo = now - 5 * 60 * 1000;

        expect(shouldTriggerReminder(tenMinutesAgo, 10, now)).toBe(true);
        expect(shouldTriggerReminder(fiveMinutesAgo, 10, now)).toBe(false);
    });
});
