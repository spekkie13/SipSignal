const { updateHydrationUI } = require('../src/core/popupLogic');

describe('Popup UI Logic', () => {
    test('shows progress message correctly', () => {
        const result = updateHydrationUI(1200, 2000);
        expect(result.message).toBe("You've had 1200ml today");
        expect(result.percent).toBeCloseTo(60);
    });

    test('caps percentage at 100', () => {
        const result = updateHydrationUI(2500, 2000);
        expect(result.percent).toBe(100);
        expect(result.message).toBe("Goal reached!");
    });

    test('displays goal reached message when at 100%', () => {
        const result = updateHydrationUI(2000, 2000);
        expect(result.message).toBe("Goal reached!");
    });
});
