"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timing_1 = require("../timing");
describe('Timing Utilities', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.spyOn(global, 'setTimeout');
    });
    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });
    describe('delay', () => {
        it('should delay for the specified time', async () => {
            const delayPromise = (0, timing_1.delay)(1000);
            expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
            jest.runAllTimers();
            await expect(delayPromise).resolves.toBeUndefined();
        });
        it('should handle zero delay', async () => {
            const delayPromise = (0, timing_1.delay)(0);
            expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 0);
            jest.runAllTimers();
            await expect(delayPromise).resolves.toBeUndefined();
        });
    });
    describe('randomDelay', () => {
        it('should delay between min and max time', async () => {
            const min = 1000;
            const max = 2000;
            const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5);
            const delayPromise = (0, timing_1.randomDelay)(min, max);
            // With Math.random() = 0.5, delay should be 1500
            expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 1500);
            jest.runAllTimers();
            await expect(delayPromise).resolves.toBeUndefined();
            mockRandom.mockRestore();
        });
        it('should handle min equal to max', async () => {
            const time = 1000;
            const mockRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5);
            const delayPromise = (0, timing_1.randomDelay)(time, time);
            expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), time);
            jest.runAllTimers();
            await expect(delayPromise).resolves.toBeUndefined();
            mockRandom.mockRestore();
        });
        it('should handle edge cases of Math.random', async () => {
            const min = 1000;
            const max = 2000;
            // Test with Math.random() = 0
            const mockRandomMin = jest.spyOn(Math, 'random').mockReturnValue(0);
            const minDelayPromise = (0, timing_1.randomDelay)(min, max);
            expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), min);
            jest.runAllTimers();
            await expect(minDelayPromise).resolves.toBeUndefined();
            mockRandomMin.mockRestore();
            // Test with Math.random() = 0.99999...
            const mockRandomMax = jest.spyOn(Math, 'random').mockReturnValue(0.999999999);
            const maxDelayPromise = (0, timing_1.randomDelay)(min, max);
            expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), max);
            jest.runAllTimers();
            await expect(maxDelayPromise).resolves.toBeUndefined();
            mockRandomMax.mockRestore();
        });
    });
});
