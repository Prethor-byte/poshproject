/**
 * Introduces a delay in the execution
 * @param ms Milliseconds to delay
 */
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates a random delay between min and max milliseconds
 * @param min Minimum delay in milliseconds
 * @param max Maximum delay in milliseconds
 */
export const randomDelay = (min: number, max: number): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1) + min);
  return new Promise(resolve => setTimeout(resolve, delay));
};
