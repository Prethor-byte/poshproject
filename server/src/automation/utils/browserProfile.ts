import { v4 as uuidv4 } from 'uuid';
import { AutomationError, ErrorType } from './errors';

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36'
];

const VIEWPORTS = [
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 }
];

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles'
];

const US_LOCATIONS = [
  { latitude: 40.7128, longitude: -74.0060 }, // New York
  { latitude: 34.0522, longitude: -118.2437 }, // Los Angeles
  { latitude: 41.8781, longitude: -87.6298 }, // Chicago
  { latitude: 29.7604, longitude: -95.3698 }  // Houston
];

export interface BrowserProfile {
  id: string;
  userAgent: string;
  viewport: { width: number; height: number };
  timezone: string;
  geolocation?: { latitude: number; longitude: number };
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export async function createBrowserProfile(): Promise<BrowserProfile> {
  try {
    return {
      id: uuidv4(),
      userAgent: getRandomElement(USER_AGENTS),
      viewport: getRandomElement(VIEWPORTS),
      timezone: getRandomElement(TIMEZONES),
      geolocation: getRandomElement(US_LOCATIONS)
    };
  } catch (error) {
    throw new AutomationError('Failed to create browser profile', ErrorType.SETUP_FAILED);
  }
}
