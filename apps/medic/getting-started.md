# Gaza Care Medic App

## Generating the package.json

```
yarn add react react-dom

```

### Dev dependencies

```
yarn add -D @babel/core @babel/plugin-transform-runtime @babel/preset-env @babel/preset-react @babel/preset-typescript @playwright/test @typescript-eslint/eslint-plugin @typescript-eslint/parser babel-jest babel-loader css-loader dotenv-expand dotenv-webpack drizzle-kit drizzle-orm env-cmd eslint eslint-config-prettier eslint-plugin-jest eslint-plugin-react file-loader git-format-staged html-webpack-plugin husky identity-obj-proxy jest jest-fetch-mock jest-image-snapshot lint-staged prettier react-test-renderer responsive-loader sharp style-loader tsconfig-paths-webpack-plugin typescript typescript-eslint webpack webpack-cli webpack-dev-server
```

### Create a webpack.base.js file

```
const Dotenv = require("dotenv-webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const deps = require("./package.json").dependencies;

module.exports = {
  mode: process.env.NODE_ENV || "development",
  target: "web",
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@actions": path.resolve(__dirname, "src/actions"),
      "@reducer": path.resolve(__dirname, "src/reducer"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@icons": path.resolve(__dirname, "src/assets/icons"),
    },
    extensions: [".ts", ".tsx", "..."],
    plugins: [new TsconfigPathsPlugin({ extensions: [".ts", ".tsx", "..."] })],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    clean: true,
    uniqueName: "GazaCareMedic",
  },
  module: {
    rules: [
      {
        test: /\.m?(j|t)sx?$/,
        exclude: /(\.test.(j|t)sx?$|node_modules)/i,
        include: path.resolve(__dirname, "src"),
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpe?g|png|webp)$/i,
        use: {
          loader: "responsive-loader",
          options: {
            // If you want to enable sharp support:
            adapter: require("responsive-loader/sharp"),
          },
        },
      },
      {
        test: /\.(svg)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new Dotenv({
      allowEmptyValues: true,
      systemvars: true,
      silent: true,
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

```


### Create a webpack.dev.js file

```
const { merge } = require("webpack-merge");
const common = require("./webpack.base.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    port: process.env.PORT,
    historyApiFallback: true,
  },
});

```

### Create a webpack.production.js file

```
const { merge } = require("webpack-merge");
const common = require("./webpack.base.js");

module.exports = merge(common, {
  mode: "production",
});

```

### Create a babel.config.js file

```
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  plugins: ["@babel/plugin-transform-runtime"],
};
```

### Create a jest.config.js file

```
/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  // bail: 0,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "/private/var/folders/kx/3jr_2rh91qd7hrnj1gyyllsh0000gp/T/jest_dy",

  // Automatically clear mock calls, instances and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: undefined,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'test/coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: ['/node_modules/', '/.storybook/', 'stories.js'],

  // Indicates which provider should be used to instrument code for coverage
  // coverageProvider: "babel",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['json', 'text', 'lcov', 'clover', 'cobertura'],

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,

  // A path to a custom dependency extractor
  // dependencyExtractor: undefined,

  // Make calling deprecated APIs throw helpful error messages
  // errorOnDeprecated: false,

  // Force coverage collection from ignored files using an array of glob patterns
  // forceCoverageMatch: [],

  // A path to a module which exports an async function that is triggered once before all test suites
  // globalSetup: undefined,

  // A path to a module which exports an async function that is triggered once after all test suites
  // globalTeardown: undefined,

  // A set of global variables that need to be available in all test environments
  // globals: {},

  // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
  // maxWorkers: "50%",

  // An array of directory names to be searched recursively up from the requiring module's location
  // moduleDirectories: [
  //   "node_modules"
  // ],

  // An array of file extensions your modules use
  // moduleFileExtensions: [
  //   "js",
  //   "jsx",
  //   "ts",
  //   "tsx",
  //   "json",
  //   "node"
  // ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  // moduleNameMapper: {},

  // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
  // modulePathIgnorePatterns: [],

  // Activates notifications for test results
  // notify: false,

  // An enum that specifies notification mode. Requires { notify: true }
  // notifyMode: "failure-change",

  // A preset that is used as a base for Jest's configuration
  // preset: undefined,

  // Run tests from one or more projects
  // projects: undefined,

  // Use this configuration option to add custom reporters to Jest
  // reporters: undefined,

  // Automatically reset mock state before every test
  // resetMocks: false,

  // Reset the module registry before running each individual test
  // resetModules: false,

  // A path to a custom resolver
  // resolver: undefined,

  // Automatically restore mock state and implementation before every test
  // restoreMocks: false,

  // The root directory that Jest should scan for tests and modules within
  // rootDir: undefined,

  // A list of paths to directories that Jest should use to search for files in
  // roots: [
  //   "<rootDir>"
  // ],

  // Allows you to use a custom runner instead of Jest's default test runner
  // runner: "jest-runner",

  // The paths to modules that run some code to configure or set up the testing environment before each test
  // setupFiles: [],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  // setupFilesAfterEnv: [],

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  // slowTestThreshold: 5,

  // A list of paths to snapshot serializer modules Jest should use for snapshot testing
  // snapshotSerializers: [],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // Options that will be passed to the testEnvironment
  // testEnvironmentOptions: {},

  // Adds a location field to test results
  // testLocationInResults: false,

  // The glob patterns Jest uses to detect test files
  // testMatch: [
  //   "**/__tests__/**/*.[jt]s?(x)",
  //   "**/?(*.)+(spec|test).[tj]s?(x)"
  // ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  // testPathIgnorePatterns: [
  //   "/node_modules/"
  // ],

  // The regexp pattern or array of patterns that Jest uses to detect test files
  // testRegex: [],

  // This option allows the use of a custom results processor
  // testResultsProcessor: undefined,

  // This option allows use of a custom test runner
  // testRunner: "jest-circus/runner",

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  // testURL: "http://localhost",

  // Setting this value to "fake" allows the use of fake timers for functions such as "setTimeout"
  // timers: "real",

  // A map from regular expressions to paths to transformers
  // transform: undefined,

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['/node_modules/', '\\.pnp\\.[^\\/]+$'],

  // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
  // unmockedModulePathPatterns: undefined,

  // Indicates whether each individual test should be reported during the run
  // verbose: undefined,

  // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
  // watchPathIgnorePatterns: [],

  // Whether to use watchman for file crawling
  // watchman: true,

  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy',
    '^@src(.*)': '<rootDir>/src/$1',
    '^@actions(.*)': '<rootDir>/src/actions/$1',
    '^@reducer(.*)': '<rootDir>/src/reducer/$1',
  },
};

```

### Create public/index.html

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Gaza Care" />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
    <!--
         manifest.json provides metadata used when your web app is installed on a
         user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
    <link rel="manifest" href="/manifest.json" />
    <title>Gaza Care Medic</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <!--
         This HTML file is a template.
         If you open it directly in the browser, you will see an empty page.

         You can add webfonts, meta tags, or analytics to this file.
         The build step will place the bundled scripts into the <body> tag.

         To begin the development, run `npm start` or `yarn start`.
         To create a production bundle, use `npm run build` or `yarn build`.
    -->
  </body>
</html>
```

### Create src/index.js

```
import React, { useReducer, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { routes } from './routes';

const container = document.getElementById('root');
container.classList.add('root');
container.classList.add('is-dark');

const root = createRoot(container);

const router = createBrowserRouter([routes]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

```
