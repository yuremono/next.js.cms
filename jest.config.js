const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Next.jsアプリのディレクトリを指定
  dir: "./",
});

// Jest の設定オブジェクト
const customJestConfig = {
  // テスト環境を設定
  testEnvironment: "jsdom",

  // セットアップファイル
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // モジュールパスマッピング
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // テストファイルのパターン
  testMatch: [
    "**/__tests__/**/*.(js|jsx|ts|tsx)",
    "**/*.(test|spec).(js|jsx|ts|tsx)",
  ],

  // カバレッジ設定
  collectCoverageFrom: [
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "app/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
  ],

  // カバレッジの閾値
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // テスト前の環境変数設定
  setupFiles: ["<rootDir>/jest.env.js"],

  // トランスフォーム設定
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },

  // モックファイル
  modulePathIgnorePatterns: ["<rootDir>/.next/"],

  // テストタイムアウト
  testTimeout: 10000,
};

// Next.js の設定と統合
module.exports = createJestConfig(customJestConfig);
 