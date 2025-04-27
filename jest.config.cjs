/** @type {import('ts-jest').JestConfigWithTsJest} */
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "<rootDir>/node_modules/jest-environment-jsdom",
  testEnvironmentOptions: {
    customExportConditions: ["node"],
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  globals: {
    "ts-jest": {
    }
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
};