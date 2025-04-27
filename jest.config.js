/** @type {import('ts-jest').JestConfigWithTsJest} **/
/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  globals: {
    "ts-jest": {
      useESM: true
    }
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
};