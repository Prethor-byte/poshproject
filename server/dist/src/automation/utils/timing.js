"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomDelay = exports.delay = void 0;
/**
 * Introduces a delay in the execution
 * @param ms Milliseconds to delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.delay = delay;
/**
 * Generates a random delay between min and max milliseconds
 * @param min Minimum delay in milliseconds
 * @param max Maximum delay in milliseconds
 */
const randomDelay = (min, max) => {
    const delay = Math.floor(Math.random() * (max - min + 1) + min);
    return new Promise(resolve => setTimeout(resolve, delay));
};
exports.randomDelay = randomDelay;
